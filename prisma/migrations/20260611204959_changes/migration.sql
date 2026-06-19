/*
  Warnings:

  - Added the required column `ubicacion_fisica` to the `OrdenFabricacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrdenFabricacion" ADD COLUMN     "ubicacion_fisica" TEXT NOT NULL;
