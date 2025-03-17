'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import EquipmentSelector from '@/components/EquipmentSelector';
import { FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Equipment {
  id: string;
  name: string;
  description: string;
  type: 'hardware' | 'software';
  asset_tag?: string;
}

export default function NewTicketPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para abrir um chamado');
      return;
    }

    if (!selectedEquipment) {
      toast.error('Selecione um equipamento');
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([
          {
            title,
            description,
            priority,
            equipment_id: selectedEquipment.id,
            user_id: user.id,
            status: 'open'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Chamado aberto com sucesso!');
      router.push('/chamados');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao abrir chamado');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Formulário */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">Abrir Novo Chamado</h1>
          <p className="mt-2 text-zinc-600">
            Selecione o equipamento com problema e descreva o que está acontecendo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipamento selecionado */}
          {selectedEquipment && (
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-zinc-800">{selectedEquipment.name}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{selectedEquipment.description}</p>
                  {selectedEquipment.asset_tag && (
                    <p className="text-xs text-zinc-400 mt-0.5">TAG: {selectedEquipment.asset_tag}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEquipment(null)}
                  className="text-sm text-zinc-600 hover:text-zinc-800"
                >
                  Alterar
                </button>
              </div>
            </div>
          )}

          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-800">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="Ex: Computador não liga"
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-800">
              Descrição do Problema
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="Descreva detalhadamente o problema que está enfrentando..."
            />
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-sm font-medium text-zinc-800">
              Prioridade
            </label>
            <div className="mt-2 flex gap-3">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p as 'low' | 'medium' | 'high')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                    ${priority === p
                      ? 'bg-zinc-100 border-zinc-300 text-zinc-800'
                      : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                >
                  {p === 'low' && 'Baixa'}
                  {p === 'medium' && 'Média'}
                  {p === 'high' && 'Alta'}
                </button>
              ))}
            </div>
          </div>

          {/* Botão de envio */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedEquipment}
              className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Abrindo chamado...' : 'Abrir Chamado'}
            </button>
          </div>
        </form>
      </div>

      {/* Seletor de equipamentos */}
      {!selectedEquipment && (
        <div className="w-80 flex-shrink-0">
          <EquipmentSelector onSelect={setSelectedEquipment} />
        </div>
      )}
    </div>
  );
} 