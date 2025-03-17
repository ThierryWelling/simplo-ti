'use client';

import { useState } from 'react';
import { FiUpload, FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { Equipment } from '@/types/inventory';

export default function CsvUploader({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      toast.error('Por favor, selecione um arquivo CSV');
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');

      const equipments: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>[] = rows
        .slice(1)
        .filter(row => row.trim())
        .map(row => {
          const values = row.split(',');
          return {
            name: values[0]?.trim() || '',
            description: values[1]?.trim() || '',
            company_name: values[2]?.trim() || '',
            patrimony_number: values[3]?.trim() || '',
            image_url: values[4]?.trim() || '',
          };
        });

      for (const equipment of equipments) {
        const { error } = await supabase
          .from('equipment')
          .insert([equipment]);

        if (error) throw error;
      }

      toast.success('Equipamentos importados com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Erro ao importar CSV:', error);
      toast.error('Erro ao importar equipamentos. Verifique o formato do arquivo.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = 'nome,descricao,empresa,numero_patrimonio,url_imagem';
    const example = 'Notebook Dell,Notebook para desenvolvimento,Empresa XYZ,PAT001,https://exemplo.com/imagem.jpg';
    const csvContent = `${headers}\n${example}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_inventario.csv';
    link.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Importar Equipamentos via CSV
      </h3>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={downloadTemplate}
          className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FiDownload className="mr-2" />
          Baixar Modelo CSV
        </button>

        <label className="flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 cursor-pointer">
          <FiUpload className="mr-2" />
          {loading ? 'Importando...' : 'Importar CSV'}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={loading}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Instruções:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Baixe o modelo CSV para ver o formato correto</li>
          <li>Preencha os dados dos equipamentos seguindo o modelo</li>
          <li>O número de patrimônio deve ser único para cada equipamento</li>
          <li>A URL da imagem é opcional</li>
          <li>Salve o arquivo no formato CSV (separado por vírgulas)</li>
        </ul>
      </div>
    </div>
  );
} 