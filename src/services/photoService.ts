
import { supabase } from '@/lib/supabase';
import { Photo, FaceProfile } from '@/types/database.types';
import { v4 as uuidv4 } from 'uuid';
import { incrementEventPhotoCount, decrementEventPhotoCount } from './eventService';

// Upload a single photo to Supabase Storage
export const uploadPhoto = async (
  file: File, 
  userId: string, 
  eventId?: string,
  albumId?: string
): Promise<Photo | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('photos')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('photos')
      .getPublicUrl(filePath);

    // Extract context and tags using AI analysis
    const { context, tags, embedding } = await analyzeImage(publicUrl);
    
    // Detect faces
    const faces = await detectFaces(publicUrl);

    // Save metadata to the photos table
    const { data: photo, error: dbError } = await supabase
      .from('photos')
      .insert({
        name: file.name,
        user_id: userId,
        storage_path: filePath,
        url: publicUrl,
        size: file.size,
        content_type: file.type,
        event_id: eventId,
        album_id: albumId,
        context,
        tags,
        embedding,
        faces,
        metadata: {
          lastModified: file.lastModified,
        },
      })
      .select('*')
      .single();

    if (dbError) {
      console.error('Error saving photo metadata:', dbError);
      throw dbError;
    }

    // Increment event photo count if eventId is provided
    if (eventId) {
      await incrementEventPhotoCount(eventId);
    }

    return photo;
  } catch (error) {
    console.error('Upload photo error:', error);
    return null;
  }
};

// Analyze image to extract context, tags, and generate embeddings
const analyzeImage = async (imageUrl: string): Promise<{ 
  context: string;
  tags: string[];
  embedding: number[];
}> => {
  try {
    // Call to Supabase Edge Function for image analysis
    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: { imageUrl }
    });

    if (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }

    return {
      context: data.context || '',
      tags: data.tags || [],
      embedding: data.embedding || []
    };
  } catch (error) {
    console.error('Image analysis error:', error);
    // Return default values if analysis fails
    return {
      context: '',
      tags: [],
      embedding: []
    };
  }
};

// Detect faces in an image
const detectFaces = async (imageUrl: string): Promise<string[]> => {
  try {
    // Call to Supabase Edge Function for face detection
    const { data, error } = await supabase.functions.invoke('detect-faces', {
      body: { imageUrl }
    });

    if (error) {
      console.error('Error detecting faces:', error);
      throw error;
    }

    return data.faceIds || [];
  } catch (error) {
    console.error('Face detection error:', error);
    return [];
  }
};

// Get all photos for a user
export const getUserPhotos = async (userId: string): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Get user photos error:', error);
    return [];
  }
};

// Get photos by album id
export const getPhotosByAlbum = async (albumId: string): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching album photos:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Get album photos error:', error);
    return [];
  }
};

// Get photos by event id
export const getPhotosByEvent = async (eventId: string): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching event photos:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Get event photos error:', error);
    return [];
  }
};

// Delete a photo
export const deletePhoto = async (photoId: string, filePath: string, eventId?: string): Promise<boolean> => {
  try {
    // Delete from storage
    const { error: storageError } = await supabase
      .storage
      .from('photos')
      .remove([filePath]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      throw storageError;
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);

    if (dbError) {
      console.error('Error deleting photo from database:', dbError);
      throw dbError;
    }

    // Decrement event photo count if eventId is provided
    if (eventId) {
      await decrementEventPhotoCount(eventId);
    }

    return true;
  } catch (error) {
    console.error('Delete photo error:', error);
    return false;
  }
};

// Search photos by text query
export const searchPhotos = async (userId: string, query: string): Promise<Photo[]> => {
  try {
    // Get query embedding from Supabase Edge Function
    const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke('generate-embedding', {
      body: { text: query }
    });

    if (embeddingError) {
      console.error('Error generating query embedding:', embeddingError);
      throw embeddingError;
    }

    const queryEmbedding = embeddingData.embedding;

    // Search photos using vector similarity
    const { data, error } = await supabase.rpc('search_photos', {
      query_embedding: queryEmbedding,
      user_id: userId,
      match_threshold: 0.7,
      match_count: 50
    });

    if (error) {
      console.error('Error searching photos:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Search photos error:', error);
    return [];
  }
};

// Create a face profile
export const createFaceProfile = async (
  userId: string,
  name: string,
  referenceImageUrl: string
): Promise<FaceProfile | null> => {
  try {
    // Extract face embedding from reference image
    const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke('extract-face-embedding', {
      body: { imageUrl: referenceImageUrl }
    });

    if (embeddingError) {
      console.error('Error extracting face embedding:', embeddingError);
      throw embeddingError;
    }

    const faceEmbedding = embeddingData.embedding;

    // Save face profile to database
    const { data, error } = await supabase
      .from('face_profiles')
      .insert({
        user_id: userId,
        name,
        embedding: faceEmbedding,
        reference_photo_url: referenceImageUrl
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating face profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Create face profile error:', error);
    return null;
  }
};

// Get photos by face
export const getPhotosByFace = async (faceId: string, userId: string): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('user_id', userId)
      .contains('faces', [faceId])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos by face:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Get photos by face error:', error);
    return [];
  }
};

// Verify face for access
export const verifyFaceForAccess = async (
  selfieImageUrl: string,
  eventId: string
): Promise<boolean> => {
  try {
    // Call Supabase Edge Function to verify face
    const { data, error } = await supabase.functions.invoke('verify-face-access', {
      body: { 
        selfieImageUrl,
        eventId
      }
    });

    if (error) {
      console.error('Error verifying face for access:', error);
      throw error;
    }

    return data.hasAccess || false;
  } catch (error) {
    console.error('Verify face access error:', error);
    return false;
  }
};

// Download all photos from an event as a zip
export const downloadEventPhotos = async (eventId: string): Promise<string | null> => {
  try {
    // Call Supabase Edge Function to generate download link
    const { data, error } = await supabase.functions.invoke('generate-download-link', {
      body: { eventId }
    });

    if (error) {
      console.error('Error generating download link:', error);
      throw error;
    }

    return data.downloadUrl || null;
  } catch (error) {
    console.error('Download event photos error:', error);
    return null;
  }
};
