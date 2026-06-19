'use server'

import { prisma } from "../lib/prisma/prisma"
import { revalidatePath } from "next/cache"
import { FamiliaPerfil } from "../generated/prisma/enums"
import { generarSiguienteCodigo } from "../utils/GeneradorCodigos"
import { error } from "console"

export async function ObtenerCatalogos(){
    try {
        const catalogos = await prisma.catalogoMaterial.findMany({
            orderBy: {creado_en: 'desc'}
        })
        return {success: true, data: catalogos}
    } catch (error) {
        return { success: false, error: "Error al cargar el catalogo de materiales"}
    }
}

export async function CrearCatalogo(formData: FormData){
    const nombre = formData.get('nombre') as string
    const familia_perfil = formData.get('familia_perfil') as FamiliaPerfil

    if(!nombre || !familia_perfil){
        return {error: 'Todos los campos son obligatorios'}
    }

    try {
        const nuevoCodigo = await generarSiguienteCodigo('CATALOGO')
        await prisma.catalogoMaterial.create({
            data:{
                codigo_interno: nuevoCodigo,
                nombre,
                familia_perfil
            }
        })
        revalidatePath('/catalog')
        return {success: true}
    } catch (error: any) {
        if (error.code === 'P2002') {
        return { error: "Ya existe un material con este nombre en el catálogo." }
        }
        return { error: "Ocurrió un error al guardar el material." }
    }
}