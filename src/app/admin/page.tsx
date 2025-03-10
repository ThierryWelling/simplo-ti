'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers, getUserStats, getTopAuxiliares, updateUser, deleteUser, Profile } from '@/lib/users';
import { getTicketStats } from '@/lib/tickets';
import { createUser, updateUserRole } from '@/lib/auth';
import UserCard from '@/components/UserCard';
import UserEditModal from '@/components/UserEditModal';
import UserCreateModal from '@/components/UserCreateModal';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function AdminDashboard() {
  const [auxiliares, setAuxiliares] = useState<Profile[]>([]);
  const [colaboradores, setColaboradores] = useState<Profile[]>([]);
  const [topAuxiliares, setTopAuxiliares] = useState<Profile[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [ticketStats, setTicketStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const fetchData = async () => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    try {
      setLoading(true);
      // Buscar estatísticas de usuários
      const userStatsData = await getUserStats();
      setUserStats(userStatsData);

      // Buscar estatísticas de chamados
      const ticketStatsData = await getTicketStats();
      setTicketStats(ticketStatsData);

      // Buscar auxiliares
      const auxiliaresData = await getUsers('auxiliar');
      setAuxiliares(auxiliaresData);

      // Buscar colaboradores
      const colaboradoresData = await getUsers('colaborador');
      setColaboradores(colaboradoresData);

      // Buscar top auxiliares
      const topAuxiliaresData = await getTopAuxiliares(5);
      setTopAuxiliares(topAuxiliaresData);
      
      setError('');
    } catch (error: any) {
      setError(error.message || 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, router]);

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: Profile) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handlePromoteUser = (user: Profile) => {
    setSelectedUser(user);
    setIsPromoteModalOpen(true);
  };

  const handleConfirmPromote = async () => {
    if (!selectedUser) return;
    
    try {
      await updateUserRole(selectedUser.id, 'auxiliar');
      
      // Atualizar os dados
      await fetchData();
      
      // Fechar o modal
      setIsPromoteModalOpen(false);
    } catch (error: any) {
      setError(error.message || 'Erro ao promover usuário');
    }
  };

  const handleSaveUser = async (updatedUser: Profile) => {
    try {
      await updateUser(updatedUser.id, {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department as string | undefined,
      });
      
      // Atualizar os dados
      await fetchData();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setError('Erro ao atualizar usuário');
    }
  };

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
      
      // Atualizar os dados
      await fetchData();
      
      // Fechar o modal
      setIsCreateModalOpen(false);
    } catch (error: any) {
      setError(error.message || 'Erro ao criar usuário');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      
      // Atualizar os dados
      await fetchData();
      
      // Fechar o modal
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      setError(error.message || 'Erro ao excluir usuário');
    }
  };

  if (loading && !userStats) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Chamados Abertos</h2>
          <p className="mt-1 text-3xl font-semibold text-primary">{ticketStats?.open || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Em Andamento</h2>
          <p className="mt-1 text-3xl font-semibold text-primary">{ticketStats?.inProgress || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Concluídos</h2>
          <p className="mt-1 text-3xl font-semibold text-primary">{ticketStats?.completed || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Total de Usuários</h2>
          <p className="mt-1 text-3xl font-semibold text-primary">{userStats?.total || 0}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Top Auxiliares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topAuxiliares.length > 0 ? (
            topAuxiliares.map((auxiliar) => (
              <UserCard 
                key={auxiliar.id} 
                user={auxiliar} 
                showActions={false}
              />
            ))
          ) : (
            <p className="text-gray-500">Nenhum auxiliar encontrado</p>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Auxiliares</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Gerenciar auxiliares e suas permissões</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Adicionar Novo Usuário
          </button>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500">Carregando auxiliares...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {auxiliares.length > 0 ? (
                auxiliares.map((auxiliar) => (
                  <UserCard 
                    key={auxiliar.id} 
                    user={auxiliar} 
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                ))
              ) : (
                <p className="text-gray-500">Nenhum auxiliar encontrado</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Seção de Colaboradores */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Colaboradores</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Gerenciar colaboradores e promover para auxiliares</p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500">Carregando colaboradores...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {colaboradores.length > 0 ? (
                colaboradores.map((colaborador) => (
                  <div key={colaborador.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{colaborador.name}</h3>
                      <p className="text-sm text-gray-500">{colaborador.email}</p>
                      <p className="text-sm text-gray-500">Departamento: {colaborador.department || 'Não especificado'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        onClick={() => handlePromoteUser(colaborador)}
                      >
                        Promover para Auxiliar
                      </button>
                      <button 
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => handleEditUser(colaborador)}
                      >
                        Editar
                      </button>
                      <button 
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => handleDeleteUser(colaborador)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nenhum colaborador encontrado</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Modais */}
      <UserEditModal 
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
      />
      
      <UserCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateUser}
      />
      
      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o usuário ${selectedUser?.name}?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDestructive={true}
      />
      
      <ConfirmationModal 
        isOpen={isPromoteModalOpen}
        title="Promover Colaborador"
        message={`Tem certeza que deseja promover ${selectedUser?.name} para Auxiliar? Isso dará a ele acesso para atender chamados.`}
        confirmText="Promover"
        cancelText="Cancelar"
        onConfirm={handleConfirmPromote}
        onCancel={() => setIsPromoteModalOpen(false)}
        isDestructive={false}
      />
    </div>
  );
} 