'use client';

import EquipmentForm from '@/components/EquipmentForm';
import EquipmentList from '@/components/EquipmentList';
import CsvUploader from '@/components/CsvUploader';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

export default function InventoryPage() {
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Inventário de Equipamentos
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          {showForm ? 'Fechar Formulário' : 'Adicionar Equipamento'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Adicionar Novo Equipamento
          </h2>
          <EquipmentForm onSuccess={handleSuccess} />
        </div>
      )}

      <CsvUploader onSuccess={handleSuccess} />

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Equipamentos Cadastrados
        </h2>
        <EquipmentList />
      </div>
    </div>
  );
} 