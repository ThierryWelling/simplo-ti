'use client';

import { useState } from 'react';
import { FiSave, FiBell, FiMail, FiSmartphone } from 'react-icons/fi';

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState({
    browser: true,
    email: {
      newTicket: true,
      ticketUpdate: true,
      ticketClosed: true,
      systemUpdates: false
    },
    mobile: {
      enabled: false,
      phoneNumber: ''
    }
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleBrowserToggle = () => {
    setNotifications({
      ...notifications,
      browser: !notifications.browser
    });
  };

  const handleEmailToggle = (key: keyof typeof notifications.email) => {
    setNotifications({
      ...notifications,
      email: {
        ...notifications.email,
        [key]: !notifications.email[key]
      }
    });
  };

  const handleMobileToggle = () => {
    setNotifications({
      ...notifications,
      mobile: {
        ...notifications.mobile,
        enabled: !notifications.mobile.enabled
      }
    });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({
      ...notifications,
      mobile: {
        ...notifications.mobile,
        phoneNumber: e.target.value
      }
    });
  };

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
      <h2 className="text-xl font-medium text-gray-900">Notificações</h2>
      
      <div className="space-y-6">
        {/* Notificações do navegador */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
            <div className="flex items-center">
              <FiBell className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Notificações do Navegador</h3>
            </div>
            <div className="flex items-center">
              <span className="mr-3 text-sm text-gray-500">
                {notifications.browser ? 'Ativado' : 'Desativado'}
              </span>
              <button
                type="button"
                className={`${
                  notifications.browser ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                onClick={handleBrowserToggle}
              >
                <span
                  className={`${
                    notifications.browser ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                ></span>
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-500">
              Receba notificações no navegador quando houver atualizações em seus chamados.
            </p>
          </div>
        </div>

        {/* Notificações por email */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <FiMail className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notificações por Email</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Novos chamados</span>
              <button
                type="button"
                className={`${
                  notifications.email.newTicket ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                onClick={() => handleEmailToggle('newTicket')}
              >
                <span
                  className={`${
                    notifications.email.newTicket ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                ></span>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Atualizações em chamados</span>
              <button
                type="button"
                className={`${
                  notifications.email.ticketUpdate ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                onClick={() => handleEmailToggle('ticketUpdate')}
              >
                <span
                  className={`${
                    notifications.email.ticketUpdate ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                ></span>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Chamados fechados</span>
              <button
                type="button"
                className={`${
                  notifications.email.ticketClosed ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                onClick={() => handleEmailToggle('ticketClosed')}
              >
                <span
                  className={`${
                    notifications.email.ticketClosed ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                ></span>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Atualizações do sistema</span>
              <button
                type="button"
                className={`${
                  notifications.email.systemUpdates ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                onClick={() => handleEmailToggle('systemUpdates')}
              >
                <span
                  className={`${
                    notifications.email.systemUpdates ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                ></span>
              </button>
            </div>
          </div>
        </div>

        {/* Notificações por SMS (em breve) */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md opacity-70">
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
            <div className="flex items-center">
              <FiSmartphone className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Notificações por SMS</h3>
              <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                Em breve
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-3 text-sm text-gray-500">
                {notifications.mobile.enabled ? 'Ativado' : 'Desativado'}
              </span>
              <button
                type="button"
                className={`${
                  notifications.mobile.enabled ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                onClick={handleMobileToggle}
                disabled
              >
                <span
                  className={`${
                    notifications.mobile.enabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                ></span>
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-500 mb-4">
              Receba notificações por SMS quando houver atualizações importantes em seus chamados.
            </p>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Número de telefone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="(00) 00000-0000"
                value={notifications.mobile.phoneNumber}
                onChange={handlePhoneNumberChange}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
            <span className="ml-3 text-sm text-green-600 self-center">
              Configurações salvas com sucesso!
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 