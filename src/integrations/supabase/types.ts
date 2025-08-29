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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      docs_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          embedding: string | null
          filename: string
          id: string
          metadata: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          embedding?: string | null
          filename: string
          id?: string
          metadata?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          embedding?: string | null
          filename?: string
          id?: string
          metadata?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      minutes_log: {
        Row: {
          day: string
          id: number
          tts_sec: number | null
          user_id: string
          webrtc_sec: number | null
          whisper_sec: number | null
        }
        Insert: {
          day?: string
          id?: number
          tts_sec?: number | null
          user_id: string
          webrtc_sec?: number | null
          whisper_sec?: number | null
        }
        Update: {
          day?: string
          id?: number
          tts_sec?: number | null
          user_id?: string
          webrtc_sec?: number | null
          whisper_sec?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          area: string | null
          created_at: string
          criteria: Json | null
          description: string | null
          id: string
          is_default: boolean
          name: string
          persona: Json | null
          role_options: Json | null
          system_prompt: string
          tags: string[] | null
          title: string | null
          track: string
          updated_at: string
          voice_id: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string
          criteria?: Json | null
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          persona?: Json | null
          role_options?: Json | null
          system_prompt: string
          tags?: string[] | null
          title?: string | null
          track: string
          updated_at?: string
          voice_id?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string
          criteria?: Json | null
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          persona?: Json | null
          role_options?: Json | null
          system_prompt?: string
          tags?: string[] | null
          title?: string | null
          track?: string
          updated_at?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          finished_at: string | null
          id: string
          metrics: Json | null
          scenario: string
          score: number | null
          started_at: string
          track: string
          transcript: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          finished_at?: string | null
          id?: string
          metrics?: Json | null
          scenario: string
          score?: number | null
          started_at?: string
          track: string
          transcript?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          finished_at?: string | null
          id?: string
          metrics?: Json | null
          scenario?: string
          score?: number | null
          started_at?: string
          track?: string
          transcript?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sessions_live: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_ms: number
          feedback_summary: string | null
          id: string
          metadata: Json | null
          metrics_detailed: Json | null
          score_overall: number | null
          track: string
          transcript_ai: string | null
          transcript_user: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number
          feedback_summary?: string | null
          id?: string
          metadata?: Json | null
          metrics_detailed?: Json | null
          score_overall?: number | null
          track: string
          transcript_ai?: string | null
          transcript_user?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number
          feedback_summary?: string | null
          id?: string
          metadata?: Json | null
          metrics_detailed?: Json | null
          score_overall?: number | null
          track?: string
          transcript_ai?: string | null
          transcript_user?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sessions_live_metrics: {
        Row: {
          created_at: string
          criterion_key: string
          criterion_label: string
          feedback: string | null
          id: string
          score: number
          session_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          criterion_key: string
          criterion_label: string
          feedback?: string | null
          id?: string
          score: number
          session_id: string
          weight?: number
        }
        Update: {
          created_at?: string
          criterion_key?: string
          criterion_label?: string
          feedback?: string | null
          id?: string
          score?: number
          session_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "sessions_live_metrics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions_live"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions_live_turns: {
        Row: {
          content: string
          created_at: string
          id: string
          session_id: string
          speaker: string
          timestamp_ms: number
          turn_index: number
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          session_id: string
          speaker: string
          timestamp_ms: number
          turn_index: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          session_id?: string
          speaker?: string
          timestamp_ms?: number
          turn_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_session_live"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions_live"
            referencedColumns: ["id"]
          },
        ]
      }
      simulation_scores: {
        Row: {
          criterion_key: string
          criterion_label: string
          feedback: string | null
          id: number
          score: number
          simulation_id: string
          weight: number
        }
        Insert: {
          criterion_key: string
          criterion_label: string
          feedback?: string | null
          id?: number
          score: number
          simulation_id: string
          weight?: number
        }
        Update: {
          criterion_key?: string
          criterion_label?: string
          feedback?: string | null
          id?: number
          score?: number
          simulation_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "simulation_scores_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "simulations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulation_scores_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "v_simulation_result"
            referencedColumns: ["simulation_id"]
          },
        ]
      }
      simulations: {
        Row: {
          duration_sec: number | null
          ended_at: string | null
          id: string
          kpis: Json | null
          mode: string
          notes: Json | null
          recording_url: string | null
          role: string
          scenario_id: string
          started_at: string | null
          transcript_url: string | null
          user_id: string
        }
        Insert: {
          duration_sec?: number | null
          ended_at?: string | null
          id?: string
          kpis?: Json | null
          mode: string
          notes?: Json | null
          recording_url?: string | null
          role: string
          scenario_id: string
          started_at?: string | null
          transcript_url?: string | null
          user_id: string
        }
        Update: {
          duration_sec?: number | null
          ended_at?: string | null
          id?: string
          kpis?: Json | null
          mode?: string
          notes?: Json | null
          recording_url?: string | null
          role?: string
          scenario_id?: string
          started_at?: string | null
          transcript_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulations_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_live_session_criteria_metrics: {
        Row: {
          area: string | null
          avg_score: number | null
          criterion_key: string | null
          criterion_label: string | null
          evaluation_count: number | null
          month_year: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_live_session_metrics: {
        Row: {
          area: string | null
          avg_duration_minutes: number | null
          avg_score: number | null
          completed_sessions: number | null
          month_year: string | null
          total_sessions: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_metric_by_criterion: {
        Row: {
          area: string | null
          avg_score: number | null
          criterion_key: string | null
          criterion_label: string | null
          scenario_title: string | null
        }
        Relationships: []
      }
      v_simulation_result: {
        Row: {
          area: string | null
          duration_sec: number | null
          scenario_title: string | null
          score_overall_calc: number | null
          simulation_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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
    Enums: {},
  },
} as const
