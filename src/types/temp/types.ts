export type UserRole = 
  | 'Administrador del sistema' 
  | 'Gerente / Dirección' 
  | 'Jefe de Producción' 
  | 'Encargado de Almacén' 
  | 'Operario / Técnico de Taller' 
  | 'Responsable Ambiental / Calidad';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Activo' | 'Inactivo';
}

export interface MaterialItem {
  id: string;
  type: string;
  thickness: number;
  width: number;
  length: number;
  weight: number;
  status: 'Nuevo' | 'Retazo' | 'Merma';
  isUsableScrap: boolean;
  location: string;
}

export interface Order {
  id: string;
  client: string;
  description: string;
  materialType: string;
  requiredWeight: number;
  status: 'Pendiente' | 'En Producción' | 'Completado';
  date: string;
}

export interface Recommendation {
  id: string;
  orderId: string;
  suggestedItems: { material: MaterialItem, usagePercentage: number }[];
  expectedWastePercentage: number;
  reason: string;
}

export interface KPI {
  avoidedWasteKg: number;
  savedMoney: number;
  avoidedCo2Emissions: number;
  totalOrdersProcessed: number;
}

export interface MaterialCatalogItem {
  id: string;
  name: string;
  familyProfile: string;
}
