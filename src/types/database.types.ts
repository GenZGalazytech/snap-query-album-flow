
export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
};

export type Photo = {
  id: string;
  name: string;
  user_id: string;
  storage_path: string;
  url: string;
  size: number;
  content_type: string;
  metadata?: Record<string, any>;
  created_at: string;
  album_id?: string;
  event_id?: string;
  embedding?: number[];
  tags?: string[];
  context?: string;
  faces?: string[];
};

export type Album = {
  id: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  user_id: string;
  created_at: string;
  is_public: boolean;
};

export type Event = {
  id: string;
  name: string;
  description?: string;
  date: string;
  location?: string;
  user_id: string;
  created_at: string;
  cover_image_url?: string;
  photo_count: number;
  share_code?: string;
  is_public: boolean;
};

export type FaceProfile = {
  id: string;
  user_id: string;
  name: string;
  embedding: number[];
  reference_photo_url: string;
  created_at: string;
};

export type SharedLink = {
  id: string;
  event_id: string;
  user_id: string;
  share_code: string;
  requires_face_auth: boolean;
  created_at: string;
  expires_at?: string;
};
