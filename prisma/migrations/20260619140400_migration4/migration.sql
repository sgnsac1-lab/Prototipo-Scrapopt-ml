/*
  Warnings:

  - A unique constraint covering the columns `[codigo_interno]` on the table `CatalogoMaterial` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo_interno]` on the table `Material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo_interno]` on the table `OrdenFabricacion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CatalogoMaterial" ADD COLUMN     "codigo_interno" TEXT;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "codigo_interno" TEXT;

-- AlterTable
ALTER TABLE "OrdenFabricacion" ADD COLUMN     "codigo_interno" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CatalogoMaterial_codigo_interno_key" ON "CatalogoMaterial"("codigo_interno");

-- CreateIndex
CREATE UNIQUE INDEX "Material_codigo_interno_key" ON "Material"("codigo_interno");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenFabricacion_codigo_interno_key" ON "OrdenFabricacion"("codigo_interno");
