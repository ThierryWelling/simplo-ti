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
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: 'colaborador' | 'auxiliar' | 'admin'
          department: string | null
          points: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'colaborador' | 'auxiliar' | 'admin'
          department?: string | null
          points?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'colaborador' | 'auxiliar' | 'admin'
          department?: string | null
          points?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      tickets: {
        Row: {
          id: string
          title: string
          description: string
          status: 'aberto' | 'em_andamento' | 'concluido' | 'cancelado'
          priority: 'baixa' | 'media' | 'alta'
          created_by: string
          assigned_to: string | null
          created_at: string
          updated_at: string | null
          closed_at: string | null
          department: string | null
          points: number | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'aberto' | 'em_andamento' | 'concluido' | 'cancelado'
          priority?: 'baixa' | 'media' | 'alta'
          created_by: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string | null
          closed_at?: string | null
          department?: string | null
          points?: number | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'aberto' | 'em_andamento' | 'concluido' | 'cancelado'
          priority?: 'baixa' | 'media' | 'alta'
          created_by?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string | null
          closed_at?: string | null
          department?: string | null
          points?: number | null
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