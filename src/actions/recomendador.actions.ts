'use server'

import { prisma } from "@/src/lib/prisma/prisma"
import { revalidatePath } from "next/cache"

export async function generarRecomendacion(orden_id: string) {
  try {

    const recomendacionExistente = await prisma.recomendacionML.findUnique({
      where: { orden_id: orden_id },
      // OJO: Le ponemos el MISMO include gordo para que el frontend reciba
      // exactamente la misma estructura, venga de donde venga.
      include: {
        detalles: {
          include: {
            material: {
              include: { catalogo: true }
            }
          }
        }
      }
    })

    if (recomendacionExistente) {
      return { success: true, data: recomendacionExistente }
    }

    // 1. Traemos la Orden de Fabricación
    const orden = await prisma.ordenFabricacion.findUnique({
      where: { id: orden_id }
    })

    if (!orden) return { error: "Orden no encontrada." }

    // 2. Buscamos retazos disponibles del mismo material
    const retazosDisponibles = await prisma.material.findMany({
      where: {
        catalogo_id: orden.catalogo_requerido_id,
        estado_material: 'RETAZO_APROVECHABLE',
        aprovechable_ml: true
      },
      orderBy: {
        peso_kg: 'asc' // Algoritmo Greedy: Usamos los más pequeños primero
      }
    })

    // 3. Lógica del algoritmo de selección
    let pesoAcumulado = 0;
    const retazosSeleccionados = [];
    const pesoRequerido = orden.peso_estimado_kg;
    const pesoSobrante = pesoAcumulado - orden.peso_estimado_kg;

    let descripcionRetazo = "No quedarán retazos reutilizables significativos.";
    if (pesoSobrante > 0.5) {
      descripcionRetazo = `Sobrante aprox. de ${pesoSobrante.toFixed(1)} kg para el inventario.`;
    }

    for (const retazo of retazosDisponibles) {
      if (pesoAcumulado >= pesoRequerido) break; // Ya completamos el requerimiento

      retazosSeleccionados.push({
        material_id: retazo.id,
        // Si el retazo es más grande de lo que falta, sugerimos usar solo un porcentaje
        porcentaje_uso_sugerido: (pesoAcumulado + retazo.peso_kg > pesoRequerido) 
          ? ((pesoRequerido - pesoAcumulado) / retazo.peso_kg) * 100
          : 100 
      });

      pesoAcumulado += retazo.peso_kg;
    }

    // Cálculo matemático de Merma Esperada (Teórica)
    // Usamos una constante simulada del 5% para el MVP, luego el ML real lo ajustará
    const porcentajeMermaCalculado = ((pesoAcumulado - orden.peso_estimado_kg) / pesoAcumulado) * 100; 

    // 4. Guardamos la Recomendación en la Base de Datos usando transacciones
    const nuevaRecomendacion = await prisma.recomendacionML.create({
      data: {
        orden: { connect: { id: orden.id } },
        peso_teorico_bruto_kg: pesoAcumulado,
        merma_esperada_porcentaje: Number(porcentajeMermaCalculado.toFixed(1)),
        retazo_esperado_descripcion: descripcionRetazo,
        estado_recomendacion: 'SUGERIDA',
        
        detalles: {
          create: retazosSeleccionados.map(detalle => ({
            material: { connect: { id: detalle.material_id } },
            porcentaje_uso_sugerido: detalle.porcentaje_uso_sugerido
          }))
        }
      },
      include: {
        detalles: {
          include: {
            material: {
              include: {
                catalogo: true
              }
            }
          }
        }
      }
    });

    // 5. Actualizamos el estado de la Orden
    await prisma.ordenFabricacion.update({
      where: { id: orden.id },
      data: { estado_orden: 'ANALIZADA_ML' }
    });

    revalidatePath('/recommender');
    return { success: true, data: nuevaRecomendacion };

  } catch (error) {
    console.error("Error en el recomendador:", error);
    return { error: "Fallo al generar la recomendación inteligente." };
  }
}

export async function aprobarRecomendacion(orden_id: string, recomendacion_id: string) {
  try {
    // Usamos una Transacción simple: o se actualizan ambas cosas, o ninguna.
    await prisma.$transaction([
      // 1. Pasamos la Orden a Producción
      prisma.ordenFabricacion.update({
        where: { id: orden_id },
        data: { estado_orden: 'EN_PRODUCCION' }
      }),
      // 2. Marcamos la Recomendación como Aprobada
      prisma.recomendacionML.update({
        where: { id: recomendacion_id },
        data: { estado_recomendacion: 'APROBADA' }
      })
    ])

    revalidatePath('/recommender')
    revalidatePath('/orders')
    
    return { success: true }
  } catch (error) {
    console.error("Error al aprobar:", error)
    return { error: "No se pudo aprobar la recomendación." }
  }
}

export async function ObtenerRecomendaciones() {
  try {
    const recomendaciones = await prisma.recomendacionML.findMany({
      orderBy: {creado_en: 'desc'},
      include: {
        detalles: {
          include: {
            material: {
              include: {
                catalogo: true
              }
            }
          }
        }
      }
    })
    return {success: true, data: recomendaciones}
  } catch (error) {
     return {success: false, error: 'Error al cargar las ordenes de fabricacion'}
  }
}