'use client'

import { useState } from "react"
import { mockMaterials } from "@/src/types/temp/mock"
import { Search, Filter, Plus, Package, MapPin } from 'lucide-react'
import Modal from "@/src/components/ui/Modal"
import { CrearMaterial } from "@/src/actions/inventario.actions"
import { Material } from "@/src/types"
import { CatalogoMaterial } from "@/src/types"

interface Props {
  materialesIniciales: Material[]
  catalogo: CatalogoMaterial[]
}

export default function Inventario({ materialesIniciales, catalogo }: Props) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAddMaterial = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          setLoading(true)
          setError(null)
    
          const formData = new FormData(e.currentTarget)
          const result = await CrearMaterial(formData)
    
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
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventario Digital</h1>
              <p className="text-slate-500 mt-1">Gestión en tiempo real de planchas nuevas, retazos y mermas.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ingresar Material
              </button>
            </div>
          </div>
    
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Controls */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
              <div className="relative w-full sm:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por ID o Tipo de Acero..."
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center text-slate-600 bg-white border border-slate-300 px-3 py-2 rounded-md hover:bg-slate-50 text-sm font-medium w-full sm:w-auto justify-center transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </button>
            </div>
    
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                    <th className="px-6 py-4">ID / Material</th>
                    <th className="px-6 py-4">Dimensiones (mm)</th>
                    <th className="px-6 py-4">Peso (kg)</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Aprovechable</th>
                    <th className="px-6 py-4">Ubicación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {materialesIniciales.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center mr-3 border border-slate-200">
                            <Package className="h-4 w-4 text-slate-500" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{item.codigo_interno}</div>
                            <div className="text-slate-500 text-xs">{item?.catalogo?.nombre}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="font-medium text-slate-800">{item.espesor_mm} Esp.</div>
                        <div className="text-xs">{item.ancho_mm} x {item.largo_mm}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">
                        {item.peso_kg.toFixed(1)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.estado_material === 'NUEVO' ? 'bg-blue-100 text-blue-800' : 
                          item.estado_material === 'RETAZO_APROVECHABLE' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.estado_material}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.estado_material !== 'NUEVO' && (
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                            item.aprovechable_ml ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {item.aprovechable_ml ? 'SÍ (ML)' : 'NO'}
                          </span>
                        )}
                        {item.estado_material === 'NUEVO' && <span className="text-slate-400 text-xs">-</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-slate-600 text-xs font-medium bg-slate-100 px-2 py-1 rounded w-max">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.ubicacion}
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {materialesIniciales.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        No se encontraron materiales que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
    
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Ingreso de Material">
            <form className="space-y-4" onSubmit={handleAddMaterial}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Material</label>
                  <select name="catalogo_id" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none">
                    {catalogo.map(c=>(
                      <option value={c.id} key={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Espesor (mm)</label>
                  <input name="espesor_mm" type="number" step="0.01" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="ej. 6.35" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <select name="estado_material" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none">
                    <option value='NUEVO'>Nuevo (Plancha Completa)</option>
                    <option value='RETAZO_APROVECHABLE'>Retazo Aprovechable</option>
                    <option value='MERMA_CHATARRA'>Merma / Chatarra</option>
                  </select>
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ancho (mm)</label>
                  <input name="ancho_mm" type="number" step="0.01" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="ej. 1220" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Largo (mm)</label>
                  <input name="largo_mm" type="number" step="0.01" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="ej. 2440" required />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Peso Constatado (kg)</label>
                  <input name="peso_kg" type="number" step="0.01" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="ej. 148.5" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Costo Estimado (S/)</label>
                  <input name="costo_estimado_kg" type="number" step="0.01" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="ej. S/125.00" required />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación Física</label>
                  <input name="ubicacion" type="text" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="ej. Zona A / Estante 3" required />
                </div>
                
                <div className="col-span-2 flex items-center space-x-2 mt-2">
                  <input name="aprovechable_ml" type="checkbox" id="markUsable" className="rounded text-blue-600 w-4 h-4 focus:ring-blue-500" defaultChecked />
                  <label htmlFor="markUsable" className="text-sm text-slate-700">Marcar como retazo aprovechable para ML</label>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-md transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors">
                  Guardar Material
                </button>
              </div>
            </form>
          </Modal>
    </div>
  )
}
