export interface Equipment {
  id: string;
  name: string;
  description: string;
  company_name: string;
  patrimony_number: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentFormData {
  name: string;
  description: string;
  company_name: string;
  patrimony_number: string;
  image_url?: string;
} 