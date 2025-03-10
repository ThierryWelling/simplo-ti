'use client';

import { Inter } from 'next/font/google';
import GridBackground from '@/components/GridBackground';
import AuthLayout from '../AuthLayout';

const inter = Inter({ subsets: ['latin'] });

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
} 