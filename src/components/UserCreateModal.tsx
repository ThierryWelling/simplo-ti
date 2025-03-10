"use client";

import { useState } from 'react';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'colaborador' | 'auxiliar' | 'admin';
    department: string;
  }) => void;
}

export default function UserCreateModal({ isOpen, onClose, onSave }: UserCreateModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'colaborador' | 'auxiliar' | 'admin'>('colaborador');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    onSave({
      name,
      email,
      password,
      role,
      department,
    });
    
    // Limpar o formulário
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('colaborador');
    setDepartment('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Adicionar Novo Usuário</h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700"
          >
            &times;
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm rounded-xl mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
              required
              minLength={6}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-1">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
              required
              minLength={6}
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-zinc-700 mb-1">
              Função
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'colaborador' | 'auxiliar' | 'admin')}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
              required
            >
              <option value="colaborador">Colaborador</option>
              <option value="auxiliar">Auxiliar</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-zinc-700 mb-1">
              Departamento
            </label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
              required
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-800 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 focus:outline-none"
            >
              Criar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 