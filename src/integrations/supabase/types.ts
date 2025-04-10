export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      albums: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          cover_image_url: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          is_public: boolean
          location: string | null
          name: string
          photo_count: number
          share_code: string | null
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          name: string
          photo_count?: number
          share_code?: string | null
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          name?: string
          photo_count?: number
          share_code?: string | null
          user_id?: string
        }
        Relationships: []
      }
      face_profiles: {
        Row: {
          created_at: string
          embedding: number[]
          id: string
          name: string
          reference_photo_url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          embedding: number[]
          id?: string
          name: string
          reference_photo_url: string
          user_id: string
        }
        Update: {
          created_at?: string
          embedding?: number[]
          id?: string
          name?: string
          reference_photo_url?: string
          user_id?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          album_id: string | null
          content_type: string
          context: string | null
          created_at: string
          embedding: number[] | null
          event_id: string | null
          faces: string[] | null
          id: string
          metadata: Json | null
          name: string
          size: number
          storage_path: string
          tags: string[] | null
          url: string
          user_id: string
        }
        Insert: {
          album_id?: string | null
          content_type: string
          context?: string | null
          created_at?: string
          embedding?: number[] | null
          event_id?: string | null
          faces?: string[] | null
          id?: string
          metadata?: Json | null
          name: string
          size: number
          storage_path: string
          tags?: string[] | null
          url: string
          user_id: string
        }
        Update: {
          album_id?: string | null
          content_type?: string
          context?: string | null
          created_at?: string
          embedding?: number[] | null
          event_id?: string | null
          faces?: string[] | null
          id?: string
          metadata?: Json | null
          name?: string
          size?: number
          storage_path?: string
          tags?: string[] | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_links: {
        Row: {
          created_at: string
          event_id: string
          expires_at: string | null
          id: string
          requires_face_auth: boolean
          share_code: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          expires_at?: string | null
          id?: string
          requires_face_auth?: boolean
          share_code: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          expires_at?: string | null
          id?: string
          requires_face_auth?: boolean
          share_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_links_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_event_photo_count: {
        Args: { event_id: string }
        Returns: undefined
      }
      increment_event_photo_count: {
        Args: { event_id: string }
        Returns: undefined
      }
      search_photos: {
        Args: {
          query_embedding: number[]
          search_user_id: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          name: string
          user_id: string
          storage_path: string
          url: string
          size: number
          content_type: string
          metadata: Json
          created_at: string
          album_id: string
          event_id: string
          embedding: number[]
          tags: string[]
          context: string
          faces: string[]
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
