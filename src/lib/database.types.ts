export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      equipment: {
        Row: {
          id: string
          name: string
          description: string | null
          company_name: string
          patrimony_number: string
          image_url: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          company_name: string
          patrimony_number: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          company_name?: string
          patrimony_number?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'colaborador' | 'auxiliar' | 'admin'
          department?: string
          points?: number
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'colaborador' | 'auxiliar' | 'admin'
          department?: string
          points?: number
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'colaborador' | 'auxiliar' | 'admin'
          department?: string
          points?: number
        }
      }
      tickets: {
        Row: {
          id: string
          title: string
          description: string
          status: 'aberto' | 'em_andamento' | 'concluido'
          priority?: string
          category?: string
          created_at: string
          created_by: string
          assigned_to?: string
          rating?: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'aberto' | 'em_andamento' | 'concluido'
          priority?: string
          category?: string
          created_at?: string
          created_by: string
          assigned_to?: string
          rating?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'aberto' | 'em_andamento' | 'concluido'
          priority?: string
          category?: string
          created_at?: string
          created_by?: string
          assigned_to?: string
          rating?: number
        }
      }
      ticket_updates: {
        Row: {
          id: string
          ticket_id: string
          message: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          message: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          message?: string
          created_by?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          ticket_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          ticket_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          ticket_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string | null
        }
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
  }
} 