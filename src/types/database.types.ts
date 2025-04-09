
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
