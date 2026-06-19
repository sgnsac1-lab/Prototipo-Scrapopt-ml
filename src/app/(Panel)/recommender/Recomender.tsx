'use client'

import { useState } from "react"
import { Lightbulb, CheckCircle2, Zap, Save, LayoutTemplate } from 'lucide-react'
import { OrdenFabricacion, RecomendacionML } from "@/src/types"
import { generarRecomendacion, aprobarRecomendacion } from "@/src/actions/recomendador.actions"
import RecomendacionCard from "@/src/components/ui/RecomendacionCard"

interface Props {
  ordenes: OrdenFabricacion[]
}

export default function Recomender({ordenes}: Props) {
    const ordenesPendientes = ordenes.filter((orden) => orden.estado_orden === 'PENDIENTE' || orden.estado_orden === 'ANALIZADA_ML' )
    const [selectedOrderId, setSelectedOrderId] = useState<string>('')
    const [orden, setOrden] = useState<OrdenFabricacion>()
    const [recomendacion, setRecomendacion] = useState<RecomendacionML | null>(null)

    const CrearRecomendacion = async(orden:OrdenFabricacion) => {
      setOrden(orden)
      setSelectedOrderId(orden.id)
      const response = await generarRecomendacion(orden.id)
      console.log(response)
      setRecomendacion(response.data || null)
    }
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
          <Zap className="w-8 h-8 text-amber-500 mr-3" fill="currentColor" />
          Recomendador Inteligente
        </h1>
        <p className="text-slate-500 mt-1 mb-8">
          El sistema analiza las órdenes de fabricación y busca retazos aprovechables en el inventario antes de sugerir cortar material nuevo.
        </p>
      </div>

      <div className="flex gap-8 flex-1 min-h-0">
        {/* Left column: Orders List */}
        <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
            <h2 className="font-bold text-slate-800">Órdenes Pendientes</h2>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {ordenesPendientes.map(order => (
              <div 
                key={order.id}
                onClick={() => CrearRecomendacion(order)}
                className={`p-4 rounded-lg cursor-pointer border transition-all ${
                  selectedOrderId === order.id 
                    ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300' 
                    : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-slate-900">{order.codigo_interno}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">{order.creado_en.toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-700 font-medium line-clamp-1 mb-1">{order.descripcion}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-slate-500">{order.catalogo_requerido?.nombre}</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{order.peso_estimado_kg} kg req.</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Recommendation Card */}
        <div className="w-2/3 flex flex-col h-full">
          {recomendacion && orden ? (
            <RecomendacionCard orden={orden} recomendacion={recomendacion} onAprobar={()=>aprobarRecomendacion(orden.id,recomendacion.id)} />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col items-center justify-center text-slate-400">
              <Lightbulb className="w-16 h-16 mb-4 text-slate-300" />
              <p className="text-lg">Selecciona una orden para ver recomendaciones.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
