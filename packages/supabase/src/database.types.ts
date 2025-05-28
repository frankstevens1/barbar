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
      admin_preferences: {
        Row: {
          created_at: string | null
          modified_at: string | null
          notifications: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          modified_at?: string | null
          notifications?: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          modified_at?: string | null
          notifications?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          moderated: boolean
          modified_at: string | null
          story: string
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          moderated?: boolean
          modified_at?: string | null
          story: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          moderated?: boolean
          modified_at?: string | null
          story?: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          downloads: Json
          event_id: string | null
          id: string
          modified_at: string | null
          tenant_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          description?: string | null
          downloads?: Json
          event_id?: string | null
          id?: string
          modified_at?: string | null
          tenant_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          downloads?: Json
          event_id?: string | null
          id?: string
          modified_at?: string | null
          tenant_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          access_code: string
          claimed: boolean | null
          created_at: string | null
          domain: string
          modified_at: string | null
          user_id: string | null
        }
        Insert: {
          access_code: string
          claimed?: boolean | null
          created_at?: string | null
          domain: string
          modified_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_code?: string
          claimed?: boolean | null
          created_at?: string | null
          domain?: string
          modified_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domains_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          content: Json
          created_at: string
          dates: Json
          description: string | null
          downloads: Json
          id: string
          location: Json
          modified_at: string | null
          products: Json
          tenant_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          dates?: Json
          description?: string | null
          downloads?: Json
          id?: string
          location?: Json
          modified_at?: string | null
          products?: Json
          tenant_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          dates?: Json
          description?: string | null
          downloads?: Json
          id?: string
          location?: Json
          modified_at?: string | null
          products?: Json
          tenant_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_subscriptions: {
        Row: {
          created_at: string
          feature_id: string
          id: string
          modified_at: string | null
          status: Database["public"]["Enums"]["feature_subscription_status"]
          tenant_id: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          feature_id: string
          id?: string
          modified_at?: string | null
          status?: Database["public"]["Enums"]["feature_subscription_status"]
          tenant_id?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          feature_id?: string
          id?: string
          modified_at?: string | null
          status?: Database["public"]["Enums"]["feature_subscription_status"]
          tenant_id?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_subscriptions_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          created_at: string
          description: string | null
          id: string
          modified_at: string | null
          name: string
          status: Database["public"]["Enums"]["feature_status"]
          version: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          modified_at?: string | null
          name: string
          status?: Database["public"]["Enums"]["feature_status"]
          version?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          modified_at?: string | null
          name?: string
          status?: Database["public"]["Enums"]["feature_status"]
          version?: string
        }
        Relationships: []
      }
      mock_data: {
        Row: {
          created_at: string
          data: Json
          id: string
          modified_at: string
          schema_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          modified_at?: string
          schema_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          modified_at?: string
          schema_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_data_schema_id_fkey"
            columns: ["schema_id"]
            isOneToOne: false
            referencedRelation: "schemas"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          description: string | null
          id: string
          message: string | null
          modified_at: string | null
          route: string | null
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          message?: string | null
          modified_at?: string | null
          route?: string | null
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          message?: string | null
          modified_at?: string | null
          route?: string | null
          type?: string
        }
        Relationships: []
      }
      preferences: {
        Row: {
          app: Json
          created_at: string | null
          modified_at: string | null
          notifications: Json | null
          user_id: string
        }
        Insert: {
          app?: Json
          created_at?: string | null
          modified_at?: string | null
          notifications?: Json | null
          user_id: string
        }
        Update: {
          app?: Json
          created_at?: string | null
          modified_at?: string | null
          notifications?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          expires_on: string | null
          id: string
          metadata: Json
          modified_at: string | null
          name: string
          payment_link: string | null
          price: number | null
          product_type: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          expires_on?: string | null
          id?: string
          metadata?: Json
          modified_at?: string | null
          name: string
          payment_link?: string | null
          price?: number | null
          product_type: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          expires_on?: string | null
          id?: string
          metadata?: Json
          modified_at?: string | null
          name?: string
          payment_link?: string | null
          price?: number | null
          product_type?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      relations: {
        Row: {
          channel: string
          created_at: string | null
          email: string
          id: string
          modified_at: string | null
          name: string | null
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          email: string
          id?: string
          modified_at?: string | null
          name?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          email?: string
          id?: string
          modified_at?: string | null
          name?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      schemas: {
        Row: {
          created_at: string
          fields: Json
          id: string
          modified_at: string
          name: string
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          fields: Json
          id?: string
          modified_at?: string
          name: string
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          fields?: Json
          id?: string
          modified_at?: string
          name?: string
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schemas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          modified_at: string | null
          name: string | null
          subscribed: boolean
          tenant_id: string | null
          unsubscribed_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          modified_at?: string | null
          name?: string | null
          subscribed?: boolean
          tenant_id?: string | null
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          modified_at?: string | null
          name?: string | null
          subscribed?: boolean
          tenant_id?: string | null
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscribers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      support: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          modified_at: string | null
          status: string
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          modified_at?: string | null
          status: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          modified_at?: string | null
          status?: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json
          modified_at: string | null
          notes: string | null
          status: string
          tenant_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          modified_at?: string | null
          notes?: string | null
          status?: string
          tenant_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          modified_at?: string | null
          notes?: string | null
          status?: string
          tenant_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          config: Json
          content: Json | null
          created_at: string | null
          domain: string | null
          id: string
          modified_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          config?: Json
          content?: Json | null
          created_at?: string | null
          domain?: string | null
          id?: string
          modified_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          config?: Json
          content?: Json | null
          created_at?: string | null
          domain?: string | null
          id?: string
          modified_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tenants_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants_users: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          id?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string
          display_name: string
          id: string
          message: string
          metadata: Json
          modified_at: string
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          message: string
          metadata?: Json
          modified_at?: string
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          message?: string
          metadata?: Json
          modified_at?: string
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads: {
        Row: {
          created_at: string | null
          file_key: string
          file_type: string
          filename: string
          id: string
          source: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_key: string
          file_type: string
          filename: string
          id?: string
          source: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_key?: string
          file_type?: string
          filename?: string
          id?: string
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string | null
          email_sent: string | null
          link_clicked: boolean | null
          modified_at: string | null
          notification_id: string
          read: boolean | null
          read_at: string | null
          unsubscribe_clicked: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_sent?: string | null
          link_clicked?: boolean | null
          modified_at?: string | null
          notification_id: string
          read?: boolean | null
          read_at?: string | null
          unsubscribe_clicked?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_sent?: string | null
          link_clicked?: boolean | null
          modified_at?: string | null
          notification_id?: string
          read?: boolean | null
          read_at?: string | null
          unsubscribe_clicked?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          last_sign_in_at: string | null
          modified_at: string | null
          name: string | null
          phone: string | null
          privacy: Json
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          last_sign_in_at?: string | null
          modified_at?: string | null
          name?: string | null
          phone?: string | null
          privacy?: Json
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_sign_in_at?: string | null
          modified_at?: string | null
          name?: string | null
          phone?: string | null
          privacy?: Json
        }
        Relationships: []
      }
    }
    Views: {
      distinct_locations: {
        Row: {
          address: string | null
          coordinates: string | null
          maps_url: string | null
          name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_subscriber: {
        Args: {
          p_name: string
          p_email: string
        }
        Returns: {
          success: boolean
        }[]
      }
      cleanup_temp_uploads: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      get_domain_access_code: {
        Args: {
          p_domain: string
        }
        Returns: string
      }
      get_tenant_by_domain: {
        Args: {
          p_domain: string
        }
        Returns: {
          tenant_id: string
          tenant_name: string
        }[]
      }
      handle_new_user_logic: {
        Args: {
          new_row: unknown
        }
        Returns: undefined
      }
      handle_new_user_relations_logic: {
        Args: {
          new_row: unknown
        }
        Returns: undefined
      }
      handle_new_user_subscriber_logic: {
        Args: {
          new_row: unknown
        }
        Returns: undefined
      }
      handle_new_user_tasks_logic: {
        Args: {
          new_row: unknown
        }
        Returns: undefined
      }
      insert_and_claim_domain: {
        Args: {
          p_domain: string
          p_user_id: string
        }
        Returns: undefined
      }
      insert_tenant: {
        Args: {
          p_user_id: string
          p_name: string
          p_config: Json
        }
        Returns: undefined
      }
      insert_tenant_user: {
        Args: {
          p_tenant_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      insert_user_role: {
        Args: {
          p_user_id: string
          p_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: undefined
      }
      set_comments_tenant_id: {
        Args: {
          p_user_id: string
          p_tenant_id: string
        }
        Returns: undefined
      }
      set_domain_as_claimed: {
        Args: {
          p_domain: string
          p_user_id: string
        }
        Returns: undefined
      }
      set_relations_tenant_id: {
        Args: {
          p_user_id: string
          p_tenant_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "tenant_user" | "tenant_admin" | "df_admin"
      feature_status: "development" | "beta" | "stable" | "deprecated"
      feature_subscription_status: "active" | "inactive"
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
