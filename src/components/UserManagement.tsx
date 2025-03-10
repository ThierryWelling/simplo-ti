'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getUsers, deleteUser, updateUser } from '@/lib/users';
import { Profile } from '@/lib/users';
import UserCreateModal from './UserCreateModal';
import UserEditModal from './UserEditModal';
import { createUser } from '@/lib/auth';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error: any) {
      setError(error.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'colaborador' | 'auxiliar' | 'admin';
    department: string;
  }) => {
    try {
      await createUser(
        userData.email,
        userData.password,
        userData.name,
        userData.role,
        userData.department
      );
      await fetchUsers();
      setIsCreateModalOpen(false);
    } catch (error: any) {
      setError(error.message || 'Erro ao criar usuário');
    }
  };

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedUser: Profile) => {
    try {
      await updateUser(updatedUser.id, {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department || undefined,
      });
      await fetchUsers();
      setIsEditModalOpen(false);
    } catch (error: any) {
      setError(error.message || 'Erro ao atualizar usuário');
    }
  };

  const handleDeleteClick = (user: Profile) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      await fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      setError(error.message || 'Erro ao excluir usuário');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleText = (role: string) => {
    switch (role) {
      case 'colaborador':
        return 'Colaborador';
      case 'auxiliar':
        return 'Auxiliar';
      case 'admin':
        return 'Administrador';
      default:
        return role;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'colaborador':
        return 'bg-blue-100 text-blue-800';
      case 'auxiliar':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* Barra de ferramentas */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar usuários..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          </div>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 text-sm bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 focus:outline-none flex items-center gap-2"
        >
          <FiPlus size={18} />
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Tabela de usuários */}
      <div className="overflow-x-auto rounded-xl border border-zinc-300">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-300">
              <th className="text-left py-3 px-4 font-medium text-zinc-600">Nome</th>
              <th className="text-left py-3 px-4 font-medium text-zinc-600">Email</th>
              <th className="text-left py-3 px-4 font-medium text-zinc-600">Departamento</th>
              <th className="text-left py-3 px-4 font-medium text-zinc-600">Função</th>
              <th className="text-right py-3 px-4 font-medium text-zinc-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-zinc-200 hover:bg-zinc-50">
                  <td className="py-3 px-4">
                    <div className="animate-pulse h-4 bg-zinc-200 rounded-lg w-32"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="animate-pulse h-4 bg-zinc-200 rounded-lg w-48"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="animate-pulse h-4 bg-zinc-200 rounded-lg w-24"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="animate-pulse h-4 bg-zinc-200 rounded-lg w-20"></div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="animate-pulse h-4 bg-zinc-200 rounded-lg w-20 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                  <td className="py-3 px-4 font-medium text-zinc-900">{user.name}</td>
                  <td className="py-3 px-4 text-zinc-600">{user.email}</td>
                  <td className="py-3 px-4 text-zinc-600">{user.department || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1.5 text-zinc-600 hover:text-zinc-800 focus:outline-none rounded-lg hover:bg-zinc-100"
                        aria-label="Editar"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-1.5 text-zinc-600 hover:text-red-600 focus:outline-none rounded-lg hover:bg-red-50"
                        aria-label="Excluir"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de criação de usuário */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateUser}
      />

      {/* Modal de edição de usuário */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirmar Exclusão</h2>
            <p className="text-sm text-zinc-600 mb-6">
              Tem certeza que deseja excluir o usuário {selectedUser.name}?
              {selectedUser.role === 'admin' && (
                <span className="block mt-2 text-sm text-red-600 font-medium">
                  Atenção: Este usuário é um administrador.
                </span>
              )}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-800 focus:outline-none"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 