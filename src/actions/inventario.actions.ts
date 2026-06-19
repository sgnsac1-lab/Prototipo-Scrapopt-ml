'use server'

import { prisma } from "../lib/prisma/prisma"
import { revalidatePath } from "next/cache"
import { EstadoMaterial } from "../types"
import { generarSiguienteCodigo } from "../utils/GeneradorCodigos"
import { error } from "console"

export async function ObtenerInventario(){
    try {
        const inventario = await prisma.material.findMany({
            orderBy: {creado_en: 'desc'},
            include:{
                catalogo:true
            }
        })
        return {success: true, data: inventario}
    } catch (error) {
        return { success: false, error: "Error al cargar el inventario de materiales"}
    }
}

export async function CrearMaterial(formData: FormData){
    const catalogo_id = formData.get('catalogo_id') as string
    const espesor_mmRAW = formData.get('espesor_mm') as string
    const ancho_mmRAW = formData.get('ancho_mm') as string
    const largo_mmRAW = formData.get('largo_mm') as string
    const peso_kgRAW = formData.get('peso_kg') as string
    const ubicacion = formData.get('ubicacion') as string
    const estado_material = formData.get('estado_material') as EstadoMaterial
    const aprovechable_ml = formData.get('aprovechable_ml') === 'on'
    const costo_estimado_kgRAW = formData.get('costo_estimado_kg') as string

    // 2. Conversiones seguras a Float
    const espesor_mm = espesor_mmRAW ? parseFloat(espesor_mmRAW) : null
    const ancho_mm = ancho_mmRAW ? parseFloat(ancho_mmRAW) : null
    const largo_mm = largo_mmRAW ? parseFloat(largo_mmRAW) : null
    
    const peso_kg = peso_kgRAW ? parseFloat(peso_kgRAW) : 0
    const costo_estimado_kg = costo_estimado_kgRAW ? parseFloat(costo_estimado_kgRAW) : 0

    if (!catalogo_id || peso_kg <= 0) {
        return { error: "El catálogo y el peso son campos obligatorios." }
    }

    try {
        const nuevoCodigo = await generarSiguienteCodigo('MATERIAL')
        await prisma.material.create({
            data:{
                codigo_interno: nuevoCodigo,
                catalogo: { connect: { id: catalogo_id } },
                espesor_mm,
                ancho_mm,
                largo_mm,
                peso_kg,
                ubicacion,
                estado_material,
                aprovechable_ml,
                costo_estimado_kg
            }
        })
        revalidatePath('/inventory')
        return {success: true}
    } catch (error: any) {
        if (error.code === 'P2002') {
        return { error: "Ya existe un material con este nombre en el catálogo." }
        }
        return { error: "Ocurrió un error al guardar el material." }
    }
}