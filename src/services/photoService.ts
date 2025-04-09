
import { supabase } from '@/lib/supabase';
import { Photo } from '@/types/database.types';
import { v4 as uuidv4 } from 'uuid';

// Upload a single photo to Supabase Storage
export const uploadPhoto = async (file: File, userId: string): Promise<Photo | null> => {
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

    return photo;
  } catch (error) {
    console.error('Upload photo error:', error);
    return null;
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

// Delete a photo
export const deletePhoto = async (photoId: string, filePath: string): Promise<boolean> => {
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

    return true;
  } catch (error) {
    console.error('Delete photo error:', error);
    return false;
  }
};
