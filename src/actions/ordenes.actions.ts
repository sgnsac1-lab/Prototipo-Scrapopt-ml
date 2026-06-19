'use server'

import { prisma } from "../lib/prisma/prisma"
import { revalidatePath } from "next/cache"
import { createClient } from "../lib/supabase/server"
import { generarSiguienteCodigo } from "../utils/GeneradorCodigos"

export async function ObtenerOrdenes(){
    try {
        const ordenes = await prisma.ordenFabricacion.findMany({
            orderBy: {creado_en: 'desc'},
            include: {
                catalogo_requerido: true
            }
        })
        return {success: true, data: ordenes}
    } catch (error) {
        return {success: false, error: 'Error al cargar las ordenes de fabricacion'}
    }
}

export async function CrearOrdenes(formData: FormData){
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: "Sesión expirada o no autorizada. Vuelve a iniciar sesión." }
    }

    const usuario_id = user.id  
    const cliente_proyecto = formData.get('cliente_proyecto') as string
    const descripcion = formData.get('descripcion') as string
    const catalogo_requerido_id = formData.get('catalogo_requerido_id') as string
    const peso_estimado_kgRAW = formData.get('peso_estimado_kg') as string
    const fecha_entregaRAW = formData.get('fecha_entrega') as string

    const peso_estimado_kg = peso_estimado_kgRAW ? parseFloat(peso_estimado_kgRAW) : 0
    const fecha_entrega = fecha_entregaRAW ? new Date(fecha_entregaRAW) : null

    if (!catalogo_requerido_id || !fecha_entrega) {
        return { error: "El catálogo, usuario y fecha de entrega son campos obligatorios." }
    }

    try {
        const nuevoCodigo = await generarSiguienteCodigo('ORDEN')
        await prisma.ordenFabricacion.create({
            data:{
                codigo_interno: nuevoCodigo,
                cliente_proyecto,
                descripcion,
                catalogo_requerido: {connect: {id: catalogo_requerido_id}},
                peso_estimado_kg,
                fecha_entrega,
                creado_por: {connect: {id: usuario_id}}
            }
        })
        revalidatePath('/orders')
        return {success: true}
    } catch (error: any) {
        if (error.code === 'P2002') {
        return { error: "Ya existe una orden en el registro." }
        }
        return { error: "Ocurrió un error al guardar la orden de fabricacion." }
    }
}