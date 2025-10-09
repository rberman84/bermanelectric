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
      ai_triage_reports: {
        Row: {
          analysis: Json | null
          consent: boolean | null
          created_at: string
          crew_id: string | null
          crew_name: string | null
          hazard_level: string
          hazard_summary: string | null
          id: string
          image_path: string | null
          job_length_minutes: number | null
          job_zip: string | null
          likely_cause: string | null
          model_latency_ms: number | null
          model_used: string | null
          next_steps: string[] | null
          notes: string | null
          triage_reference: string | null
          urgency_level: string
          urgency_minutes: number | null
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          earliest_slot: string | null
          travel_minutes: number | null
        }
        Insert: {
          analysis?: Json | null
          consent?: boolean | null
          created_at?: string
          crew_id?: string | null
          crew_name?: string | null
          hazard_level: string
          hazard_summary?: string | null
          id?: string
          image_path?: string | null
          job_length_minutes?: number | null
          job_zip?: string | null
          likely_cause?: string | null
          model_latency_ms?: number | null
          model_used?: string | null
          next_steps?: string[] | null
          notes?: string | null
          triage_reference?: string | null
          urgency_level: string
          urgency_minutes?: number | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          earliest_slot?: string | null
          travel_minutes?: number | null
        }
        Update: {
          analysis?: Json | null
          consent?: boolean | null
          created_at?: string
          crew_id?: string | null
          crew_name?: string | null
          hazard_level?: string
          hazard_summary?: string | null
          id?: string
          image_path?: string | null
          job_length_minutes?: number | null
          job_zip?: string | null
          likely_cause?: string | null
          model_latency_ms?: number | null
          model_used?: string | null
          next_steps?: string[] | null
          notes?: string | null
          triage_reference?: string | null
          urgency_level?: string
          urgency_minutes?: number | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          earliest_slot?: string | null
          travel_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_triage_reports_crew_id_fkey"
            columns: ["crew_id"]
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          }
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
      crew_calendar: {
        Row: {
          buffer_after_minutes: number
          buffer_before_minutes: number
          created_at: string
          crew_id: string
          end_time: string
          id: string
          job_length_minutes: number
          job_zip: string
          notes: string | null
          source: string
          start_time: string
          status: string
          title: string | null
          travel_minutes: number | null
          updated_at: string
        }
        Insert: {
          buffer_after_minutes?: number
          buffer_before_minutes?: number
          created_at?: string
          crew_id: string
          end_time: string
          id?: string
          job_length_minutes: number
          job_zip: string
          notes?: string | null
          source?: string
          start_time: string
          status?: string
          title?: string | null
          travel_minutes?: number | null
          updated_at?: string
        }
        Update: {
          buffer_after_minutes?: number
          buffer_before_minutes?: number
          created_at?: string
          crew_id?: string
          end_time?: string
          id?: string
          job_length_minutes?: number
          job_zip?: string
          notes?: string | null
          source?: string
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
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          }
        ]
      }
      crew_members: {
        Row: {
          created_at: string
          default_buffer_after_minutes: number
          default_buffer_before_minutes: number
          email: string | null
          home_zip: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_buffer_after_minutes?: number
          default_buffer_before_minutes?: number
          email?: string | null
          home_zip?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_buffer_after_minutes?: number
          default_buffer_before_minutes?: number
          email?: string | null
          home_zip?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
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
      service_requests: {
        Row: {
          address: string
          created_at: string
          description: string
          id: string
          phone: string
          preferred_date: string | null
          service_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          description: string
          id?: string
          phone: string
          preferred_date?: string | null
          service_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          id?: string
          phone?: string
          preferred_date?: string | null
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
