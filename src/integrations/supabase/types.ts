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
      cities: {
        Row: {
          created_at: string
          id: string
          name_en: string
          name_fr: string
          name_lb: string
          region_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name_en: string
          name_fr: string
          name_lb: string
          region_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name_en?: string
          name_fr?: string
          name_lb?: string
          region_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cities_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string
          id: string
          name_en: string
          name_fr: string
          name_lb: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_en: string
          name_fr: string
          name_lb: string
        }
        Update: {
          created_at?: string
          id?: string
          name_en?: string
          name_fr?: string
          name_lb?: string
        }
        Relationships: []
      }
      school_levels: {
        Row: {
          created_at: string
          id: string
          name_en: string
          name_fr: string
          name_lb: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_en: string
          name_fr: string
          name_lb: string
        }
        Update: {
          created_at?: string
          id?: string
          name_en?: string
          name_fr?: string
          name_lb?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          id: string
          name_en: string
          name_fr: string
          name_lb: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_en: string
          name_fr: string
          name_lb: string
        }
        Update: {
          created_at?: string
          id?: string
          name_en?: string
          name_fr?: string
          name_lb?: string
        }
        Relationships: []
      }
      teacher_locations: {
        Row: {
          created_at: string
          id: string
          location_type: string
          price_per_hour: number
          teacher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_type: string
          price_per_hour: number
          teacher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_type?: string
          price_per_hour?: number
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_locations_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      teacher_school_levels: {
        Row: {
          created_at: string
          id: string
          school_level: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          school_level: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          school_level?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_school_levels_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      teacher_subjects: {
        Row: {
          created_at: string
          id: string
          subject: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          subject: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          subject?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      teachers: {
        Row: {
          bio: string
          city_id: string | null
          created_at: string
          email: string
          facebook_profile: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          profile_picture_url: string | null
          show_email: boolean | null
          show_facebook: boolean | null
          show_phone: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio: string
          city_id?: string | null
          created_at?: string
          email: string
          facebook_profile?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          profile_picture_url?: string | null
          show_email?: boolean | null
          show_facebook?: boolean | null
          show_phone?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string
          city_id?: string | null
          created_at?: string
          email?: string
          facebook_profile?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          profile_picture_url?: string | null
          show_email?: boolean | null
          show_facebook?: boolean | null
          show_phone?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
