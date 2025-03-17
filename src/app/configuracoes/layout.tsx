'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiUser, FiSettings, FiBell } from 'react-icons/fi';
import GlassmorphismContainer from '@/components/GlassmorphismContainer';

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { href: '/configuracoes', label: 'Geral', icon: FiSettings },
    { href: '/configuracoes/perfil', label: 'Meu Perfil', icon: FiUser },
    { href: '/configuracoes/notificacoes', label: 'Notificações', icon: FiBell },
  ];

  const content = (
    <div className="space-y-6">
      <GlassmorphismContainer className="p-6">
        <div>
          <h1 className="text-lg font-medium leading-6 text-zinc-800">Configurações</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">
            Gerencie suas preferências e informações pessoais
          </p>
        </div>
        
        <div className="mt-6 border-t border-zinc-200">
          <nav className="flex space-x-8 mt-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'text-zinc-800 bg-zinc-100'
                      : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'text-zinc-800' : 'text-zinc-400'}`} />
                  <span className="ml-2">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </GlassmorphismContainer>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );

  return content;
} 