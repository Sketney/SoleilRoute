export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          destination_country: string;
          destination_city: string;
          start_date: string;
          end_date: string;
          total_budget: number;
          currency: string;
          citizenship: string;
          notes: string | null;
          visa_status: string;
          visa_last_checked: string | null;
          exchange_rate: number | null;
          base_currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          destination_country: string;
          destination_city: string;
          start_date: string;
          end_date: string;
          total_budget: number;
          currency: string;
          citizenship: string;
          notes?: string | null;
          visa_status?: string;
          visa_last_checked?: string | null;
          exchange_rate?: number | null;
          base_currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          destination_country?: string;
          destination_city?: string;
          start_date?: string;
          end_date?: string;
          total_budget?: number;
          currency?: string;
          citizenship?: string;
          notes?: string | null;
          visa_status?: string;
          visa_last_checked?: string | null;
          exchange_rate?: number | null;
          base_currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      budget_items: {
        Row: {
          id: string;
          trip_id: string;
          category:
            | "transport"
            | "accommodation"
            | "food"
            | "activities"
            | "visa"
            | "other";
          description: string | null;
          amount: number;
          currency: string;
          is_paid: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          category?:
            | "transport"
            | "accommodation"
            | "food"
            | "activities"
            | "visa"
            | "other";
          description?: string | null;
          amount: number;
          currency: string;
          is_paid?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          category?:
            | "transport"
            | "accommodation"
            | "food"
            | "activities"
            | "visa"
            | "other";
          description?: string | null;
          amount?: number;
          currency?: string;
          is_paid?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "budget_items_trip_id_fkey";
            columns: ["trip_id"];
            referencedRelation: "trips";
            referencedColumns: ["id"];
          }
        ];
      };
      visa_requirements: {
        Row: {
          id: string;
          citizenship: string;
          destination_country: string;
          visa_required: boolean;
          visa_type: string | null;
          duration_days: number | null;
          cost: number | null;
          currency: string | null;
          embassy_url: string | null;
          notes: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          citizenship: string;
          destination_country: string;
          visa_required?: boolean;
          visa_type?: string | null;
          duration_days?: number | null;
          cost?: number | null;
          currency?: string | null;
          embassy_url?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          citizenship?: string;
          destination_country?: string;
          visa_required?: boolean;
          visa_type?: string | null;
          duration_days?: number | null;
          cost?: number | null;
          currency?: string | null;
          embassy_url?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      exchange_rates: {
        Row: {
          id: string;
          base_currency: string;
          rates: Json;
          fetched_at: string;
          provider: string;
        };
        Insert: {
          id?: string;
          base_currency: string;
          rates: Json;
          fetched_at?: string;
          provider?: string;
        };
        Update: {
          id?: string;
          base_currency?: string;
          rates?: Json;
          fetched_at?: string;
          provider?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_trip_totals: {
        Args: {
          trip_id: string;
        };
        Returns: {
          total_amount: number;
          total_paid: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export type Trip = Database["public"]["Tables"]["trips"]["Row"];
export type TripInsert = Database["public"]["Tables"]["trips"]["Insert"];
export type BudgetItem =
  Database["public"]["Tables"]["budget_items"]["Row"];
export type BudgetItemInsert =
  Database["public"]["Tables"]["budget_items"]["Insert"];
export type VisaRequirement =
  Database["public"]["Tables"]["visa_requirements"]["Row"];
