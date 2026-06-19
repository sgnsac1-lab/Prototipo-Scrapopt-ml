'use server'

import { prisma } from "@/src/lib/prisma/prisma"

export async function obtenerDataDashboard() {
  try {
    const recomendacionesExitosas = await prisma.recomendacionML.findMany({
      where: { estado_recomendacion: 'APROBADA' },
      include: {
        orden: {
          include: { catalogo_requerido: true } // 👈 ¡La llave para sacar el nombre!
        }
      }
    });

    const mermaEvitadaKg = recomendacionesExitosas.reduce(
      (acc, reco) => acc + reco.peso_teorico_bruto_kg, 
      0
    );

    const agrupadoPorCatalogo = recomendacionesExitosas.reduce((acc: any, reco) => {
      // Sacamos el nombre, si por alguna razón no hay, le ponemos 'Otros'
      const nombreCatalogo = reco.orden?.catalogo_requerido?.nombre || 'Otros';
      
      if (!acc[nombreCatalogo]) acc[nombreCatalogo] = 0;
      acc[nombreCatalogo] += reco.peso_teorico_bruto_kg;
      
      return acc;
    }, {});

    // C) Formateamos para el gráfico de barras y ordenamos de mayor a menor
    const dataGraficoBarras = Object.keys(agrupadoPorCatalogo)
      .map(nombre => ({
        name: nombre,
        valor: Math.round(agrupadoPorCatalogo[nombre]) // Redondeamos para que se vea limpio
      }))
      .sort((a, b) => b.valor - a.valor);

    // Asumimos un costo promedio del acero para el MVP (Ej. $1.50 USD por kg)
    // (Luego puedes promediar el 'costo_estimado_kg' real de tus materiales)
    const costoPromedioKg = 1.50; 
    const ahorroUSD = mermaEvitadaKg * costoPromedioKg;

    // Factor de emisión estándar del acero (1.9 kg CO2 por cada 1kg de acero)
    const co2EvitadoKg = mermaEvitadaKg * 1.9;
    
    // Traemos todos los consumos para ver cuánta chatarra se generó
    const consumos = await prisma.consumoReal.findMany({
      select: { 
        creado_en: true, 
        chatarra_generada_kg: true 
      },
      orderBy: { creado_en: 'asc' }
    });

    // Agrupamos la chatarra por Mes usando JavaScript
    const evolucionMerma = consumos.reduce((acc: any, consumo) => {
      // Obtenemos el nombre del mes (ej. "Ene", "Feb")
      const mes = consumo.creado_en.toLocaleString('es-ES', { month: 'short' });
      
      if (!acc[mes]) acc[mes] = 0;
      acc[mes] += consumo.chatarra_generada_kg;
      
      return acc;
    }, {});

    const dataGraficoLinea = Object.keys(evolucionMerma).map(mes => ({
      name: mes.charAt(0).toUpperCase() + mes.slice(1), // Capitalizar
      chatarra: evolucionMerma[mes]
    }));

    return {
      success: true,
      kpis: {
        mermaEvitada: mermaEvitadaKg,
        ahorroEconómico: ahorroUSD,
        co2Evitado: co2EvitadoKg
      },
      graficos: {
        evolucionMerma: dataGraficoLinea,
        aprovechamientoPorTipo: dataGraficoBarras
      }
    };

  } catch (error) {
    console.error("Error en Dashboard:", error);
    return { error: "Fallo al cargar los datos del Dashboard." };
  }
}