'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import GlassmorphismContainer from '@/components/GlassmorphismContainer';
import EmailConfirmationMessage from '@/components/EmailConfirmationMessage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsEmailConfirmation(false);

    try {
      await signIn(email, password);
      // O redirecionamento agora é feito no AuthContext
    } catch (error: any) {
      if (error.message === 'EMAIL_NOT_CONFIRMED') {
        setNeedsEmailConfirmation(true);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-800">Bem-vindo de volta</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-medium text-zinc-800 hover:text-zinc-700">
              Registre-se
            </Link>
          </p>
        </div>

        <GlassmorphismContainer className="p-8">
          {needsEmailConfirmation && (
            <EmailConfirmationMessage email={email} />
          )}

          {error && !needsEmailConfirmation && (
            <div className="bg-red-100/50 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 w-full px-4 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 w-full px-4 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </GlassmorphismContainer>
      </div>
    </div>
  );
} 