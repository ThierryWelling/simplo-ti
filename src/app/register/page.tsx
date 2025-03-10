'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLock, FiBriefcase } from 'react-icons/fi';
import Link from 'next/link';
import { signUp } from '@/lib/auth';
import { inputClasses } from '@/styles/forms';
import GlassmorphismContainer from '@/components/GlassmorphismContainer';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!name || !email || !password || !confirmPassword || !department) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      await signUp(email, password, name, department);
      
      setSuccess('Conta criada com sucesso! Por favor, verifique seu email para confirmar o cadastro.');
      
      // Limpar os campos após sucesso
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDepartment('');
      
    } catch (error: any) {
      // Tratamento específico para erros comuns
      if (error.message.includes('email já está cadastrado')) {
        setError('Este email já está em uso. Por favor, use outro email ou faça login.');
      } else if (error.message.includes('invalid email')) {
        setError('Por favor, insira um email válido.');
      } else if (error.message.includes('weak password')) {
        setError('A senha é muito fraca. Use uma combinação de letras, números e símbolos.');
      } else {
        setError(error.message || 'Erro ao criar conta. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-800">[SIMPLO_TI]</h1>
          <p className="text-sm text-zinc-600 mt-2">Crie sua conta para acessar o sistema</p>
        </div>

        <GlassmorphismContainer className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
                placeholder="Seu nome completo"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                placeholder="Seu e-mail"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={inputClasses}
                placeholder="Seu departamento"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClasses}
                placeholder="Confirme sua senha"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm bg-zinc-800 text-white rounded-xl 
                       hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-sm text-zinc-600 hover:text-zinc-800"
            >
              Já tem uma conta? Faça login
            </Link>
          </div>
        </GlassmorphismContainer>

        {/* Rodapé */}
        <div className="text-center mt-8">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} SIMPLO TI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
} 