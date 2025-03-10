'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export default function RouteGuard({ 
  children, 
  requireAuth = true,
  allowedRoles = [] 
}: RouteGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirecionar para login se autenticação é necessária e usuário não está autenticado
        router.push('/login');
      } else if (!requireAuth && user) {
        // Redirecionar para chamados se usuário já está autenticado tentando acessar página pública
        router.push('/chamados');
      } else if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirecionar para chamados se usuário não tem permissão para a rota
        router.push('/chamados');
      }
    }
  }, [user, loading, requireAuth, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Carregando...
        </div>
      </div>
    );
  }

  // Renderizar children apenas se as condições de acesso forem atendidas
  if (
    (!requireAuth && !user) || // Página pública e usuário não autenticado
    (requireAuth && user && (allowedRoles.length === 0 || allowedRoles.includes(user.role))) // Página protegida, usuário autenticado e com permissão
  ) {
    return <>{children}</>;
  }

  // Não renderizar nada enquanto redireciona
  return null;
} 