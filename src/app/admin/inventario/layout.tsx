import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inventário | Painel Administrativo',
  description: 'Gerenciamento de inventário de equipamentos',
};

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 