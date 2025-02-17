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
      admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          business_name: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          status: string
          submission_type: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone: string
          status?: string
          submission_type: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string
          submission_type?: string
        }
        Relationships: []
      }
      deployment_credentials: {
        Row: {
          created_at: string | null
          host: string
          id: string
          password: string
          provider: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          host: string
          id?: string
          password: string
          provider: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          host?: string
          id?: string
          password?: string
          provider?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      electrician_documents: {
        Row: {
          document_type: string
          document_url: string
          electrician_id: string | null
          id: string
          uploaded_at: string
        }
        Insert: {
          document_type: string
          document_url: string
          electrician_id?: string | null
          id?: string
          uploaded_at?: string
        }
        Update: {
          document_type?: string
          document_url?: string
          electrician_id?: string | null
          id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "electrician_documents_electrician_id_fkey"
            columns: ["electrician_id"]
            isOneToOne: false
            referencedRelation: "electricians"
            referencedColumns: ["id"]
          },
        ]
      }
      electrician_portfolio: {
        Row: {
          created_at: string
          description: string | null
          electrician_id: string | null
          id: string
          image_url: string
          project_date: string | null
          project_type: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          electrician_id?: string | null
          id?: string
          image_url: string
          project_date?: string | null
          project_type?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          electrician_id?: string | null
          id?: string
          image_url?: string
          project_date?: string | null
          project_type?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "electrician_portfolio_electrician_id_fkey"
            columns: ["electrician_id"]
            isOneToOne: false
            referencedRelation: "electricians"
            referencedColumns: ["id"]
          },
        ]
      }
      electrician_reviews: {
        Row: {
          created_at: string
          electrician_id: string | null
          id: string
          job_date: string | null
          job_type: string | null
          rating: number
          review_text: string | null
          reviewer_id: string | null
          verified_job: boolean | null
        }
        Insert: {
          created_at?: string
          electrician_id?: string | null
          id?: string
          job_date?: string | null
          job_type?: string | null
          rating: number
          review_text?: string | null
          reviewer_id?: string | null
          verified_job?: boolean | null
        }
        Update: {
          created_at?: string
          electrician_id?: string | null
          id?: string
          job_date?: string | null
          job_type?: string | null
          rating?: number
          review_text?: string | null
          reviewer_id?: string | null
          verified_job?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "electrician_reviews_electrician_id_fkey"
            columns: ["electrician_id"]
            isOneToOne: false
            referencedRelation: "electricians"
            referencedColumns: ["id"]
          },
        ]
      }
      electrician_specialties: {
        Row: {
          created_at: string
          electrician_id: string | null
          id: string
          specialty: string
        }
        Insert: {
          created_at?: string
          electrician_id?: string | null
          id?: string
          specialty: string
        }
        Update: {
          created_at?: string
          electrician_id?: string | null
          id?: string
          specialty?: string
        }
        Relationships: [
          {
            foreignKeyName: "electrician_specialties_electrician_id_fkey"
            columns: ["electrician_id"]
            isOneToOne: false
            referencedRelation: "electricians"
            referencedColumns: ["id"]
          },
        ]
      }
      electricians: {
        Row: {
          application_status: string | null
          bio: string | null
          created_at: string
          email: string
          first_name: string
          hourly_rate: number
          id: string
          last_name: string
          phone: string
          profile_picture_url: string | null
          service_area: string
          service_radius: number
          user_id: string | null
          years_of_experience: number
        }
        Insert: {
          application_status?: string | null
          bio?: string | null
          created_at?: string
          email: string
          first_name: string
          hourly_rate: number
          id?: string
          last_name: string
          phone: string
          profile_picture_url?: string | null
          service_area: string
          service_radius: number
          user_id?: string | null
          years_of_experience: number
        }
        Update: {
          application_status?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          first_name?: string
          hourly_rate?: number
          id?: string
          last_name?: string
          phone?: string
          profile_picture_url?: string | null
          service_area?: string
          service_radius?: number
          user_id?: string | null
          years_of_experience?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_if_admin: {
        Args: {
          _user_id: string
        }
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
