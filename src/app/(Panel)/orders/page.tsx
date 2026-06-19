import Ordenes from "./Ordenes"
import { ObtenerOrdenes } from "@/src/actions/ordenes.actions"
import { ObtenerCatalogos } from "@/src/actions/catalogo.actions"

export default async function page() {
  const [OrdenesResponse, CatalogosResponse] = await Promise.all([
    ObtenerOrdenes(),
    ObtenerCatalogos()
  ])
  if(!OrdenesResponse.success || !CatalogosResponse.success){
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          <h2 className="font-bold text-lg mb-1">Error de conexión</h2>
        </div>
      </div>
    )
  }
  const listaOrdenes = OrdenesResponse.data || []
  const listaCatalogo = CatalogosResponse.data || []

  return <Ordenes ordenesFabricacion={listaOrdenes} catalogo={listaCatalogo} />
}
