'use client'

import { useState } from "react"
import { Scale, Save, Zap, Target } from 'lucide-react'
import { OrdenFabricacion, RecomendacionML } from "@/src/types"
import { registrarConsumoReal } from "@/src/actions/consumo.actions"

interface Props {
  ordenes: OrdenFabricacion[]
  recomendaciones: RecomendacionML[]
}


export default function Consumption({ordenes, recomendaciones}:Props) {
  const ordenesPendientes = ordenes.filter((orden) => orden.estado_orden === 'EN_PRODUCCION' )
  const [isSaved, setIsSaved] = useState(false)
  const [recomendacion, SetRecomendacion] = useState<RecomendacionML>()
  const [ordenIdSeleccionada, setOrdenIdSeleccionada] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mostrarInputRetazo ,setMostrarInputRetazo] = useState(Boolean)

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('orden_id', ordenIdSeleccionada)
    const result = await registrarConsumoReal(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
    }    
  }

  const CargarDatos = () => {
    const recomendacionSeleccionada = recomendaciones.find((reco) => reco.orden_id === ordenIdSeleccionada)
    SetRecomendacion(recomendacionSeleccionada)
  }

  return (
     <div className="p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center mb-2">
          <Scale className="w-8 h-8 text-slate-700 mr-3" />
          Consumo Real y Merma
        </h1>
        <p className="text-slate-500 mb-8">
          Formulario para registrar el consumo post-fabricación y comparar la métrica real frente a la recomendación del algoritmo.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 p-6 flex flex-col md:flex-row gap-6 md:items-center bg-slate-50">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-800 mb-1">Buscar Orden en Producción</label>
            <div className="flex gap-2">
              <select value={ordenIdSeleccionada} onChange={(e) => setOrdenIdSeleccionada(e.target.value)} className="flex-1 border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white">
                <option value="">Selecciona la orden completada...</option>
                {ordenesPendientes.map((orden)=>(
                  <option key={orden.id} value={orden.id}>{orden.codigo_interno}({orden.catalogo_requerido?.nombre})</option>
                ))}
              </select>
              <button onClick={CargarDatos} className="bg-slate-800 text-white px-4 rounded-md font-medium hover:bg-slate-900 transition-colors">
                Cargar Datos
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            
            {/* Divisor vertical */}
            <div className="hidden md:flex absolute inset-y-0 left-1/2 items-center justify-center -translate-x-1/2 z-10 w-8">
              <div className="h-full w-px bg-slate-200 absolute"></div>
              <div className="bg-white rounded-full p-1 border border-slate-200 shadow-sm z-10 text-slate-400">
                <Target className="w-5 h-5" />
              </div>
            </div>

            {/* Left side: ML Recommendation (Read Only) */}
            <div className="space-y-6">
              <div className="flex items-center text-blue-600 mb-2">
                <Zap className="w-5 h-5 mr-2" />
                <h3 className="font-bold text-lg text-slate-800">Cálculo Recomendado (ML)</h3>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Material Sugerido Usado</label>
                  <p className="text-slate-800 font-medium bg-white p-2 border border-slate-200 rounded">
                    {recomendacion?.detalles?.map((reco)=>(
                      <span key={reco.id}>{reco.material?.catalogo?.nombre}</span>
                    ))}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Peso Teórico Bruto</label>
                  <p className="text-slate-800 font-medium bg-white p-2 border border-slate-200 rounded font-mono">
                    {recomendacion?.peso_teorico_bruto_kg} kg
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Merma Esperada (%)</label>
                  <p className="text-slate-800 font-medium bg-white p-2 border border-slate-200 rounded font-mono ">
                    {recomendacion?.merma_esperada_porcentaje}%
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Retazos Restantes al Inventario</label>
                  <p className="text-slate-800 font-medium bg-white p-2 border border-slate-200 rounded text-sm">
                    {recomendacion?.retazo_esperado_descripcion}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Real Input Form */}
            <div className="space-y-6">
              <div className="flex items-center text-slate-800 mb-2">
                <Scale className="w-5 h-5 mr-2 text-slate-500" />
                <h3 className="font-bold text-lg text-slate-800">Consumo Real Operativo</h3>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-blue-100 shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Material Real Utilizado <span className="text-red-500">*</span></label>
                  <input name="material_real_utilizado" type="text" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" required />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Peso Bruto Real Usado (kg) <span className="text-red-500">*</span></label>
                  <input name="peso_bruto_real_kg" type="number" step="0.1" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none font-mono" placeholder="ej. 66.5" required />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Chatarra/Merma Generada (kg) <span className="text-red-500">*</span></label>
                  <input name="chatarra_generada_kg" type="number" step="0.1" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none font-mono" placeholder="ej. 3.2" required />
                  <p className="text-xs text-slate-500 mt-1">Material residual NO aprovechable.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Registrar Nuevo Retazo (Opcional)</label>
                  <div className="flex items-center space-x-2">
                    <input name="genero_nuevo_retazo" type="checkbox" onChange={(e) => setMostrarInputRetazo(e.target.checked)} id="hasScrap" className="rounded text-blue-600 w-4 h-4" />
                    <label htmlFor="hasScrap" className="text-sm text-slate-600">Sobró retazo útil para el inventario</label>
                  </div>
                  {mostrarInputRetazo && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                        Peso Exacto del Nuevo Retazo (kg) *
                      </label>
                      <input
                        type="number"
                        name="peso_nuevo_retazo"
                        step="0.01"
                        min="0.1"
                        placeholder="ej. 35.5"
                        className="w-full border border-slate-300 rounded p-2 focus:ring-blue-500 focus:outline-none"
                        required={mostrarInputRetazo}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              {isSaved && (
                <span className="text-green-600 font-medium flex items-center bg-green-50 px-3 py-1 rounded-md">
                  ¡Datos registrados y KPIs actualizados!
                </span>
              )}
            </div>
            <button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-md shadow-md flex items-center justify-center transition-colors">
              <Save className="w-5 h-5 mr-2" />
              Guardar Reporte Real
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
