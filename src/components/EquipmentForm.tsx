'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FiUpload, FiX } from 'react-icons/fi';

interface EquipmentFormProps {
  onSuccess?: () => void;
}

export default function EquipmentForm({ onSuccess }: EquipmentFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'hardware' | 'software'>('hardware');
  const [assetTag, setAssetTag] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setFeedback({ type: 'error', message: 'A imagem deve ter no máximo 10MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFeedback({ type: 'error', message: 'O arquivo deve ser uma imagem' });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFeedback(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      let imageUrl = null;

      // Upload da imagem se existir
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `equipment-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('equipment-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('equipment-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Inserir equipamento no banco
      const { error } = await supabase
        .from('equipments')
        .insert([
          {
            name,
            description,
            type,
            asset_tag: assetTag || null,
            image_url: imageUrl
          }
        ]);

      if (error) throw error;

      setFeedback({ type: 'success', message: 'Equipamento cadastrado com sucesso!' });
      
      // Limpar formulário
      setName('');
      setDescription('');
      setType('hardware');
      setAssetTag('');
      setImage(null);
      setImagePreview(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro:', error);
      setFeedback({ type: 'error', message: 'Erro ao cadastrar equipamento' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      {/* Feedback */}
      {feedback && (
        <div className={`p-4 rounded-lg ${
          feedback.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Imagem */}
      <div>
        <label className="block text-sm font-medium text-zinc-800 mb-2">
          Imagem do Equipamento
        </label>
        <div className="flex items-center gap-4">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border border-zinc-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer hover:border-zinc-400 transition-colors">
              <FiUpload className="text-zinc-400" size={24} />
              <span className="mt-2 text-xs text-zinc-500">Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
          <div className="text-xs text-zinc-500">
            <p>Formatos aceitos: JPG, PNG, GIF</p>
            <p>Tamanho máximo: 10MB</p>
          </div>
        </div>
      </div>

      {/* Nome */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-800">
          Nome
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 text-black bg-white border border-zinc-200 rounded-lg"
          placeholder="Ex: Notebook Dell Latitude"
        />
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-800">
          Descrição
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="mt-1 block w-full px-3 py-2 text-black bg-white border border-zinc-200 rounded-lg"
          placeholder="Descreva as características do equipamento..."
        />
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-zinc-800">
          Tipo
        </label>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => setType('hardware')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors
              ${type === 'hardware'
                ? 'bg-zinc-800 border-zinc-800 text-white'
                : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
              }`}
          >
            Hardware
          </button>
          <button
            type="button"
            onClick={() => setType('software')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors
              ${type === 'software'
                ? 'bg-zinc-800 border-zinc-800 text-white'
                : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
              }`}
          >
            Software
          </button>
        </div>
      </div>

      {/* TAG do Ativo */}
      <div>
        <label htmlFor="assetTag" className="block text-sm font-medium text-zinc-800">
          TAG do Ativo
          <span className="text-zinc-500 font-normal"> (opcional)</span>
        </label>
        <input
          type="text"
          id="assetTag"
          value={assetTag}
          onChange={(e) => setAssetTag(e.target.value)}
          className="mt-1 block w-full px-3 py-2 text-black bg-white border border-zinc-200 rounded-lg"
          placeholder="Ex: NB-001"
        />
      </div>

      {/* Botão de envio */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        >
          {submitting ? 'Cadastrando...' : 'Cadastrar Equipamento'}
        </button>
      </div>
    </form>
  );
} 