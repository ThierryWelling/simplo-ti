'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FiSearch, FiBox, FiPackage } from 'react-icons/fi';

interface Equipment {
  id: string;
  name: string;
  description: string;
  type: 'hardware' | 'software';
  asset_tag?: string;
}

interface EquipmentSelectorProps {
  onSelect: (equipment: Equipment) => void;
}

export default function EquipmentSelector({ onSelect }: EquipmentSelectorProps) {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'hardware' | 'software'>('all');

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .order('name');

      if (error) throw error;

      setEquipments(data || []);
    } catch (err) {
      setError('Erro ao carregar equipamentos');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (equipment.asset_tag && equipment.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || equipment.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="w-80 bg-white border border-zinc-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-zinc-200">
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Selecionar Equipamento</h2>
        
        {/* Barra de pesquisa */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar equipamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        </div>

        {/* Filtro por tipo */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors
              ${selectedType === 'all'
                ? 'bg-zinc-100 border-zinc-300 text-zinc-800'
                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedType('hardware')}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors
              ${selectedType === 'hardware'
                ? 'bg-zinc-100 border-zinc-300 text-zinc-800'
                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
          >
            Hardware
          </button>
          <button
            onClick={() => setSelectedType('software')}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors
              ${selectedType === 'software'
                ? 'bg-zinc-100 border-zinc-300 text-zinc-800'
                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
          >
            Software
          </button>
        </div>
      </div>

      {/* Lista de equipamentos */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-zinc-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800 mx-auto"></div>
            <p className="mt-2">Carregando equipamentos...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : filteredEquipments.length === 0 ? (
          <div className="p-4 text-center text-zinc-600">
            <p>Nenhum equipamento encontrado</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {filteredEquipments.map((equipment) => (
              <li key={equipment.id}>
                <button
                  onClick={() => onSelect(equipment)}
                  className="w-full px-4 py-3 flex items-start hover:bg-zinc-50 transition-colors text-left"
                >
                  <span className="mt-0.5 mr-3">
                    {equipment.type === 'hardware' ? (
                      <FiBox className="text-zinc-600" size={20} />
                    ) : (
                      <FiPackage className="text-zinc-600" size={20} />
                    )}
                  </span>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-800">{equipment.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{equipment.description}</p>
                    {equipment.asset_tag && (
                      <p className="text-xs text-zinc-400 mt-0.5">TAG: {equipment.asset_tag}</p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 