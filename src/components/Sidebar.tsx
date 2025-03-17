'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiUser, 
  FiClipboard, 
  FiUsers, 
  FiSettings, 
  FiLogOut, 
  FiChevronRight, 
  FiChevronLeft,
  FiBox,
  FiPackage
} from 'react-icons/fi';

interface SidebarProps {
  onToggle?: (isOpen: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const menuItems = [
    { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard', role: 'admin' },
    { href: '/admin/usuarios', icon: FiUsers, label: 'Usuários', role: 'admin' },
    { href: '/admin/inventario', icon: FiBox, label: 'Inventário', role: 'admin' },
    { href: '/chamados', icon: FiClipboard, label: 'Chamados', role: 'all' },
    { href: '/configuracoes/perfil', icon: FiSettings, label: 'Configurações', role: 'all' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 z-50
        ${isOpen ? 'w-64' : 'w-16'}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200">
          {isOpen && (
            <Link href="/" className="text-xl font-bold text-zinc-800">
              Simplo TI
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors border border-zinc-200"
            aria-label={isOpen ? 'Recolher menu' : 'Expandir menu'}
          >
            {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              if (item.role === 'admin' && user?.role !== 'admin') return null;
              
              const active = isActive(item.href);
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 border
                      ${active
                        ? 'bg-zinc-100 text-zinc-800 border-zinc-300'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 border-zinc-200 hover:border-zinc-300'
                      }
                      ${!isOpen && 'justify-center'}`}
                  >
                    <item.icon size={20} />
                    {isOpen && (
                      <span className={`ml-3 font-medium ${active ? 'text-zinc-800' : 'text-zinc-600'}`}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200">
          <div className="flex items-center mb-4">
            {isOpen && user && (
              <div>
                <p className="text-sm font-medium text-zinc-800">{user.name}</p>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={signOut}
            className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-zinc-200 hover:border-red-200
              ${!isOpen && 'justify-center'}`}
          >
            <FiLogOut size={20} />
            {isOpen && <span className="ml-3">Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
} 