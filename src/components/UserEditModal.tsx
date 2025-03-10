"use client";

import { useState, useEffect } from 'react';
import { Profile } from '@/lib/users';

interface UserEditModalProps {
  user: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: Profile) => void;
}

export default function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'colaborador' | 'auxiliar' | 'admin'>('colaborador');
  const [department, setDepartment] = useState('');
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setDepartment(user.department || '');
      setPoints(user.points || 0);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    onSave({
      ...user,
      name,
      email,
      role,
      department,
      points,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Editar Usuário</h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700"
          >
            &times;
          </button>
        </div>
        
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
            />
          </div>
          
          <div>
            <label htmlFor="points" className="block text-sm font-medium text-zinc-700 mb-1">
              Pontos
            </label>
            <input
              type="number"
              id="points"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
              min="0"
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
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 