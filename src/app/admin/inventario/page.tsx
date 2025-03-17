'use client';

import EquipmentForm from '@/components/EquipmentForm';
import EquipmentList from '@/components/EquipmentList';
import CsvUploader from '@/components/CsvUploader';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function InventoryPage() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSuccess = () => {
    // O componente EquipmentList irá atualizar automaticamente através do useEffect
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">
          Inventário de Equipamentos
        </h1>
        <button
          onClick={toggleForm}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-800 transition-colors"
        >
          {showForm ? (
            <>
              <FiChevronUp />
              Ocultar Formulário
            </>
          ) : (
            <>
              <FiChevronDown />
              Adicionar Equipamento
            </>
          )}
        </button>
      </div>

      <div className="space-y-8">
        {showForm && (
          <div>
            <h2 className="text-xl font-semibold text-zinc-700 mb-4">
              Adicionar Novo Equipamento
            </h2>
            <EquipmentForm onSuccess={handleSuccess} />
          </div>
        )}

        <div>
          <CsvUploader onSuccess={handleSuccess} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-zinc-700 mb-4">
            Equipamentos Cadastrados
          </h2>
          <EquipmentList />
        </div>
      </div>
    </div>
  );
} 