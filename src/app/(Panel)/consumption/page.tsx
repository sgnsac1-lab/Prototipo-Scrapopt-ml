import Consumption from "./Consumption"
import { ObtenerOrdenes } from "@/src/actions/ordenes.actions"
import { ObtenerRecomendaciones } from "@/src/actions/recomendador.actions"

export default async function page() {
  
    const [dataOrdenes, dataRecomendaciones] = await Promise.all([
      ObtenerOrdenes(),
      ObtenerRecomendaciones()
    ])
    if(!dataOrdenes.success || !dataRecomendaciones.success){
      return (
        <div className="p-8 max-w-7xl mx-auto">
          <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
            <h2 className="font-bold text-lg mb-1">Error de conexión</h2>
          </div>
        </div>
      )
    }
    const listaOrdenes = dataOrdenes.data || []
    const listaRecomendaciones = dataRecomendaciones.data || []

  return <Consumption ordenes={listaOrdenes} recomendaciones={listaRecomendaciones} />
}
