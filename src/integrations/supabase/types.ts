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
      daily_data: {
        Row: {
          agua: number | null
          cigarros: number | null
          created_at: string | null
          date: string
          id: string
          notas: string | null
          polichinelos: number | null
          refeicoes_grandes: number | null
          refeicoes_medias: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agua?: number | null
          cigarros?: number | null
          created_at?: string | null
          date: string
          id?: string
          notas?: string | null
          polichinelos?: number | null
          refeicoes_grandes?: number | null
          refeicoes_medias?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agua?: number | null
          cigarros?: number | null
          created_at?: string | null
          date?: string
          id?: string
          notas?: string | null
          polichinelos?: number | null
          refeicoes_grandes?: number | null
          refeicoes_medias?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      shopping_items: {
        Row: {
          completed: boolean | null
          date_added: string | null
          id: string
          shopping_list_id: string
          text: string
        }
        Insert: {
          completed?: boolean | null
          date_added?: string | null
          id?: string
          shopping_list_id: string
          text: string
        }
        Update: {
          completed?: boolean | null
          date_added?: string | null
          id?: string
          shopping_list_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_shopping_list_id_fkey"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string | null
          id: string
          month: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          month: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          month?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sections: {
        Row: {
          agua: boolean | null
          cigarros: boolean | null
          created_at: string | null
          id: string
          polichinelos: boolean | null
          refeicoes: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agua?: boolean | null
          cigarros?: boolean | null
          created_at?: string | null
          id?: string
          polichinelos?: boolean | null
          refeicoes?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agua?: boolean | null
          cigarros?: boolean | null
          created_at?: string | null
          id?: string
          polichinelos?: boolean | null
          refeicoes?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
