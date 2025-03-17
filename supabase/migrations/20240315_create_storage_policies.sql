-- Criar bucket para imagens de equipamentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('equipment-images', 'equipment-images', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir acesso público para leitura de arquivos
CREATE POLICY "Permitir acesso público para visualização de imagens"
ON storage.objects FOR SELECT
USING (bucket_id = 'equipment-images');

-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Permitir upload de imagens para usuários autenticados"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'equipment-images'
  AND auth.role() = 'authenticated'
);

-- Permitir atualização apenas para o proprietário do arquivo
CREATE POLICY "Permitir atualização apenas para o proprietário"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'equipment-images'
  AND owner = auth.uid()
);

-- Permitir exclusão apenas para o proprietário do arquivo
CREATE POLICY "Permitir exclusão apenas para o proprietário"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'equipment-images'
  AND owner = auth.uid()
); 