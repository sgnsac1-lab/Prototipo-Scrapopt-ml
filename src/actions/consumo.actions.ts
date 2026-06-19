'use server'

import { prisma } from "@/src/lib/prisma/prisma"
import { revalidatePath } from "next/cache"
import { createClient } from "../lib/supabase/server"

export async function registrarConsumoReal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "No estás autenticado." }

  const orden_id = formData.get('orden_id') as string
  const material_real_utilizado = formData.get('material_real_utilizado') as string
  const peso_bruto_real_kg = parseFloat(formData.get('peso_bruto_real_kg') as string)
  const chatarra_generada_kg = parseFloat(formData.get('chatarra_generada_kg') as string)
  const genero_nuevo_retazo = formData.get('genero_nuevo_retazo') === 'on'

  try {
    // 🔥 EL TRUCO SENIOR: Buscamos la orden para heredar su catálogo
    const orden = await prisma.ordenFabricacion.findUnique({
      where: { id: orden_id },
      select: { catalogo_requerido_id: true } // Solo traemos el ID que nos interesa para no gastar memoria
    });

    if (!orden) return { error: "La orden seleccionada no existe." };

    const catalogo_id_heredado = orden.catalogo_requerido_id; // ¡Aquí lo tenemos!

    // MAGIA SENIOR: Transacción de Prisma
    const resultado = await prisma.$transaction(async (tx) => {
      
      // A) Creamos el registro del Consumo Real
      const nuevoConsumo = await tx.consumoReal.create({
        data: {
          orden: { connect: { id: orden_id } },
          registrado_por: { connect: { id: user.id } },
          material_real_utilizado,
          peso_bruto_real_kg,
          chatarra_generada_kg,
          genero_nuevo_retazo
        }
      })

      // B) Cerramos la Orden de Fabricación
      await tx.ordenFabricacion.update({
        where: { id: orden_id },
        data: { estado_orden: 'COMPLETADA' }
      })

      // C) Si se generó un retazo, lo "damos a luz" en el Inventario heredando el catálogo
      let nuevoRetazo = null;
      if (genero_nuevo_retazo) {
        // En tu UI no vi un input para el peso exacto del retazo, 
        // así que lo calculamos matemáticamente: Peso Bruto Usado - Chatarra - Peso de la Orden
        // (O puedes agregar un campito oculto que aparezca al hacer check en "Sobró retazo útil")
        const peso_nuevo_retazo = parseFloat(formData.get('peso_nuevo_retazo') as string) || 0; 

        nuevoRetazo = await tx.material.create({
          data: {
            catalogo: { connect: { id: catalogo_id_heredado } }, // 👈 Usamos el catálogo heredado
            peso_kg: peso_nuevo_retazo,
            estado_material: 'RETAZO_APROVECHABLE',
            aprovechable_ml: true,
            costo_estimado_kg: 0,
            ubicacion: 'Zona de Retazos'
          }
        })

        // D) Guardamos el "Voucher" en el Historial de Movimientos
        await tx.historialMovimiento.create({
          data: {
            material: { connect: { id: nuevoRetazo.id } },
            registrado_por: { connect: { id: user.id } },
            orden: { connect: { id: orden_id } },
            tipo_movimiento: 'INGRESO_RETAZO_SOBRANTE'
          }
        })
      }

      return { nuevoConsumo, nuevoRetazo }
    })

    revalidatePath('/orders') 
    revalidatePath('/inventory') 
    
    return { success: true, data: resultado }

  } catch (error) {
    console.error("Error al registrar consumo:", error)
    return { error: "Hubo un error crítico al registrar el consumo y el inventario." }
  }
}