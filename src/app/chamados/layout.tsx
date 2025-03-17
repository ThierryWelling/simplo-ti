"use client";

import { ReactNode } from 'react';
import ClientLayout from '@/components/ClientLayout';
import EmailConfirmationAlert from '@/components/EmailConfirmationAlert';

interface ChamadosLayoutProps {
  children: ReactNode;
}

export default function ChamadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 