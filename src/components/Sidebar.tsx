'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiMenu, FiX, FiHome, FiUser, FiClipboard, FiUsers, FiSettings, FiLogOut, FiChevronRight, FiChevronLeft, FiBox } from 'react-icons/fi';

interface SidebarProps {
  onToggle?: (isOpen: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (onToggle) {
      onToggle(isOpen);
    }
  }, [isOpen, onToggle]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'}
        md:translate-x-0
        ${!isOpen && !isMobile ? 'translate-x-0' : ''}
        ${!isOpen && isMobile ? '-translate-x-full' : ''}
        border-r border-zinc-300
        bg-white
        rounded-r-2xl
      `}
    >
      {/* Botão de toggle para dispositivos móveis */}
      <button
        className={`
          fixed md:hidden
          ${isOpen ? 'left-64' : 'left-20'}
          top-4 z-50 p-2
          bg-white
          border border-zinc-300
          text-zinc-800
          hover:bg-zinc-100
          transition-all duration-300
          rounded-xl
        `}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay para dispositivos móveis */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Cabeçalho */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-300">
        <div className="flex items-center">
          <span className={`text-xl font-bold text-zinc-800 transition-all duration-300 ${isOpen ? 'w-auto' : 'w-0 overflow-hidden'}`}>
            {isOpen ? '[SIMPLO_TI]' : ''}
          </span>
          <span className={`text-xl font-bold text-zinc-800 ${!isOpen ? 'block' : 'hidden'}`}>
            [TI]
          </span>
        </div>
        <button
          className="hidden md:flex items-center justify-center w-8 h-8 text-zinc-800 hover:bg-zinc-100 transition-colors rounded-lg"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
      </div>

      {/* Perfil do usuário */}
      {user && (
        <div className={`p-4 border-b border-zinc-300 transition-all duration-300 ${isOpen ? 'flex items-center' : 'flex flex-col items-center'}`}>
          <div className="w-10 h-10 flex items-center justify-center border border-zinc-300 text-zinc-800 bg-white rounded-xl">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {isOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-zinc-800 truncate">{user.name}</p>
              <p className="text-xs text-zinc-600 truncate uppercase">{user.role}</p>
            </div>
          )}
        </div>
      )}

      {/* Menu de navegação */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {user?.role === 'admin' && (
            <>
              <li>
                <Link
                  href="/admin/dashboard" 
                  className={`
                    flex items-center p-2
                    transition-all duration-300
                    border border-zinc-300
                    hover:bg-zinc-100
                    rounded-xl
                    ${isActive('/admin/dashboard') 
                      ? 'bg-zinc-200 text-zinc-800' 
                      : 'text-zinc-600 hover:text-zinc-800'
                    }
                    ${!isOpen && 'justify-center'}
                  `}
                >
                  <FiHome size={20} />
                  <span className={`ml-3 uppercase tracking-wider text-sm transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                    Dashboard
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/inventario"
                  className={`
                    flex items-center p-2
                    transition-all duration-300
                    border border-zinc-300
                    hover:bg-zinc-100
                    rounded-xl
                    ${isActive('/admin/inventario')
                      ? 'bg-zinc-200 text-zinc-800'
                      : 'text-zinc-600 hover:text-zinc-800'
                    }
                    ${!isOpen && 'justify-center'}
                  `}
                >
                  <FiBox size={20} />
                  <span className={`ml-3 uppercase tracking-wider text-sm transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                    Inventário
                  </span>
                </Link>
              </li>
            </>
          )}

          {user?.role === 'colaborador' && (
            <li>
              <Link
                href="/chamados"
                className={`
                  flex items-center p-2
                  transition-all duration-300
                  border border-zinc-300
                  hover:bg-zinc-100
                  rounded-xl
                  ${isActive('/chamados') 
                    ? 'bg-zinc-200 text-zinc-800' 
                    : 'text-zinc-600 hover:text-zinc-800'
                  }
                  ${!isOpen && 'justify-center'}
                `}
              >
                <FiClipboard size={20} />
                <span className={`ml-3 uppercase tracking-wider text-sm transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                  Meus Chamados
                </span>
              </Link>
            </li>
          )}

          {(user?.role === 'auxiliar' || user?.role === 'admin') && (
            <li>
              <Link
                href="/chamados/gerenciar"
                className={`
                  flex items-center p-2
                  transition-all duration-300
                  border border-zinc-300
                  hover:bg-zinc-100
                  rounded-xl
                  ${isActive('/chamados/gerenciar') 
                    ? 'bg-zinc-200 text-zinc-800' 
                    : 'text-zinc-600 hover:text-zinc-800'
                  }
                  ${!isOpen && 'justify-center'}
                `}
              >
                <FiClipboard size={20} />
                <span className={`ml-3 uppercase tracking-wider text-sm transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                  Gerenciar Chamados
                </span>
              </Link>
            </li>
          )}

          {user?.role === 'admin' && (
            <li>
              <Link
                href="/admin/usuarios"
                className={`
                  flex items-center p-2
                  transition-all duration-300
                  border border-zinc-300
                  hover:bg-zinc-100
                  rounded-xl
                  ${isActive('/admin/usuarios') 
                    ? 'bg-zinc-200 text-zinc-800' 
                    : 'text-zinc-600 hover:text-zinc-800'
                  }
                  ${!isOpen && 'justify-center'}
                `}
              >
                <FiUsers size={20} />
                <span className={`ml-3 uppercase tracking-wider text-sm transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                  Usuários
                </span>
              </Link>
            </li>
          )}

          <li>
            <Link
              href="/configuracoes"
              className={`
                flex items-center p-2
                transition-all duration-300
                border border-zinc-300
                hover:bg-zinc-100
                rounded-xl
                ${isActive('/configuracoes') 
                  ? 'bg-zinc-200 text-zinc-800' 
                  : 'text-zinc-600 hover:text-zinc-800'
                }
                ${!isOpen && 'justify-center'}
              `}
            >
              <FiSettings size={20} />
              <span className={`ml-3 uppercase tracking-wider text-sm transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                Config
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Botão de logout */}
      <div className="p-4 border-t border-zinc-300">
        <button
          onClick={handleSignOut}
          className={`
            flex items-center p-2 w-full
            text-zinc-600 hover:text-zinc-800
            border border-zinc-300
            hover:bg-zinc-100
            transition-all duration-300
            rounded-xl
            ${!isOpen && 'justify-center'}
          `}
        >
          <FiLogOut size={20} />
          <span className={`ml-3 uppercase tracking-wider text-sm transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
} 