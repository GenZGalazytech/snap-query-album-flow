
import { supabase } from '@/lib/supabase';
import { Album } from '@/types/database.types';

// Create a new album
export const createAlbum = async (
  name: string, 
  userId: string, 
  description?: string,
  isPublic = false
): Promise<Album | null> => {
  try {
    const { data, error } = await supabase
      .from('albums')
      .insert({
        name,
        description,
        user_id: userId,
        is_public: isPublic,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating album:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Create album error:', error);
    return null;
  }
};

// Get all albums for a user
export const getUserAlbums = async (userId: string): Promise<Album[]> => {
  try {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching albums:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Get user albums error:', error);
    return [];
  }
};

// Get album by id
export const getAlbumById = async (albumId: string): Promise<Album | null> => {
  try {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('id', albumId)
      .single();

    if (error) {
      console.error('Error fetching album:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Get album error:', error);
    return null;
  }
};

// Update album cover image
export const updateAlbumCover = async (albumId: string, coverImageUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('albums')
      .update({ cover_image_url: coverImageUrl })
      .eq('id', albumId);

    if (error) {
      console.error('Error updating album cover:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Update album cover error:', error);
    return false;
  }
};

// Delete an album
export const deleteAlbum = async (albumId: string): Promise<boolean> => {
  try {
    // First update all photos in this album to have null album_id
    const { error: photoUpdateError } = await supabase
      .from('photos')
      .update({ album_id: null })
      .eq('album_id', albumId);

    if (photoUpdateError) {
      console.error('Error updating photos:', photoUpdateError);
      throw photoUpdateError;
    }

    // Then delete the album
    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', albumId);

    if (error) {
      console.error('Error deleting album:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Delete album error:', error);
    return false;
  }
};

// Add photos to album
export const addPhotosToAlbum = async (albumId: string, photoIds: string[]): Promise<boolean> => {
  try {
    // Update each photo's album_id
    const { error } = await supabase
      .from('photos')
      .update({ album_id: albumId })
      .in('id', photoIds);

    if (error) {
      console.error('Error adding photos to album:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Add photos to album error:', error);
    return false;
  }
};
