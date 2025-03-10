"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-white/70 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                App Simplo TI
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                {user.role === 'colaborador' && (
                  <Link href="/chamados/novo" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                    Novo Chamado
                  </Link>
                )}
                
                <Link href="/chamados" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  Chamados
                </Link>
                
                {user.role === 'admin' && (
                  <Link href="/admin" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                    Painel Admin
                  </Link>
                )}
                
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <Link href="/perfil" className="mr-3 text-sm font-medium text-gray-700 hover:text-primary">
                      {user.name}
                    </Link>
                    <button
                      type="button"
                      className="bg-primary text-white px-3 py-1 rounded-md text-sm"
                      onClick={handleSignOut}
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  Entrar
                </Link>
                <Link href="/register" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  Registrar
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu</span>
              {/* Ícone de menu */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Ícone de fechar */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1 bg-white/70 backdrop-blur-sm">
          {user ? (
            <>
              <Link href="/perfil" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50/80">
                Meu Perfil
              </Link>
              
              {user.role === 'colaborador' && (
                <Link href="/chamados/novo" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50/80">
                  Novo Chamado
                </Link>
              )}
              
              <Link href="/chamados" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50/80">
                Chamados
              </Link>
              
              {user.role === 'admin' && (
                <Link href="/admin" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50/80">
                  Painel Admin
                </Link>
              )}
              
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-base font-medium text-gray-700">{user.name}</span>
                <button
                  type="button"
                  className="bg-primary text-white px-3 py-1 rounded-md text-sm"
                  onClick={handleSignOut}
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50/80">
                Entrar
              </Link>
              <Link href="/register" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50/80">
                Registrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 