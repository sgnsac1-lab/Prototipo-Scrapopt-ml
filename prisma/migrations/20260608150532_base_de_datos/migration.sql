-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMINISTRADOR', 'GERENTE', 'JEFE_PRODUCCION', 'ALMACEN', 'OPERARIO', 'AMBIENTAL');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "FamiliaPerfil" AS ENUM ('PLANCHA', 'TUBO', 'ANGULO', 'BARRA', 'PERFIL_I', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoMaterial" AS ENUM ('NUEVO', 'RETAZO_APROVECHABLE', 'MERMA_CHATARRA');

-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('PENDIENTE', 'ANALIZADA_ML', 'EN_PRODUCCION', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "EstadoRecomendacion" AS ENUM ('SUGERIDA', 'APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('INGRESO_COMPRA', 'SALIDA_PRODUCCION', 'INGRESO_RETAZO_SOBRANTE', 'BAJA_CHATARRA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'OPERARIO',
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'ACTIVO',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogoMaterial" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "familia_perfil" "FamiliaPerfil" NOT NULL DEFAULT 'OTRO',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogoMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "catalogo_id" TEXT NOT NULL,
    "espesor_mm" DOUBLE PRECISION,
    "ancho_mm" DOUBLE PRECISION,
    "largo_mm" DOUBLE PRECISION,
    "peso_kg" DOUBLE PRECISION NOT NULL,
    "ubicacion" TEXT,
    "estado_material" "EstadoMaterial" NOT NULL DEFAULT 'NUEVO',
    "aprovechable_ml" BOOLEAN NOT NULL DEFAULT true,
    "costo_estimado_kg" DOUBLE PRECISION NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenFabricacion" (
    "id" TEXT NOT NULL,
    "cliente_proyecto" TEXT NOT NULL,
    "descripcion" TEXT,
    "catalogo_requerido_id" TEXT NOT NULL,
    "peso_estimado_kg" DOUBLE PRECISION NOT NULL,
    "fecha_entrega" TIMESTAMP(3) NOT NULL,
    "estado_orden" "EstadoOrden" NOT NULL DEFAULT 'PENDIENTE',
    "creado_por_id" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdenFabricacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecomendacionML" (
    "id" TEXT NOT NULL,
    "orden_id" TEXT NOT NULL,
    "peso_teorico_bruto_kg" DOUBLE PRECISION NOT NULL,
    "merma_esperada_porcentaje" DOUBLE PRECISION NOT NULL,
    "estado_recomendacion" "EstadoRecomendacion" NOT NULL DEFAULT 'SUGERIDA',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecomendacionML_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleRecomendacion" (
    "id" TEXT NOT NULL,
    "recomendacion_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "porcentaje_uso_sugerido" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleRecomendacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumoReal" (
    "id" TEXT NOT NULL,
    "orden_id" TEXT NOT NULL,
    "material_real_utilizado" TEXT NOT NULL,
    "peso_bruto_real_kg" DOUBLE PRECISION NOT NULL,
    "chatarra_generada_kg" DOUBLE PRECISION NOT NULL,
    "genero_nuevo_retazo" BOOLEAN NOT NULL DEFAULT false,
    "registrado_por_id" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsumoReal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialMovimiento" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "tipo_movimiento" "TipoMovimiento" NOT NULL,
    "orden_id" TEXT,
    "registrado_por_id" TEXT NOT NULL,
    "fecha_movimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistorialMovimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogoMaterial_nombre_key" ON "CatalogoMaterial"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "RecomendacionML_orden_id_key" ON "RecomendacionML"("orden_id");

-- CreateIndex
CREATE UNIQUE INDEX "ConsumoReal_orden_id_key" ON "ConsumoReal"("orden_id");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_catalogo_id_fkey" FOREIGN KEY ("catalogo_id") REFERENCES "CatalogoMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenFabricacion" ADD CONSTRAINT "OrdenFabricacion_catalogo_requerido_id_fkey" FOREIGN KEY ("catalogo_requerido_id") REFERENCES "CatalogoMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenFabricacion" ADD CONSTRAINT "OrdenFabricacion_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecomendacionML" ADD CONSTRAINT "RecomendacionML_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "OrdenFabricacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleRecomendacion" ADD CONSTRAINT "DetalleRecomendacion_recomendacion_id_fkey" FOREIGN KEY ("recomendacion_id") REFERENCES "RecomendacionML"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleRecomendacion" ADD CONSTRAINT "DetalleRecomendacion_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoReal" ADD CONSTRAINT "ConsumoReal_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "OrdenFabricacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoReal" ADD CONSTRAINT "ConsumoReal_registrado_por_id_fkey" FOREIGN KEY ("registrado_por_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialMovimiento" ADD CONSTRAINT "HistorialMovimiento_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialMovimiento" ADD CONSTRAINT "HistorialMovimiento_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "OrdenFabricacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialMovimiento" ADD CONSTRAINT "HistorialMovimiento_registrado_por_id_fkey" FOREIGN KEY ("registrado_por_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
