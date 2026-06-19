'use client'

import { useState } from "react"
import { mockOrders } from "@/src/types/temp/mock"
import { Search, Plus, ClipboardList, Calendar } from 'lucide-react'
import Modal from "@/src/components/ui/Modal"
import { OrdenFabricacion } from "@/src/types"
import { CrearOrdenes } from "@/src/actions/ordenes.actions"
import { CatalogoMaterial } from "@/src/types"

interface Props {
  ordenesFabricacion: OrdenFabricacion[],
   catalogo: CatalogoMaterial[]
}

export default function Ordenes({ ordenesFabricacion, catalogo }: Props) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAddOrden = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          setLoading(true)
          setError(null)
    
          const formData = new FormData(e.currentTarget)
          const result = await CrearOrdenes(formData)
    
          if (result?.error) {
            setError(result.error)
            setLoading(false)
          } else {
            setIsModalOpen(false)
            setLoading(false)
          }
      }
  return (
    <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Órdenes de Fabricación</h1>
              <p className="text-slate-500 mt-1">Gestión de pedidos e ingreso de requerimientos de producción.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Orden
              </button>
            </div>
          </div>
    
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="relative w-full sm:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por ID u Cliente..."
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-md sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
    
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                    <th className="px-6 py-4">Orden ID</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Descripción / Material</th>
                    <th className="px-6 py-4">Peso Específico</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Fecha Creada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {ordenesFabricacion.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 border-l-4 border-transparent hover:border-blue-500">
                        <div className="flex items-center">
                          <ClipboardList className="w-4 h-4 mr-2 text-slate-400" />
                          {order.codigo_interno}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-medium">
                        {order.cliente_proyecto}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-800 font-medium">{order.descripcion}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{order.catalogo_requerido?.nombre}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">
                        {order.peso_estimado_kg.toFixed(1)} kg
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.estado_orden === 'COMPLETADA' ? 'bg-green-100 text-green-800' : 
                          order.estado_orden === 'PENDIENTE' ? 'bg-blue-100 text-blue-800' : 
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.estado_orden}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {order.creado_en.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {ordenesFabricacion.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        No se encontraron órdenes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
    
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nueva Orden">
            <form className="space-y-4" onSubmit={handleAddOrden}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente / Proyecto</label>
                  <input name="cliente_proyecto" type="text" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="Nombre de empresa cliente" required />
                </div>
    
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descripción del Pedido (Piezas a fabricar)</label>
                  <textarea name="descripcion" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-20" placeholder="ej. 5 Placas base de 600x600mm con 4 perforaciones..." required></textarea>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Material Requerido</label>
                  <select name="catalogo_requerido_id" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none">
                    {catalogo.map(c=>(
                      <option value={c.id} key={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Peso Total Estimado (kg)</label>
                  <input name="peso_estimado_kg" type="number" step="0.01" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="0.0" required />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Entrega Interna</label>
                  <input name="fecha_entrega" type="date" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" required />
                </div>
                
                <div className="col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-md mt-2 text-sm text-blue-800">
                  <strong>Nota del sistema:</strong> Al guardar, el <em>Algoritmo ML</em> automáticamente verificará el inventario en busca de retazos sugeridos para cubrir esta orden antes de enviar a corte.
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-md transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors">
                  Crear Orden y Analizar
                </button>
              </div>
            </form>
          </Modal>
    </div>
  )
}
