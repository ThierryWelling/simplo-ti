'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createTicket } from '@/lib/tickets';
import PageContainer from '@/components/PageContainer';
import GlassmorphismContainer from '@/components/GlassmorphismContainer';

export default function NovoChamado() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Você precisa estar logado para criar um chamado');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await createTicket(
        titulo,
        descricao,
        categoria,
        prioridade as 'baixa' | 'media' | 'alta' | 'urgente',
        user.id
      );
      
      setSuccess(true);
      
      // Limpar o formulário
      setTitulo('');
      setDescricao('');
      setCategoria('');
      setPrioridade('');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/chamados');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Erro ao criar chamado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-zinc-800">Criar Novo Chamado</h1>
        </div>

        <GlassmorphismContainer className="p-6">
          {success && (
            <div className="bg-green-100/50 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-6">
              <span className="block sm:inline">Chamado criado com sucesso! Redirecionando...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100/50 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-zinc-700">
                Título
              </label>
              <input
                type="text"
                name="titulo"
                id="titulo"
                className="mt-1 w-full px-4 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
                placeholder="Descreva brevemente o problema"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-zinc-700">
                Descrição
              </label>
              <textarea
                name="descricao"
                id="descricao"
                rows={5}
                className="mt-1 w-full px-4 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
                placeholder="Descreva detalhadamente o problema"
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-zinc-700">
                Categoria
              </label>
              <select
                id="categoria"
                name="categoria"
                className="mt-1 w-full px-4 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
                required
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Selecione uma categoria</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="rede">Rede</option>
                <option value="email">E-mail</option>
                <option value="impressora">Impressora</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="prioridade" className="block text-sm font-medium text-zinc-700">
                Prioridade
              </label>
              <select
                id="prioridade"
                name="prioridade"
                className="mt-1 w-full px-4 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
                required
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
              >
                <option value="">Selecione a prioridade</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Chamado'}
              </button>
            </div>
          </form>
        </GlassmorphismContainer>
      </div>
    </PageContainer>
  );
} 