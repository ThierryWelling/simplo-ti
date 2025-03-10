'use client';

import { useState } from 'react';
import { FiStar, FiX } from 'react-icons/fi';
import { rateTicket } from '@/lib/tickets';
import GlassmorphismContainer from './GlassmorphismContainer';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  userId: string;
  onRated: () => void;
}

export default function RatingModal({ isOpen, onClose, ticketId, userId, onRated }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRate = async () => {
    if (rating === 0) {
      setError('Por favor, selecione uma avaliação');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await rateTicket(ticketId, rating, userId);
      onRated();
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <GlassmorphismContainer className="relative w-full max-w-md p-6 mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-700"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-xl font-bold text-zinc-800 mb-4">
          Avalie o atendimento
        </h2>

        <p className="text-zinc-600 mb-6">
          Por favor, avalie o atendimento para poder abrir novos chamados.
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              className="p-2 transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(value)}
            >
              <FiStar
                size={32}
                className={`${
                  value <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-zinc-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-800"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleRate}
            className="px-4 py-2 text-sm bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Confirmar Avaliação'}
          </button>
        </div>
      </GlassmorphismContainer>
    </div>
  );
} 