// 1. ENUMS (Uniones de strings en TS)
export type RolUsuario = 'ADMINISTRADOR' | 'GERENTE' | 'JEFE_PRODUCCION' | 'ALMACEN' | 'OPERARIO' | 'AMBIENTAL';
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO';
export type FamiliaPerfil = 'PLANCHA' | 'TUBO' | 'ANGULO' | 'BARRA' | 'PERFIL_I' | 'OTRO';
export type EstadoMaterial = 'NUEVO' | 'RETAZO_APROVECHABLE' | 'MERMA_CHATARRA';
export type EstadoOrden = 'PENDIENTE' | 'ANALIZADA_ML' | 'EN_PRODUCCION' | 'COMPLETADA';
export type EstadoRecomendacion = 'SUGERIDA' | 'APROBADA' | 'RECHAZADA';
export type TipoMovimiento = 'INGRESO_COMPRA' | 'SALIDA_PRODUCCION' | 'INGRESO_RETAZO_SOBRANTE' | 'BAJA_CHATARRA';

// 2. INTERFACES PRINCIPALES

export interface Usuario {
  id: string;
  nombre_completo: string;
  email: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  creado_en: Date;
  actualizado_en: Date;
}

export interface CatalogoMaterial {
  id: string;
  codigo_interno: string | null;
  nombre: string;
  familia_perfil: FamiliaPerfil;
  creado_en: Date;
  actualizado_en: Date;
}

export interface Material {
  id: string;
  codigo_interno: string | null;
  catalogo_id: string;
  catalogo?: CatalogoMaterial; // Opcional porque en un fetch simple puede no venir
  espesor_mm: number | null;
  ancho_mm: number | null;
  largo_mm: number | null;
  peso_kg: number;
  ubicacion: string | null;
  estado_material: EstadoMaterial;
  aprovechable_ml: boolean;
  costo_estimado_kg: number;
  creado_en: Date;
  actualizado_en: Date;
}

export interface OrdenFabricacion {
  id: string;
  codigo_interno: string | null;
  cliente_proyecto: string;
  descripcion: string | null;
  catalogo_requerido_id: string;
  catalogo_requerido?: CatalogoMaterial;
  peso_estimado_kg: number;
  fecha_entrega: Date;
  estado_orden: EstadoOrden;
  creado_por_id: string;
  creado_por?: Usuario;
  creado_en: Date;
  actualizado_en: Date;
}

export interface RecomendacionML {
  id: string;
  orden_id: string;
  peso_teorico_bruto_kg: number;
  retazo_esperado_descripcion: string | null;
  merma_esperada_porcentaje: number;
  estado_recomendacion: EstadoRecomendacion;
  creado_en: Date;
  detalles?: DetalleRecomendacion[];
}

export interface DetalleRecomendacion {
  id: string;
  recomendacion_id: string;
  material_id: string;
  material?: Material;
  porcentaje_uso_sugerido: number;
}

export interface ConsumoReal {
  id: string;
  orden_id: string;
  material_real_utilizado: string;
  peso_bruto_real_kg: number;
  chatarra_generada_kg: number;
  genero_nuevo_retazo: boolean;
  registrado_por_id: string;
  creado_en: Date;
}

export interface HistorialMovimiento {
  id: string;
  material_id: string;
  tipo_movimiento: TipoMovimiento;
  orden_id: string | null;
  registrado_por_id: string;
  fecha_movimiento: Date;
}

export interface KpisDashboard {
  mermaEvitada: number;
  ahorroEconómico: number;
  co2Evitado: number;
}

export interface DataEvolucionMerma {
  name: string;      
  chatarra: number; 
}

export interface DataAprovechamiento {
  name: string;
  valor: number;
}

export interface GraficosDashboard {
  evolucionMerma: DataEvolucionMerma[];
  aprovechamientoPorTipo: DataAprovechamiento[];
}

export interface DashboardClientProps {
  kpis: KpisDashboard;
  graficos: GraficosDashboard;
}