'use client';

import EquipmentForm from '@/components/EquipmentForm';
import EquipmentList from '@/components/EquipmentList';

export default function InventoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Inventário de Equipamentos
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Adicionar Novo Equipamento
        </h2>
        <EquipmentForm onSuccess={() => {
          // O componente EquipmentList irá atualizar automaticamente através do useEffect
        }} />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Equipamentos Cadastrados
        </h2>
        <EquipmentList />
      </div>
    </div>
  );
} 