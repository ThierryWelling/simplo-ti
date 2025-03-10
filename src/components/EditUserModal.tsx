'use client';

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { UserProfile } from '@/lib/auth';
import { inputClasses } from '@/styles/forms';
import Modal from './Modal';

interface EditUserModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (updatedUser: Partial<UserProfile>) => Promise<void>;
}

export default function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'colaborador',
    department: user.department || '',
    points: user.points || 0,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Editar Usuário</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg p-1"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={inputClasses}
            placeholder="Nome completo"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={inputClasses}
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Função
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserProfile['role'] }))}
            className={inputClasses}
          >
            <option value="colaborador">Colaborador</option>
            <option value="auxiliar">Auxiliar</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Departamento
          </label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            className={inputClasses}
            placeholder="Nome do departamento"
          />
        </div>

        <div>
          <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
            Pontos
          </label>
          <input
            type="number"
            id="points"
            value={formData.points}
            onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
            className={inputClasses}
            placeholder="0"
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 
                     transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-xl 
                     hover:bg-gray-800 focus:outline-none focus:ring-2 
                     focus:ring-gray-300 transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 