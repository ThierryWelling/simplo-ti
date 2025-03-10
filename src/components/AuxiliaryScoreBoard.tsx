'use client';

import { useState, useEffect } from 'react';
import { FiStar, FiAward, FiTrendingUp } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import GlassmorphismContainer from './GlassmorphismContainer';

interface AuxiliaryScore {
  id: string;
  name: string;
  points: number;
  total_tickets: number;
  average_rating: number;
}

export default function AuxiliaryScoreBoard() {
  const [scores, setScores] = useState<AuxiliaryScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      // Buscar todos os auxiliares e admins
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['auxiliar', 'admin'])
        .order('points', { ascending: false });

      if (profilesError) throw profilesError;

      // Para cada auxiliar, buscar estatísticas dos chamados
      const scoresWithStats = await Promise.all(
        profiles.map(async (profile) => {
          // Buscar chamados atribuídos a este auxiliar
          const { data: tickets, error: ticketsError } = await supabase
            .from('tickets')
            .select('rating')
            .eq('assigned_to', profile.id)
            .not('rating', 'is', null);

          if (ticketsError) throw ticketsError;

          // Calcular média das avaliações
          const ratings = tickets.map(t => t.rating).filter(r => r !== null);
          const averageRating = ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;

          return {
            id: profile.id,
            name: profile.name,
            points: profile.points || 0,
            total_tickets: tickets.length,
            average_rating: averageRating
          };
        })
      );

      setScores(scoresWithStats);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GlassmorphismContainer className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-200 rounded-xl" />
          ))}
        </div>
      </GlassmorphismContainer>
    );
  }

  if (error) {
    return (
      <GlassmorphismContainer className="p-6">
        <p className="text-red-600">Erro ao carregar pontuações: {error}</p>
      </GlassmorphismContainer>
    );
  }

  return (
    <GlassmorphismContainer className="p-6">
      <h2 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
        <FiAward className="text-yellow-500" />
        Ranking de Auxiliares
      </h2>

      <div className="space-y-4">
        {scores.map((score, index) => (
          <div
            key={score.id}
            className={`p-4 rounded-xl border ${
              index === 0 ? 'border-yellow-400 bg-yellow-50/50' :
              index === 1 ? 'border-zinc-400 bg-zinc-50/50' :
              index === 2 ? 'border-amber-700 bg-amber-50/50' :
              'border-zinc-200 bg-white/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-zinc-700">
                  #{index + 1}
                </span>
                <div>
                  <h3 className="font-medium text-zinc-800">{score.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <FiStar className="text-yellow-400" />
                      {score.average_rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiTrendingUp className="text-green-500" />
                      {score.total_tickets} chamados
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-zinc-800">
                  {score.points}
                </div>
                <div className="text-sm text-zinc-500">pontos</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassmorphismContainer>
  );
} 