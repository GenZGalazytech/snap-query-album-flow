
import { supabase } from '@/lib/supabase';
import { Event, Photo } from '@/types/database.types';
import { v4 as uuidv4 } from 'uuid';

// Create a new event
export const createEvent = async (
  name: string,
  date: string,
  userId: string,
  description?: string,
  location?: string,
  isPublic = false
): Promise<Event | null> => {
  try {
    const shareCode = uuidv4().substring(0, 8);
    
    const { data, error } = await supabase
      .from('events')
      .insert({
        name,
        description,
        date,
        location,
        user_id: userId,
        is_public: isPublic,
        share_code: shareCode,
        photo_count: 0
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Create event error:', error);
    return null;
  }
};

// Get all events for a user
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Get user events error:', error);
    return [];
  }
};

// Get event by id
export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Get event error:', error);
    return null;
  }
};

// Get event by share code
export const getEventByShareCode = async (shareCode: string): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('share_code', shareCode)
      .single();

    if (error) {
      console.error('Error fetching event by share code:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Get event by share code error:', error);
    return null;
  }
};

// Update event
export const updateEvent = async (
  eventId: string,
  updates: Partial<Omit<Event, 'id' | 'created_at' | 'user_id'>>
): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating event:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Update event error:', error);
    return null;
  }
};

// Delete event
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  try {
    // Get all photos for this event
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('id, storage_path')
      .eq('event_id', eventId);
    
    if (photosError) {
      console.error('Error fetching event photos:', photosError);
      throw photosError;
    }
    
    // Delete all photos from storage
    if (photos && photos.length > 0) {
      const storagePaths = photos.map(photo => photo.storage_path);
      
      const { error: storageError } = await supabase
        .storage
        .from('photos')
        .remove(storagePaths);
      
      if (storageError) {
        console.error('Error deleting photos from storage:', storageError);
        throw storageError;
      }
      
      // Delete photo records from database
      const { error: photosDbError } = await supabase
        .from('photos')
        .delete()
        .eq('event_id', eventId);
      
      if (photosDbError) {
        console.error('Error deleting photo records:', photosDbError);
        throw photosDbError;
      }
    }
    
    // Delete event
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    if (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Delete event error:', error);
    return false;
  }
};

// Create a shareable link for an event
export const createShareableLink = async (
  eventId: string,
  userId: string,
  requiresFaceAuth: boolean = false,
  expiresInDays?: number
): Promise<string | null> => {
  try {
    const shareCode = uuidv4();
    
    let expiresAt = null;
    if (expiresInDays) {
      const date = new Date();
      date.setDate(date.getDate() + expiresInDays);
      expiresAt = date.toISOString();
    }
    
    const { data, error } = await supabase
      .from('shared_links')
      .insert({
        event_id: eventId,
        user_id: userId,
        share_code: shareCode,
        requires_face_auth: requiresFaceAuth,
        expires_at: expiresAt
      })
      .select('share_code')
      .single();
    
    if (error) {
      console.error('Error creating shareable link:', error);
      throw error;
    }
    
    return data?.share_code || null;
  } catch (error) {
    console.error('Create shareable link error:', error);
    return null;
  }
};

// Get event photos
export const getEventPhotos = async (eventId: string): Promise<Photo[]> => {
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

// Increment photo count for an event
export const incrementEventPhotoCount = async (eventId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('increment_event_photo_count', {
      event_id: eventId
    });
    
    if (error) {
      console.error('Error incrementing photo count:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Increment photo count error:', error);
    return false;
  }
};

// Decrement photo count for an event
export const decrementEventPhotoCount = async (eventId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('decrement_event_photo_count', {
      event_id: eventId
    });
    
    if (error) {
      console.error('Error decrementing photo count:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Decrement photo count error:', error);
    return false;
  }
};
