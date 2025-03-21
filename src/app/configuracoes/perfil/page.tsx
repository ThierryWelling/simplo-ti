'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiUpload } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import GlassmorphismContainer from '@/components/GlassmorphismContainer';

export default function PerfilPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setDepartment(user.department || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name,
          department,
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassmorphismContainer className="p-6">
      <h2 className="text-xl font-medium text-zinc-800 mb-6">Meu Perfil</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-zinc-800 text-white flex items-center justify-center text-4xl">
              {name.charAt(0).toUpperCase() || 'U'}
            </div>
            <button
              type="button"
              className="mt-4 inline-flex items-center px-4 py-2 border border-zinc-300 rounded-xl shadow-sm text-sm font-medium text-zinc-800 bg-white hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              <FiUpload className="mr-2 -ml-1 h-4 w-4" />
              Alterar Foto
            </button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-800 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-xl text-zinc-800 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-800 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-xl text-zinc-800 bg-zinc-100 sm:text-sm"
                value={email}
                disabled
              />
              <p className="mt-1 text-xs text-zinc-600">
                O email não pode ser alterado. Entre em contato com o administrador se precisar mudar.
              </p>
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-zinc-800 mb-1">
                Departamento
              </label>
              <input
                type="text"
                name="department"
                id="department"
                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-xl text-zinc-800 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800 sm:text-sm"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-zinc-800 mb-1">
                Função
              </label>
              <input
                type="text"
                name="role"
                id="role"
                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-xl text-zinc-800 bg-zinc-100 sm:text-sm"
                value={user?.role || ''}
                disabled
              />
              <p className="mt-1 text-xs text-zinc-600">
                A função é definida pelo administrador do sistema.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <FiSave className="mr-2 -ml-1 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </button>
          
          {success && (
            <span className="text-sm text-green-600 font-medium">
              Perfil atualizado com sucesso!
            </span>
          )}
        </div>
      </form>
    </GlassmorphismContainer>
  );
} 