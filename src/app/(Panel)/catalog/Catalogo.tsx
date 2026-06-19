'use client'

import { useState } from "react"
import { Search, Plus, Layers, MoreVertical } from 'lucide-react'
import Modal from "@/src/components/ui/Modal"
import { CatalogoMaterial } from "@/src/types"
import { CrearCatalogo } from "@/src/actions/catalogo.actions"

interface Props {
  materialesIniciales: CatalogoMaterial[]
}

export default function Catalogo({ materialesIniciales }: Props) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAddMaterial = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setLoading(true)
      setError(null)

      const formData = new FormData(e.currentTarget)
      const result = await CrearCatalogo(formData)

      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        setIsModalOpen(false) // Cerramos el modal
        setLoading(false)
      }
  }
  return (
    <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Catálogo de Materiales</h1>
              <p className="text-slate-500 mt-1">Gestión de tipos de acero, familias y perfiles disponibles en la planta.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Material
              </button>
            </div>
          </div>
    
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre o familia..."
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
    
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Nombre del Material</th>
                    <th className="px-6 py-4">Familia / Perfil</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {materialesIniciales.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                        {item.codigo_interno}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center mr-3 border border-slate-200">
                            <Layers className="h-4 w-4 text-slate-500" />
                          </div>
                          <span className="font-semibold text-slate-900">{item.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {item.familia_perfil}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-slate-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Tipo de Material">
            <form className="space-y-4" onSubmit={handleAddMaterial}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre (Tipo de acero/aleación)</label>
                  <input 
                    name="nombre"
                    type="text" 
                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" 
                    placeholder="ej. Acero Estructural A36 Modificado" 
                    required 
                  />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Familia Perfil</label>
                  <select 
                    name="familia_perfil"
                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white" 
                    required 
                  >
                    <option value="" disabled>Seleccione una familia...</option>
                    <option value="PLANCHA">Plancha</option>
                    <option value="TUBO">Tubo</option>
                    <option value="ANGULO">Ángulo</option>
                    <option value="BARRA">Barra</option>
                    <option value="PERFIL_I">Perfil I (Vigas)</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-700">
                    El material estará disponible inmediatamente en los selectores de ingreso de inventario y registro de nuevas órdenes de producción.
                  </p>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-md transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors">
                  Registrar en Catálogo
                </button>
              </div>
            </form>
          </Modal>
    </div>
  )
}
