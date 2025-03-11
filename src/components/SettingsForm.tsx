'use client';

import { useState } from 'react';
import { FiSave } from 'react-icons/fi';

export default function SettingsForm() {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulação de salvamento
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-800">Tema</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-800 sm:text-sm rounded-xl bg-white text-zinc-800"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
            <option value="system">Sistema</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-800">Notificações</label>
          
          <div className="flex items-center">
            <input
              id="notifications"
              name="notifications"
              type="checkbox"
              className="h-4 w-4 text-zinc-800 focus:ring-2 focus:ring-zinc-800 border-zinc-300 rounded"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <label htmlFor="notifications" className="ml-2 block text-sm text-zinc-800">
              Receber notificações no navegador
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="emailUpdates"
              name="emailUpdates"
              type="checkbox"
              className="h-4 w-4 text-zinc-800 focus:ring-2 focus:ring-zinc-800 border-zinc-300 rounded"
              checked={emailUpdates}
              onChange={(e) => setEmailUpdates(e.target.checked)}
            />
            <label htmlFor="emailUpdates" className="ml-2 block text-sm text-zinc-800">
              Receber atualizações por e-mail
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <FiSave className="mr-2 -ml-1 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </button>
          
          {saved && (
            <span className="text-sm text-green-600 font-medium">
              Configurações salvas com sucesso!
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 