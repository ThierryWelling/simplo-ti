"use client";

import ClientLayout from '../ClientLayout';
import AdminRoute from '@/components/AdminRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientLayout>
      <AdminRoute>{children}</AdminRoute>
    </ClientLayout>
  );
} 