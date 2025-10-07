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
      activities: {
        Row: {
          action_type: string
          created_at: string
          description: string
          id: string
          ip_address: string | null
          metadata: Json | null
          module: string
          organization_id: string | null
          reference_id: string | null
          reference_type: string | null
          session_id: string | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          action_type: string
          created_at?: string
          description: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module: string
          organization_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          session_id?: string | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module?: string
          organization_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          session_id?: string | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      campaign_leads: {
        Row: {
          additional_taxing_notes: string | null
          attached_files: Json | null
          campaign_id: string | null
          created_at: string
          current_arrears: number | null
          death_notes: string | null
          disposition: string | null
          email: string | null
          grantor_grantee_name: string | null
          has_additional_taxing_entities: boolean | null
          has_death: boolean | null
          has_lawsuit: boolean | null
          has_probate: boolean | null
          heirs: Json | null
          id: string
          lawsuit_notes: string | null
          notes: string | null
          organization_id: string | null
          owner_name: string
          owner_of_record: string | null
          phone: string | null
          probate_notes: string | null
          property_address: string
          status: string | null
          tax_id: string | null
          tax_lawsuit_number: string | null
          updated_at: string
          vesting_deed_date: string | null
        }
        Insert: {
          additional_taxing_notes?: string | null
          attached_files?: Json | null
          campaign_id?: string | null
          created_at?: string
          current_arrears?: number | null
          death_notes?: string | null
          disposition?: string | null
          email?: string | null
          grantor_grantee_name?: string | null
          has_additional_taxing_entities?: boolean | null
          has_death?: boolean | null
          has_lawsuit?: boolean | null
          has_probate?: boolean | null
          heirs?: Json | null
          id?: string
          lawsuit_notes?: string | null
          notes?: string | null
          organization_id?: string | null
          owner_name: string
          owner_of_record?: string | null
          phone?: string | null
          probate_notes?: string | null
          property_address: string
          status?: string | null
          tax_id?: string | null
          tax_lawsuit_number?: string | null
          updated_at?: string
          vesting_deed_date?: string | null
        }
        Update: {
          additional_taxing_notes?: string | null
          attached_files?: Json | null
          campaign_id?: string | null
          created_at?: string
          current_arrears?: number | null
          death_notes?: string | null
          disposition?: string | null
          email?: string | null
          grantor_grantee_name?: string | null
          has_additional_taxing_entities?: boolean | null
          has_death?: boolean | null
          has_lawsuit?: boolean | null
          has_probate?: boolean | null
          heirs?: Json | null
          id?: string
          lawsuit_notes?: string | null
          notes?: string | null
          organization_id?: string | null
          owner_name?: string
          owner_of_record?: string | null
          phone?: string | null
          probate_notes?: string | null
          property_address?: string
          status?: string | null
          tax_id?: string | null
          tax_lawsuit_number?: string | null
          updated_at?: string
          vesting_deed_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          equity_purchased: number | null
          expenditure: number | null
          id: string
          name: string
          organization_id: string | null
          progress: number | null
          signed_deals: number | null
          start_date: string
          status: string
          target_deals: number | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          equity_purchased?: number | null
          expenditure?: number | null
          id?: string
          name: string
          organization_id?: string | null
          progress?: number | null
          signed_deals?: number | null
          start_date: string
          status?: string
          target_deals?: number | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          equity_purchased?: number | null
          expenditure?: number | null
          id?: string
          name?: string
          organization_id?: string | null
          progress?: number | null
          signed_deals?: number | null
          start_date?: string
          status?: string
          target_deals?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      custom_app_fields: {
        Row: {
          app_id: string
          created_at: string
          field_type: string
          id: string
          is_required: boolean | null
          label: string
          name: string
          options: Json | null
          position: number
          validation_rules: Json | null
        }
        Insert: {
          app_id: string
          created_at?: string
          field_type: string
          id?: string
          is_required?: boolean | null
          label: string
          name: string
          options?: Json | null
          position?: number
          validation_rules?: Json | null
        }
        Update: {
          app_id?: string
          created_at?: string
          field_type?: string
          id?: string
          is_required?: boolean | null
          label?: string
          name?: string
          options?: Json | null
          position?: number
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_app_fields_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "custom_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_app_records: {
        Row: {
          app_id: string
          created_at: string
          created_by: string
          data: Json
          id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          app_id: string
          created_at?: string
          created_by: string
          data?: Json
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          app_id?: string
          created_at?: string
          created_by?: string
          data?: Json
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_app_records_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "custom_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_apps: {
        Row: {
          color: string | null
          created_at: string
          created_by: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          error_message: string | null
          execution_data: Json | null
          id: string
          record_id: string | null
          started_at: string
          status: string
          workflow_id: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          execution_data?: Json | null
          id?: string
          record_id?: string | null
          started_at?: string
          status: string
          workflow_id: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          execution_data?: Json | null
          id?: string
          record_id?: string | null
          started_at?: string
          status?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "custom_app_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          actions: Json
          app_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          app_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          app_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "custom_apps"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_organization_id: {
        Args: { _user_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_comprehensive_activity: {
        Args: {
          p_action_type: string
          p_description: string
          p_ip_address?: string
          p_metadata?: Json
          p_module: string
          p_reference_id?: string
          p_reference_type?: string
          p_session_id?: string
          p_target_id?: string
          p_target_type?: string
          p_user_agent?: string
          p_user_id: string
          p_user_name: string
        }
        Returns: string
      }
      log_lead_activity: {
        Args: {
          p_action_type: string
          p_description: string
          p_metadata?: Json
          p_reference_id: string
          p_user_id: string
          p_user_name: string
        }
        Returns: string
      }
      reset_activity_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "Admin" | "Manager" | "Lead Manager" | "Employee" | "Guest"
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
      app_role: ["Admin", "Manager", "Lead Manager", "Employee", "Guest"],
    },
  },
} as const
