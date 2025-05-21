export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      bundles: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          image_url: string | null
          price: number
          user_id: string
          category: string
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          image_url?: string | null
          price: number
          user_id: string
          category: string
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          image_url?: string | null
          price?: number
          user_id?: string
          category?: string
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "bundles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          model: string
          type: string
          bundle_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          model: string
          type: string
          bundle_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          model?: string
          type?: string
          bundle_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompts_bundle_id_fkey"
            columns: ["bundle_id"]
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          username: string
          avatar_url: string | null
          coins: number
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          username: string
          avatar_url?: string | null
          coins?: number
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          username?: string
          avatar_url?: string | null
          coins?: number
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
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
