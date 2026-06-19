import Users from "./Users"
import { ObtenerUsuarios } from "@/src/actions/usuarios.actions"

export default async function page() {
  const response = await ObtenerUsuarios()
  if (!response.success) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          <h2 className="font-bold text-lg mb-1">Error de conexión</h2>
          <p>{response.error}</p>
        </div>
      </div>
    )
  }
  const listaUsuarios = response.data || []

  return <Users usuarios={listaUsuarios} />
}
