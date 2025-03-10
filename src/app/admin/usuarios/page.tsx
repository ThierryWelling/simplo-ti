import PageContainer from '@/components/PageContainer';
import UserManagement from '@/components/UserManagement';
import RouteGuard from '@/components/RouteGuard';

export default function UsersPage() {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <PageContainer
        title="Usuários"
        subtitle="Gerencie os usuários do sistema"
      >
        <UserManagement />
      </PageContainer>
    </RouteGuard>
  );
} 