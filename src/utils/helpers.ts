"use client";

import { Ticket, UserProfile } from '@/lib/supabase';

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'aberto':
      return 'bg-gradient-to-r from-yellow-200 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 text-yellow-800 dark:text-yellow-100 shadow-yellow-500/20 shadow-lg';
    case 'em_andamento':
      return 'bg-gradient-to-r from-blue-200 to-blue-100 dark:from-blue-900 dark:to-blue-800 text-blue-800 dark:text-blue-100 shadow-blue-500/20 shadow-lg';
    case 'concluido':
      return 'bg-gradient-to-r from-green-200 to-green-100 dark:from-green-900 dark:to-green-800 text-green-800 dark:text-green-100 shadow-green-500/20 shadow-lg';
    case 'cancelado':
      return 'bg-gradient-to-r from-red-200 to-red-100 dark:from-red-900 dark:to-red-800 text-red-800 dark:text-red-100 shadow-red-500/20 shadow-lg';
    default:
      return 'bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 shadow-gray-500/20 shadow-lg';
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case 'aberto':
      return 'Aberto';
    case 'em_andamento':
      return 'Em andamento';
    case 'concluido':
      return 'Concluído';
    case 'cancelado':
      return 'Cancelado';
    default:
      return 'Desconhecido';
  }
}

export function getPrioridadeBadgeClass(prioridade: string): string {
  switch (prioridade.toLowerCase()) {
    case 'baixa':
      return 'bg-gradient-to-r from-green-200 to-emerald-100 dark:from-green-900 dark:to-emerald-800 text-green-800 dark:text-green-100 shadow-green-500/20 shadow-lg';
    case 'media':
      return 'bg-gradient-to-r from-yellow-200 to-orange-100 dark:from-yellow-900 dark:to-orange-800 text-yellow-800 dark:text-yellow-100 shadow-yellow-500/20 shadow-lg';
    case 'alta':
      return 'bg-gradient-to-r from-red-200 to-rose-100 dark:from-red-900 dark:to-rose-800 text-red-800 dark:text-red-100 shadow-red-500/20 shadow-lg';
    default:
      return 'bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 shadow-gray-500/20 shadow-lg';
  }
}

export function getPrioridadeText(prioridade: string): string {
  switch (prioridade) {
    case 'baixa':
      return 'Baixa';
    case 'media':
      return 'Média';
    case 'alta':
      return 'Alta';
    case 'urgente':
      return 'Urgente';
    default:
      return prioridade;
  }
}

export function calculatePoints(rating: number): number {
  // Base de pontos por atendimento
  const basePoints = 10;
  
  // Multiplicador baseado na avaliação (1-5 estrelas)
  const multiplier = rating / 5;
  
  // Pontos finais
  return Math.round(basePoints * (1 + multiplier));
}

export function canUserAccessRoute(user: UserProfile | null, allowedRoles: string[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
} 