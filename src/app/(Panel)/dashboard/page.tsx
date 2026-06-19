import Dashboard from "./Dashboard"
import { obtenerDataDashboard } from "@/src/actions/dashboard.actions"

export default async function page() {
  const data = await obtenerDataDashboard();

  if (data.error || !data.kpis || !data.graficos) {
    return (
      <div className="p-8 text-red-600 bg-red-50 rounded-md border border-red-200 m-6">
        <h3 className="font-bold mb-1">Error al cargar el Reporte de Impacto</h3>
        <p className="text-sm">{data.error || "Los datos del servidor llegaron incompletos."}</p>
      </div>
    );
  }
  
  return <Dashboard kpis={data.kpis} graficos={data.graficos} />
}
