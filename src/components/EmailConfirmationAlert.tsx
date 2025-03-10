"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FiAlertCircle } from 'react-icons/fi';

export default function EmailConfirmationAlert() {
  const { isEmailConfirmed, user } = useAuth();

  // Só mostrar o alerta se houver um usuário logado E o email não estiver confirmado
  if (!user || isEmailConfirmed) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
      <div className="flex items-center">
        <FiAlertCircle className="h-5 w-5 mr-2" />
        <div>
          <p className="font-medium">Seu email ainda não foi confirmado</p>
          <p className="text-sm mt-1">
            Por favor, verifique sua caixa de entrada e confirme seu email para ter acesso completo ao sistema.
          </p>
        </div>
      </div>
    </div>
  );
} 