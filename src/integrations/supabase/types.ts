export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          created_by: string | null
          excerpt: string
          featured: boolean
          id: string
          image_url: string | null
          published_at: string | null
          read_time: string
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          excerpt: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published_at?: string | null
          read_time?: string
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published_at?: string | null
          read_time?: string
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      crew_calendar: {
        Row: {
          buffer_after_minutes: number | null
          buffer_before_minutes: number | null
          created_at: string
          crew_id: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          end_time: string
          id: string
          job_length_minutes: number
          job_zip: string
          notes: string | null
          source: string | null
          start_time: string
          status: string
          title: string | null
          travel_minutes: number | null
          updated_at: string
        }
        Insert: {
          buffer_after_minutes?: number | null
          buffer_before_minutes?: number | null
          created_at?: string
          crew_id: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time: string
          id?: string
          job_length_minutes: number
          job_zip: string
          notes?: string | null
          source?: string | null
          start_time: string
          status?: string
          title?: string | null
          travel_minutes?: number | null
          updated_at?: string
        }
        Update: {
          buffer_after_minutes?: number | null
          buffer_before_minutes?: number | null
          created_at?: string
          crew_id?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time?: string
          id?: string
          job_length_minutes?: number
          job_zip?: string
          notes?: string | null
          source?: string | null
          start_time?: string
          status?: string
          title?: string | null
          travel_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crew_calendar_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_members: {
        Row: {
          active: boolean | null
          created_at: string
          default_buffer_after_minutes: number | null
          default_buffer_before_minutes: number | null
          email: string | null
          home_zip: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          default_buffer_after_minutes?: number | null
          default_buffer_before_minutes?: number | null
          email?: string | null
          home_zip?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          default_buffer_after_minutes?: number | null
          default_buffer_before_minutes?: number | null
          email?: string | null
          home_zip?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      customer_reviews: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          featured: boolean | null
          id: string
          moderation_notes: string | null
          photo_urls: string[] | null
          professionalism: number | null
          rating: number
          review_text: string
          service_quality: number | null
          service_request_id: string | null
          status: string
          title: string
          updated_at: string | null
          user_id: string | null
          would_recommend: boolean | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          moderation_notes?: string | null
          photo_urls?: string[] | null
          professionalism?: number | null
          rating: number
          review_text: string
          service_quality?: number | null
          service_request_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
          would_recommend?: boolean | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          moderation_notes?: string | null
          photo_urls?: string[] | null
          professionalism?: number | null
          rating?: number
          review_text?: string
          service_quality?: number | null
          service_request_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_reviews_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      google_reviews: {
        Row: {
          author_name: string
          author_photo_url: string | null
          created_at: string
          id: string
          rating: number
          review_id: string
          text: string
          time: number
          updated_at: string
        }
        Insert: {
          author_name: string
          author_photo_url?: string | null
          created_at?: string
          id?: string
          rating: number
          review_id: string
          text: string
          time: number
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_photo_url?: string | null
          created_at?: string
          id?: string
          rating?: number
          review_id?: string
          text?: string
          time?: number
          updated_at?: string
        }
        Relationships: []
      }
      google_settings: {
        Row: {
          created_at: string
          id: string
          last_synced_at: string | null
          place_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_synced_at?: string | null
          place_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_synced_at?: string | null
          place_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_media: {
        Row: {
          created_at: string
          file_type: string
          file_url: string
          id: string
          lead_id: string
        }
        Insert: {
          created_at?: string
          file_type: string
          file_url: string
          id?: string
          lead_id: string
        }
        Update: {
          created_at?: string
          file_type?: string
          file_url?: string
          id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_media_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          access_notes: string | null
          address_line1: string
          address_line2: string | null
          budget_range: string | null
          city: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          job_description: string
          job_priority: string
          job_type: string
          phone: string
          preferred_contact_method: string
          referral_code: string | null
          source: string
          state: string
          status: string
          updated_at: string
          zip: string
        }
        Insert: {
          access_notes?: string | null
          address_line1: string
          address_line2?: string | null
          budget_range?: string | null
          city: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          job_description: string
          job_priority: string
          job_type: string
          phone: string
          preferred_contact_method: string
          referral_code?: string | null
          source?: string
          state: string
          status?: string
          updated_at?: string
          zip: string
        }
        Update: {
          access_notes?: string | null
          address_line1?: string
          address_line2?: string | null
          budget_range?: string | null
          city?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          job_description?: string
          job_priority?: string
          job_type?: string
          phone?: string
          preferred_contact_method?: string
          referral_code?: string | null
          source?: string
          state?: string
          status?: string
          updated_at?: string
          zip?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_leads: {
        Row: {
          contact_info: Json | null
          content_preview: string | null
          created_at: string
          description: string | null
          followed_up_at: string | null
          id: string
          lead_type: string | null
          notes: string | null
          priority: string | null
          saved_by: string | null
          source_query: string | null
          status: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          contact_info?: Json | null
          content_preview?: string | null
          created_at?: string
          description?: string | null
          followed_up_at?: string | null
          id?: string
          lead_type?: string | null
          notes?: string | null
          priority?: string | null
          saved_by?: string | null
          source_query?: string | null
          status?: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          contact_info?: Json | null
          content_preview?: string | null
          created_at?: string
          description?: string | null
          followed_up_at?: string | null
          id?: string
          lead_type?: string | null
          notes?: string | null
          priority?: string | null
          saved_by?: string | null
          source_query?: string | null
          status?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          address: string
          completed_at: string | null
          created_at: string
          description: string
          id: string
          internal_notes: string | null
          phone: string
          preferred_date: string | null
          review_requested_at: string | null
          service_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          completed_at?: string | null
          created_at?: string
          description: string
          id?: string
          internal_notes?: string | null
          phone: string
          preferred_date?: string | null
          review_requested_at?: string | null
          service_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          completed_at?: string | null
          created_at?: string
          description?: string
          id?: string
          internal_notes?: string | null
          phone?: string
          preferred_date?: string | null
          review_requested_at?: string | null
          service_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
