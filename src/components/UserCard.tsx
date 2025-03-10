"use client";

import { Profile } from '@/lib/users';

interface UserCardProps {
  user: Profile;
  onEdit?: (user: Profile) => void;
  onDelete?: (user: Profile) => void;
  showActions?: boolean;
}

export default function UserCard({ user, onEdit, onDelete, showActions = true }: UserCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {getInitials(user.name)}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(user.role)}`}>
              {getRoleText(user.role)}
            </span>
            {user.points !== undefined && (
              <span className="ml-2 text-sm text-gray-500">
                {user.points} pontos
              </span>
            )}
          </div>
        </div>
        {showActions && (
          <div className="flex-shrink-0 flex">
            {onEdit && (
              <button
                onClick={() => onEdit(user)}
                className="text-primary hover:text-primary/80 mr-3"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(user)}
                className="text-red-600 hover:text-red-900"
              >
                Remover
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 