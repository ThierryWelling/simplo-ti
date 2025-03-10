'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiUser, FiSettings, FiBell } from 'react-icons/fi';
import ClientLayout from '../ClientLayout';

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
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-lg font-medium leading-6 text-gray-900">Configurações</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Gerencie suas preferências e informações pessoais
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="flex flex-col md:flex-row">
            {/* Navegação lateral */}
            <nav className="md:w-64 p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 rounded-md ${
                        isActive(item.href)
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Conteúdo */}
            <div className="flex-1 p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return <ClientLayout>{content}</ClientLayout>;
} 