'use client';

import { useState } from 'react';
import { FiUpload, FiDownload } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import Papa from 'papaparse';

export default function CsvUploader({ onSuccess }: { onSuccess: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV válido');
      return;
    }

    setUploading(true);
    try {
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          if (results.errors.length > 0) {
            toast.error('Erro ao processar o arquivo CSV');
            console.error('Erros CSV:', results.errors);
            return;
          }

          const equipments = results.data.map((row: any) => ({
            name: row.nome || '',
            description: row.descricao || '',
            company_name: row.empresa || '',
            patrimony_number: row.patrimonio || '',
            image_url: row.imagem || null
          }));

          const { error } = await supabase
            .from('equipment')
            .insert(equipments);

          if (error) throw error;

          toast.success('Equipamentos importados com sucesso!');
          onSuccess();
        },
        error: (error) => {
          console.error('Erro ao processar CSV:', error);
          toast.error('Erro ao processar o arquivo CSV');
        }
      });
    } catch (error) {
      console.error('Erro ao importar equipamentos:', error);
      toast.error('Erro ao importar equipamentos');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const headers = ['nome', 'descricao', 'empresa', 'patrimonio', 'imagem'];
    const csvContent = Papa.unparse({
      fields: headers,
      data: [
        {
          nome: 'Notebook Dell',
          descricao: 'Notebook Dell Latitude 5420',
          empresa: 'Dell',
          patrimonio: 'NT001',
          imagem: 'https://exemplo.com/imagem.jpg'
        }
      ]
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'modelo_inventario.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Importar Equipamentos via CSV
          </h3>
          <p className="text-sm text-gray-600">
            Faça upload de um arquivo CSV com os dados dos equipamentos
          </p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiDownload />
          Baixar Modelo
        </button>
      </div>

      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
          </p>
          <p className="text-xs text-gray-500">Arquivo CSV (máx. 10MB)</p>
        </div>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
          disabled={uploading}
        />
      </label>

      {uploading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Importando...</span>
        </div>
      )}
    </div>
  );
} 