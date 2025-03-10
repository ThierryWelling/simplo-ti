import PageContainer from '@/components/PageContainer';
import SettingsForm from '@/components/SettingsForm';
import RouteGuard from '@/components/RouteGuard';

export default function SettingsPage() {
  return (
    <RouteGuard>
      <PageContainer
        title="Configurações"
        subtitle="Personalize suas preferências"
      >
        <SettingsForm />
      </PageContainer>
    </RouteGuard>
  );
} 