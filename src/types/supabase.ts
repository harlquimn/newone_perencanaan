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
      activities: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          program_id: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          program_id?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          program_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      strategic_plan_activities: {
        Row: {
          activity_id: string | null
          created_at: string
          id: string
          indicators: string[]
          objectives: string[]
          strategic_plan_id: string | null
          updated_at: string
          year1_budget: number | null
          year1_target: string | null
          year2_budget: number | null
          year2_target: string | null
          year3_budget: number | null
          year3_target: string | null
          year4_budget: number | null
          year4_target: string | null
          year5_budget: number | null
          year5_target: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          id?: string
          indicators?: string[]
          objectives?: string[]
          strategic_plan_id?: string | null
          updated_at?: string
          year1_budget?: number | null
          year1_target?: string | null
          year2_budget?: number | null
          year2_target?: string | null
          year3_budget?: number | null
          year3_target?: string | null
          year4_budget?: number | null
          year4_target?: string | null
          year5_budget?: number | null
          year5_target?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          id?: string
          indicators?: string[]
          objectives?: string[]
          strategic_plan_id?: string | null
          updated_at?: string
          year1_budget?: number | null
          year1_target?: string | null
          year2_budget?: number | null
          year2_target?: string | null
          year3_budget?: number | null
          year3_target?: string | null
          year4_budget?: number | null
          year4_target?: string | null
          year5_budget?: number | null
          year5_target?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strategic_plan_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_plan_activities_strategic_plan_id_fkey"
            columns: ["strategic_plan_id"]
            isOneToOne: false
            referencedRelation: "strategic_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_plan_sub_activities: {
        Row: {
          created_at: string
          id: string
          indicators: string[]
          objectives: string[]
          strategic_plan_activity_id: string | null
          sub_activity_id: string | null
          updated_at: string
          year1_budget: number | null
          year1_target: string | null
          year2_budget: number | null
          year2_target: string | null
          year3_budget: number | null
          year3_target: string | null
          year4_budget: number | null
          year4_target: string | null
          year5_budget: number | null
          year5_target: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          indicators?: string[]
          objectives?: string[]
          strategic_plan_activity_id?: string | null
          sub_activity_id?: string | null
          updated_at?: string
          year1_budget?: number | null
          year1_target?: string | null
          year2_budget?: number | null
          year2_target?: string | null
          year3_budget?: number | null
          year3_target?: string | null
          year4_budget?: number | null
          year4_target?: string | null
          year5_budget?: number | null
          year5_target?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          indicators?: string[]
          objectives?: string[]
          strategic_plan_activity_id?: string | null
          sub_activity_id?: string | null
          updated_at?: string
          year1_budget?: number | null
          year1_target?: string | null
          year2_budget?: number | null
          year2_target?: string | null
          year3_budget?: number | null
          year3_target?: string | null
          year4_budget?: number | null
          year4_target?: string | null
          year5_budget?: number | null
          year5_target?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strategic_plan_sub_activities_strategic_plan_activity_id_fkey"
            columns: ["strategic_plan_activity_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_plan_sub_activities_sub_activity_id_fkey"
            columns: ["sub_activity_id"]
            isOneToOne: false
            referencedRelation: "sub_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_plans: {
        Row: {
          created_at: string
          goals: string[]
          id: string
          indicators: string[]
          program_id: string | null
          updated_at: string
          year1_budget: number | null
          year1_target: string | null
          year2_budget: number | null
          year2_target: string | null
          year3_budget: number | null
          year3_target: string | null
          year4_budget: number | null
          year4_target: string | null
          year5_budget: number | null
          year5_target: string | null
        }
        Insert: {
          created_at?: string
          goals?: string[]
          id?: string
          indicators?: string[]
          program_id?: string | null
          updated_at?: string
          year1_budget?: number | null
          year1_target?: string | null
          year2_budget?: number | null
          year2_target?: string | null
          year3_budget?: number | null
          year3_target?: string | null
          year4_budget?: number | null
          year4_target?: string | null
          year5_budget?: number | null
          year5_target?: string | null
        }
        Update: {
          created_at?: string
          goals?: string[]
          id?: string
          indicators?: string[]
          program_id?: string | null
          updated_at?: string
          year1_budget?: number | null
          year1_target?: string | null
          year2_budget?: number | null
          year2_target?: string | null
          year3_budget?: number | null
          year3_target?: string | null
          year4_budget?: number | null
          year4_target?: string | null
          year5_budget?: number | null
          year5_target?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strategic_plans_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_activities: {
        Row: {
          activity_id: string | null
          code: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          activity_id?: string | null
          code: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          activity_id?: string | null
          code?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
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
