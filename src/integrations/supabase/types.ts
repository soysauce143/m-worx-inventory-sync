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
      activity_logs: {
        Row: {
          action: string
          details: string
          id: string
          item_id: string | null
          item_name: string | null
          timestamp: string
          user_id: string
          user_name: string
        }
        Insert: {
          action: string
          details: string
          id?: string
          item_id?: string | null
          item_name?: string | null
          timestamp?: string
          user_id: string
          user_name: string
        }
        Update: {
          action?: string
          details?: string
          id?: string
          item_id?: string | null
          item_name?: string | null
          timestamp?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_alerts: {
        Row: {
          acknowledged: boolean
          alert_type: string
          created_at: string
          current_quantity: number
          id: string
          item_id: string
          item_name: string
          message: string
          reorder_point: number
          severity: string
        }
        Insert: {
          acknowledged?: boolean
          alert_type: string
          created_at?: string
          current_quantity: number
          id?: string
          item_id: string
          item_name: string
          message: string
          reorder_point: number
          severity: string
        }
        Update: {
          acknowledged?: boolean
          alert_type?: string
          created_at?: string
          current_quantity?: number
          id?: string
          item_id?: string
          item_name?: string
          message?: string
          reorder_point?: number
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_alerts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          barcode: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          product_id: string
          quantity: number
          reorder_point: number
          supplier: string
          unit_price: number
          updated_at: string
          updated_by: string
        }
        Insert: {
          barcode?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          product_id: string
          quantity?: number
          reorder_point?: number
          supplier: string
          unit_price?: number
          updated_at?: string
          updated_by: string
        }
        Update: {
          barcode?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          product_id?: string
          quantity?: number
          reorder_point?: number
          supplier?: string
          unit_price?: number
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          created_at: string
          id: string
          quiz: Json
          story: Json
          title: string
          updated_at: string
          words: Json
        }
        Insert: {
          created_at?: string
          id?: string
          quiz?: Json
          story?: Json
          title: string
          updated_at?: string
          words?: Json
        }
        Update: {
          created_at?: string
          id?: string
          quiz?: Json
          story?: Json
          title?: string
          updated_at?: string
          words?: Json
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          completedstory: boolean
          completedwords: Json
          createdat: string
          id: string
          lessoncompleted: boolean
          lessonid: string
          quizanswers: Json
          updatedat: string
          userid: string
        }
        Insert: {
          completedstory?: boolean
          completedwords?: Json
          createdat?: string
          id?: string
          lessoncompleted?: boolean
          lessonid: string
          quizanswers?: Json
          updatedat?: string
          userid: string
        }
        Update: {
          completedstory?: boolean
          completedwords?: Json
          createdat?: string
          id?: string
          lessoncompleted?: boolean
          lessonid?: string
          quizanswers?: Json
          updatedat?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_lessonid_fkey"
            columns: ["lessonid"]
            isOneToOne: false
            referencedRelation: "lessons"
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
