'use client';

import { useState } from 'react';
import { FiAlertCircle, FiMail } from 'react-icons/fi';
import { resendConfirmationEmail } from '@/lib/auth';

interface EmailConfirmationMessageProps {
  email: string;
}

export default function EmailConfirmationMessage({ email }: EmailConfirmationMessageProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await resendConfirmationEmail(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FiAlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Email não confirmado</h3>
          <div className="mt-2">
            <p className="text-sm text-yellow-700">
              Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.
            </p>
          </div>
          {!success && (
            <div className="mt-4">
              <button
                onClick={handleResendEmail}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-yellow-400 text-sm font-medium rounded-xl text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                <FiMail className="-ml-0.5 mr-2 h-4 w-4" />
                {loading ? 'Enviando...' : 'Reenviar email de confirmação'}
              </button>
            </div>
          )}
          {success && (
            <p className="mt-2 text-sm text-green-600">
              Email de confirmação reenviado com sucesso! Por favor, verifique sua caixa de entrada.
            </p>
          )}
          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 