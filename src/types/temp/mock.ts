import { MaterialItem, Order, Recommendation, KPI, User, MaterialCatalogItem } from './types'

export const mockUsers: User[] = [
  { id: 'USR-001', name: 'Carlos Mendoza', email: 'cmendoza@scrapopt.com', role: 'Administrador del sistema', status: 'Activo' },
  { id: 'USR-002', name: 'Ana Torres', email: 'atorres@scrapopt.com', role: 'Gerente / Dirección', status: 'Activo' },
  { id: 'USR-003', name: 'Roberto Gómez', email: 'rgomez@scrapopt.com', role: 'Jefe de Producción', status: 'Activo' },
  { id: 'USR-004', name: 'Luis Silva', email: 'lsilva@scrapopt.com', role: 'Encargado de Almacén', status: 'Activo' },
  { id: 'USR-005', name: 'María Paredes', email: 'mparedes@scrapopt.com', role: 'Operario / Técnico de Taller', status: 'Activo' },
  { id: 'USR-006', name: 'Jorge Castro', email: 'jcastro@scrapopt.com', role: 'Responsable Ambiental / Calidad', status: 'Activo' },
  { id: 'USR-007', name: 'Diego Ríos', email: 'drios@scrapopt.com', role: 'Operario / Técnico de Taller', status: 'Inactivo' },
];

export const mockCatalog: MaterialCatalogItem[] = [
  { id: 'CAT-001', name: 'Acero A36', familyProfile: 'Planchas Estructurales' },
  { id: 'CAT-002', name: 'Acero Inoxidable 304', familyProfile: 'Planchas Inoxidables' },
  { id: 'CAT-003', name: 'Acero A572 Gr 50', familyProfile: 'Planchas de Alta Resistencia' },
  { id: 'CAT-004', name: 'Aluminio 6061', familyProfile: 'Aleaciones de Aluminio' },
];

export const mockMaterials: MaterialItem[] = [
  { id: 'MAT-001', type: 'Acero A36', thickness: 6.35, width: 1220, length: 2440, weight: 148.5, status: 'Nuevo', isUsableScrap: false, location: 'Zona A' },
  { id: 'MAT-002', type: 'Acero A36', thickness: 6.35, width: 800, length: 1100, weight: 43.8, status: 'Retazo', isUsableScrap: true, location: 'Zona R1' },
  { id: 'MAT-003', type: 'Acero Inoxidable 304', thickness: 3.0, width: 1500, length: 3000, weight: 108.0, status: 'Nuevo', isUsableScrap: false, location: 'Zona B' },
  { id: 'MAT-004', type: 'Acero Inoxidable 304', thickness: 3.0, width: 500, length: 1500, weight: 18.0, status: 'Retazo', isUsableScrap: true, location: 'Zona R2' },
  { id: 'MAT-005', type: 'Acero A572 Gr 50', thickness: 12.7, width: 2440, length: 6096, weight: 1483.5, status: 'Nuevo', isUsableScrap: false, location: 'Exterior 1' },
  { id: 'MAT-006', type: 'Acero A36', thickness: 6.35, width: 300, length: 400, weight: 5.9, status: 'Retazo', isUsableScrap: false, location: 'Basurero 1' },
  { id: 'MAT-007', type: 'Aluminio 6061', thickness: 6.35, width: 1200, length: 2400, weight: 49.3, status: 'Nuevo', isUsableScrap: false, location: 'Zona C' },
  { id: 'MAT-008', type: 'Acero A36', thickness: 6.35, width: 450, length: 1200, weight: 26.9, status: 'Retazo', isUsableScrap: true, location: 'Zona R1' },
  { id: 'MAT-009', type: 'Acero A36', thickness: 6.35, width: 600, length: 600, weight: 17.9, status: 'Retazo', isUsableScrap: true, location: 'Zona R1' },
];

export const mockOrders: Order[] = [
  { id: 'ORD-1042', client: 'Constructora Alfa', description: 'Placas base para columnas', materialType: 'Acero A36', requiredWeight: 65.0, status: 'Pendiente', date: '2023-10-24' },
  { id: 'ORD-1043', client: 'Industrias Beta', description: 'Cubiertas de motor', materialType: 'Acero Inoxidable 304', requiredWeight: 15.0, status: 'Pendiente', date: '2023-10-25' },
  { id: 'ORD-1044', client: 'Metalúrgica Delta', description: 'Vigas de soporte', materialType: 'Acero A572 Gr 50', requiredWeight: 1200.0, status: 'En Producción', date: '2023-10-22' },
];

export const mockRecommendations: Record<string, Recommendation> = {
  'ORD-1042': {
    id: 'REC-501',
    orderId: 'ORD-1042',
    suggestedItems: [
      { material: mockMaterials[1], usagePercentage: 100 }, // Usa todo MAT-002 (43.8kg)
      { material: mockMaterials[7], usagePercentage: 80 },  // Usa 80% de MAT-008 (~21.5kg) -> Total ~65.3kg
    ],
    expectedWastePercentage: 4.2, // Muy bajo comparado con cortar una placa nueva
    reason: 'Combinando retazos MAT-002 y MAT-008 de la Zona R1 se cubre el área necesaria para las placas base de 6.35mm con un algoritmo de anidamiento (nesting) óptimo. Evita desperdiciar de MAT-001 (Plancha nueva).',
  },
  'ORD-1043': {
    id: 'REC-502',
    orderId: 'ORD-1043',
    suggestedItems: [
      { material: mockMaterials[3], usagePercentage: 85 }, // Usa 85% de MAT-004 (15.3kg)
    ],
    expectedWastePercentage: 2.1,
    reason: 'El retazo MAT-004 encaja perfectamente para las dimensiones de las cubiertas. Se libera espacio en Zona R2 y se reserva la plancha nueva MAT-003.',
  }
};

export const mockKPIs: KPI = {
  avoidedWasteKg: 3450.5,
  savedMoney: 5175.75, // Estimando ~$1.5/kg
  avoidedCo2Emissions: 6555.95, // Estimando ~1.9kg CO2 / kg acero
  totalOrdersProcessed: 142,
};