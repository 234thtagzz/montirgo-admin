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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          related_entity_id: string | null
          related_entity_type: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_diagnoses: {
        Row: {
          created_at: string
          disclaimer: string
          estimated_complexity: string | null
          id: string
          possible_issues: Json
          questions_for_client: string[]
          raw_response: Json | null
          recommended_checks: string[]
          request_id: string
          risk_level: string
          suggested_tools: string[]
          symptoms_summary: string | null
        }
        Insert: {
          created_at?: string
          disclaimer?: string
          estimated_complexity?: string | null
          id?: string
          possible_issues?: Json
          questions_for_client?: string[]
          raw_response?: Json | null
          recommended_checks?: string[]
          request_id: string
          risk_level?: string
          suggested_tools?: string[]
          symptoms_summary?: string | null
        }
        Update: {
          created_at?: string
          disclaimer?: string
          estimated_complexity?: string | null
          id?: string
          possible_issues?: Json
          questions_for_client?: string[]
          raw_response?: Json | null
          recommended_checks?: string[]
          request_id?: string
          risk_level?: string
          suggested_tools?: string[]
          symptoms_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_diagnoses_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mechanic_open_request_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_diagnoses_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      earnings: {
        Row: {
          available_at: string
          created_at: string
          gross_amount: number
          id: string
          mechanic_id: string
          net_amount: number
          payment_id: string | null
          payment_method: string
          period_date: string
          platform_fee: number
          request_id: string
          status: string
        }
        Insert: {
          available_at?: string
          created_at?: string
          gross_amount: number
          id?: string
          mechanic_id: string
          net_amount: number
          payment_id?: string | null
          payment_method?: string
          period_date?: string
          platform_fee?: number
          request_id: string
          status?: string
        }
        Update: {
          available_at?: string
          created_at?: string
          gross_amount?: number
          id?: string
          mechanic_id?: string
          net_amount?: number
          payment_id?: string | null
          payment_method?: string
          period_date?: string
          platform_fee?: number
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "earnings_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "mechanic_open_request_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          id: string
          lat: number
          lng: number
          recorded_at: string
          request_id: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          id?: string
          lat: number
          lng: number
          recorded_at?: string
          request_id?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          id?: string
          lat?: number
          lng?: number
          recorded_at?: string
          request_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mechanic_open_request_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_locations: {
        Row: {
          accuracy_meters: number | null
          id: string
          lat: number
          lng: number
          mechanic_id: string
          recorded_at: string
          request_id: string | null
        }
        Insert: {
          accuracy_meters?: number | null
          id?: string
          lat: number
          lng: number
          mechanic_id: string
          recorded_at?: string
          request_id?: string | null
        }
        Update: {
          accuracy_meters?: number | null
          id?: string
          lat?: number
          lng?: number
          mechanic_id?: string
          recorded_at?: string
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_locations_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mechanic_locations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mechanic_open_request_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mechanic_locations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_payout_accounts: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_code: string
          created_at: string
          id: string
          is_primary: boolean
          mechanic_id: string
          routing_type: string | null
          routing_value: string | null
          type: string
          updated_at: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_code: string
          created_at?: string
          id?: string
          is_primary?: boolean
          mechanic_id: string
          routing_type?: string | null
          routing_value?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_code?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          mechanic_id?: string
          routing_type?: string | null
          routing_value?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_payout_accounts_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_profiles: {
        Row: {
          bio: string | null
          certifications: string[]
          created_at: string
          current_lat: number | null
          current_lng: number | null
          experience_years: number | null
          identity_number: string | null
          is_available: boolean
          is_online: boolean
          is_verified: boolean
          last_location_at: string | null
          profile_id: string
          rating_avg: number
          rating_count: number
          skills: string[]
          total_jobs: number
          updated_at: string
          vehicle_specialization: string[]
          verified_at: string | null
          verified_by: string | null
          workshop_address: string | null
          workshop_name: string | null
          workshop_photos: string[]
        }
        Insert: {
          bio?: string | null
          certifications?: string[]
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          experience_years?: number | null
          identity_number?: string | null
          is_available?: boolean
          is_online?: boolean
          is_verified?: boolean
          last_location_at?: string | null
          profile_id: string
          rating_avg?: number
          rating_count?: number
          skills?: string[]
          total_jobs?: number
          updated_at?: string
          vehicle_specialization?: string[]
          verified_at?: string | null
          verified_by?: string | null
          workshop_address?: string | null
          workshop_name?: string | null
          workshop_photos?: string[]
        }
        Update: {
          bio?: string | null
          certifications?: string[]
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          experience_years?: number | null
          identity_number?: string | null
          is_available?: boolean
          is_online?: boolean
          is_verified?: boolean
          last_location_at?: string | null
          profile_id?: string
          rating_avg?: number
          rating_count?: number
          skills?: string[]
          total_jobs?: number
          updated_at?: string
          vehicle_specialization?: string[]
          verified_at?: string | null
          verified_by?: string | null
          workshop_address?: string | null
          workshop_name?: string | null
          workshop_photos?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mechanic_profiles_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_wallets: {
        Row: {
          available_balance: number
          held_balance: number
          mechanic_id: string
          pending_balance: number
          total_earned: number
          total_withdrawn: number
          updated_at: string
        }
        Insert: {
          available_balance?: number
          held_balance?: number
          mechanic_id: string
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Update: {
          available_balance?: number
          held_balance?: number
          mechanic_id?: string
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_wallets_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_invoice_items: {
        Row: {
          created_at: string
          harga: number
          id: string
          keterangan: string
          mechanic_id: string
          request_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          harga: number
          id?: string
          keterangan: string
          mechanic_id: string
          request_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          harga?: number
          id?: string
          keterangan?: string
          mechanic_id?: string
          request_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_invoice_items_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_invoice_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mechanic_open_request_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_invoice_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_events: {
        Row: {
          created_at: string
          event_id: string | null
          event_type: string
          id: string
          payload: Json | null
          payment_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          payment_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          expires_at: string | null
          external_payment_id: string | null
          fee_percent: number
          gateway_reference: string | null
          id: string
          method: string
          net_amount: number
          paid_at: string | null
          payment_session_id: string | null
          payment_url: string | null
          platform_fee: number
          qr_payload: string | null
          request_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          external_payment_id?: string | null
          fee_percent?: number
          gateway_reference?: string | null
          id?: string
          method?: string
          net_amount: number
          paid_at?: string | null
          payment_session_id?: string | null
          payment_url?: string | null
          platform_fee?: number
          qr_payload?: string | null
          request_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          external_payment_id?: string | null
          fee_percent?: number
          gateway_reference?: string | null
          id?: string
          method?: string
          net_amount?: number
          paid_at?: string | null
          payment_session_id?: string | null
          payment_url?: string | null
          platform_fee?: number
          qr_payload?: string | null
          request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "mechanic_open_request_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_id: string
          comment: string | null
          created_at: string
          id: string
          is_visible: boolean
          mechanic_id: string
          mechanic_reply: string | null
          rating: number
          replied_at: string | null
          request_id: string
        }
        Insert: {
          client_id: string
          comment?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          mechanic_id: string
          mechanic_reply?: string | null
          rating: number
          replied_at?: string | null
          request_id: string
        }
        Update: {
          client_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          mechanic_id?: string
          mechanic_reply?: string | null
          rating?: number
          replied_at?: string | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "mechanic_open_request_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_request_assignment_rejections: {
        Row: {
          client_id: string
          created_at: string
          mechanic_id: string
          request_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          mechanic_id: string
          request_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          mechanic_id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_request_assignment_rejections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_request_assignment_rejections_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "mechanic_assignment_profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "service_request_assignment_rejections_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "mechanic_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "service_request_assignment_rejections_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "mechanic_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "service_request_assignment_rejections_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mechanic_open_request_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_request_assignment_rejections_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_request_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: string | null
          id: string
          notes: string | null
          request_id: string
          to_status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          notes?: string | null
          request_id: string
          to_status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          notes?: string | null
          request_id?: string
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_request_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_request_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mechanic_open_request_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_request_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          accepted_at: string | null
          additional_notes: string | null
          address: string | null
          ai_summary: string | null
          arrived_at: string | null
          assignment_expires_at: string | null
          assignment_requested_at: string | null
          client_id: string
          completed_at: string | null
          contact_phone: string
          created_at: string
          currency: string
          id: string
          issue_description: string
          lat: number
          lng: number
          mechanic_id: string | null
          payment_method: string | null
          photo_urls: string[]
          price_amount: number | null
          status: string
          symptoms: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          additional_notes?: string | null
          address?: string | null
          ai_summary?: string | null
          arrived_at?: string | null
          assignment_expires_at?: string | null
          assignment_requested_at?: string | null
          client_id: string
          completed_at?: string | null
          contact_phone: string
          created_at?: string
          currency?: string
          id?: string
          issue_description: string
          lat: number
          lng: number
          mechanic_id?: string | null
          payment_method?: string | null
          photo_urls?: string[]
          price_amount?: number | null
          status?: string
          symptoms?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          additional_notes?: string | null
          address?: string | null
          ai_summary?: string | null
          arrived_at?: string | null
          assignment_expires_at?: string | null
          assignment_requested_at?: string | null
          client_id?: string
          completed_at?: string | null
          contact_phone?: string
          created_at?: string
          currency?: string
          id?: string
          issue_description?: string
          lat?: number
          lng?: number
          mechanic_id?: string | null
          payment_method?: string | null
          photo_urls?: string[]
          price_amount?: number | null
          status?: string
          symptoms?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          created_at: string
          id: string
          license_plate: string
          model: string
          notes: string | null
          owner_id: string
          photo_url: string | null
          type: string
          updated_at: string
          year: number | null
        }
        Insert: {
          brand: string
          created_at?: string
          id?: string
          license_plate: string
          model: string
          notes?: string | null
          owner_id: string
          photo_url?: string | null
          type: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          brand?: string
          created_at?: string
          id?: string
          license_plate?: string
          model?: string
          notes?: string | null
          owner_id?: string
          photo_url?: string | null
          type?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          id: string
          mechanic_id: string
          note: string | null
          ref_id: string | null
          ref_type: string | null
          type: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          id?: string
          mechanic_id: string
          note?: string | null
          ref_id?: string | null
          ref_type?: string | null
          type: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          id?: string
          mechanic_id?: string
          note?: string | null
          ref_id?: string | null
          ref_type?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_events: {
        Row: {
          created_at: string
          event_id: string | null
          event_type: string
          id: string
          payload: Json | null
          withdrawal_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          withdrawal_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          withdrawal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_events_withdrawal_id_fkey"
            columns: ["withdrawal_id"]
            isOneToOne: false
            referencedRelation: "withdrawals"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          account_snapshot: Json
          amount: number
          completed_at: string | null
          created_at: string
          failure_code: string | null
          fee: number
          id: string
          mechanic_id: string
          payout_account_id: string | null
          reference_id: string
          status: string
          updated_at: string
          xendit_payout_id: string | null
        }
        Insert: {
          account_snapshot?: Json
          amount: number
          completed_at?: string | null
          created_at?: string
          failure_code?: string | null
          fee?: number
          id?: string
          mechanic_id: string
          payout_account_id?: string | null
          reference_id: string
          status?: string
          updated_at?: string
          xendit_payout_id?: string | null
        }
        Update: {
          account_snapshot?: Json
          amount?: number
          completed_at?: string | null
          created_at?: string
          failure_code?: string | null
          fee?: number
          id?: string
          mechanic_id?: string
          payout_account_id?: string | null
          reference_id?: string
          status?: string
          updated_at?: string
          xendit_payout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawals_payout_account_id_fkey"
            columns: ["payout_account_id"]
            isOneToOne: false
            referencedRelation: "mechanic_payout_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mechanic_assignment_profile: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certifications: string[] | null
          experience_years: number | null
          full_name: string | null
          is_verified: boolean | null
          profile_id: string | null
          rating_avg: number | null
          rating_count: number | null
          skills: string[] | null
          total_jobs: number | null
          vehicle_specialization: string[] | null
          verified_at: string | null
          workshop_address: string | null
          workshop_name: string | null
          workshop_photo: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_directory: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certifications: string[] | null
          experience_years: number | null
          full_name: string | null
          is_available: boolean | null
          is_online: boolean | null
          is_verified: boolean | null
          profile_id: string | null
          rating_avg: number | null
          rating_count: number | null
          skills: string[] | null
          total_jobs: number | null
          vehicle_specialization: string[] | null
          verified_at: string | null
          workshop_address: string | null
          workshop_name: string | null
          workshop_photo: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_open_request_view: {
        Row: {
          additional_notes: string | null
          address: string | null
          ai_analysis: Json | null
          ai_created_at: string | null
          client_avatar_url: string | null
          client_id: string | null
          client_joined_at: string | null
          client_name: string | null
          client_total_requests: number | null
          contact_phone: string | null
          created_at: string | null
          id: string | null
          issue_description: string | null
          lat: number | null
          lng: number | null
          status: string | null
          symptoms: string | null
          vehicle_brand: string | null
          vehicle_model: string | null
          vehicle_photo_url: string | null
          vehicle_plate: string | null
          vehicle_type: string | null
          vehicle_year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_review_view: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string | null
          mechanic_id: string | null
          mechanic_reply: string | null
          rating: number | null
          replied_at: string | null
          reviewer_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_transaction_overview: {
        Row: {
          accepted_at: string | null
          additional_notes: string | null
          address: string | null
          arrived_at: string | null
          client_email: string | null
          client_id: string
          client_name: string | null
          client_phone: string | null
          completed_at: string | null
          contact_phone: string
          created_at: string
          currency: string
          id: string
          invoice_item_count: number
          invoice_total: number
          issue_description: string
          lat: number
          lng: number
          mechanic_email: string | null
          mechanic_id: string | null
          mechanic_name: string | null
          mechanic_phone: string | null
          payment_amount: number | null
          payment_id: string | null
          payment_method: string | null
          payment_method_used: string | null
          payment_status: string | null
          paid_at: string | null
          platform_fee: number | null
          net_amount: number | null
          price_amount: number | null
          status: string
          symptoms: string | null
          vehicle_brand: string | null
          vehicle_id: string | null
          vehicle_model: string | null
          vehicle_type: string | null
          license_plate: string | null
        }
        Relationships: []
      }
      admin_user_directory: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certifications: string[] | null
          client_request_count: number
          created_at: string
          current_lat: number | null
          current_lng: number | null
          email: string | null
          experience_years: number | null
          full_name: string | null
          id: string
          identity_number: string | null
          is_available: boolean | null
          is_online: boolean | null
          is_verified: boolean | null
          last_location_at: string | null
          mechanic_request_count: number
          phone_number: string | null
          rating_avg: number | null
          rating_count: number | null
          role: string
          skills: string[] | null
          total_earned: number
          total_jobs: number | null
          total_spent: number
          updated_at: string
          vehicle_count: number
          vehicle_specialization: string[] | null
          verified_at: string | null
          workshop_address: string | null
          workshop_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_service_request: { Args: { p_request_id: string }; Returns: Json }
      choose_payment_method: {
        Args: { p_method: string; p_request_id: string }
        Returns: {
          accepted_at: string | null
          additional_notes: string | null
          address: string | null
          ai_summary: string | null
          arrived_at: string | null
          assignment_expires_at: string | null
          assignment_requested_at: string | null
          client_id: string
          completed_at: string | null
          contact_phone: string
          created_at: string
          currency: string
          id: string
          issue_description: string
          lat: number
          lng: number
          mechanic_id: string | null
          payment_method: string | null
          photo_urls: string[]
          price_amount: number | null
          status: string
          symptoms: string | null
          updated_at: string
          vehicle_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "service_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      confirm_cash_payment: {
        Args: { p_request_id: string }
        Returns: {
          amount: number
          created_at: string
          currency: string
          expires_at: string | null
          external_payment_id: string | null
          fee_percent: number
          gateway_reference: string | null
          id: string
          method: string
          net_amount: number
          paid_at: string | null
          payment_session_id: string | null
          payment_url: string | null
          platform_fee: number
          qr_payload: string | null
          request_id: string
          status: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "payments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      current_role: { Args: never; Returns: string }
      expire_stale_assignments: { Args: never; Returns: number }
      finalize_order_invoice: {
        Args: { p_request_id: string }
        Returns: {
          accepted_at: string | null
          additional_notes: string | null
          address: string | null
          ai_summary: string | null
          arrived_at: string | null
          assignment_expires_at: string | null
          assignment_requested_at: string | null
          client_id: string
          completed_at: string | null
          contact_phone: string
          created_at: string
          currency: string
          id: string
          issue_description: string
          lat: number
          lng: number
          mechanic_id: string | null
          payment_method: string | null
          photo_urls: string[]
          price_amount: number | null
          status: string
          symptoms: string | null
          updated_at: string
          vehicle_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "service_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      finalize_payment: { Args: { p_payment_id: string }; Returns: undefined }
      has_role: { Args: { required_role: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      mechanic_active_order_id: {
        Args: { p_mechanic_id: string }
        Returns: string
      }
      notify_mechanics_open_request: {
        Args: { p_exclude_mechanic?: string; p_request_id: string }
        Returns: undefined
      }
      record_mechanic_location: {
        Args: {
          p_accuracy?: number
          p_lat: number
          p_lng: number
          p_request_id: string
        }
        Returns: undefined
      }
      refresh_mechanic_jobs: {
        Args: { p_mechanic_id: string }
        Returns: undefined
      }
      refresh_mechanic_rating: {
        Args: { p_mechanic_id: string }
        Returns: undefined
      }
      refresh_my_wallet: {
        Args: never
        Returns: {
          available_balance: number
          held_balance: number
          mechanic_id: string
          pending_balance: number
          total_earned: number
          total_withdrawn: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "mechanic_wallets"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      release_matured_earnings: { Args: never; Returns: number }
      reply_to_review: {
        Args: { p_reply: string; p_review_id: string }
        Returns: {
          client_id: string
          comment: string | null
          created_at: string
          id: string
          is_visible: boolean
          mechanic_id: string
          mechanic_reply: string | null
          rating: number
          replied_at: string | null
          request_id: string
        }
        SetofOptions: {
          from: "*"
          to: "reviews"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      request_withdrawal: {
        Args: { p_account_id: string; p_amount: number }
        Returns: {
          account_snapshot: Json
          amount: number
          completed_at: string | null
          created_at: string
          failure_code: string | null
          fee: number
          id: string
          mechanic_id: string
          payout_account_id: string | null
          reference_id: string
          status: string
          updated_at: string
          xendit_payout_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "withdrawals"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      respond_to_assignment: {
        Args: { p_action: string; p_request_id: string }
        Returns: Json
      }
      set_order_price: {
        Args: { p_price: number; p_request_id: string }
        Returns: {
          accepted_at: string | null
          additional_notes: string | null
          address: string | null
          ai_summary: string | null
          arrived_at: string | null
          assignment_expires_at: string | null
          assignment_requested_at: string | null
          client_id: string
          completed_at: string | null
          contact_phone: string
          created_at: string
          currency: string
          id: string
          issue_description: string
          lat: number
          lng: number
          mechanic_id: string | null
          payment_method: string | null
          photo_urls: string[]
          price_amount: number | null
          status: string
          symptoms: string | null
          updated_at: string
          vehicle_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "service_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_user_role: {
        Args: { p_role: string; p_user_id: string }
        Returns: Database["public"]["Tables"]["profiles"]["Row"]
      }
      setting_int: {
        Args: { p_default: number; p_key: string }
        Returns: number
      }
      settle_withdrawal: {
        Args: {
          p_failure_code?: string
          p_status: string
          p_withdrawal_id: string
        }
        Returns: undefined
      }
      vehicle_photo_visible: { Args: { p_path: string }; Returns: boolean }
    }
    Enums: {
      app_role: "client" | "mechanic" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
