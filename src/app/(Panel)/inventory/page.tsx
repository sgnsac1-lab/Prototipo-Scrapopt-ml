import Inventario from "./Inventario"
import { ObtenerInventario } from "@/src/actions/inventario.actions"
import { ObtenerCatalogos } from "@/src/actions/catalogo.actions"

export default async function page() {
  const [InventarioResponse, CatalogoResponse] = await Promise.all([
    ObtenerInventario(),
    ObtenerCatalogos()
  ])
  if(!InventarioResponse.success || !CatalogoResponse.success){
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          <h2 className="font-bold text-lg mb-1">Error de conexión</h2>
        </div>
      </div>
    )
  }

  const listaMateriales = InventarioResponse.data || []
  const listCatalogo = CatalogoResponse.data || []
  
  return <Inventario materialesIniciales={listaMateriales} catalogo={listCatalogo} />
}
