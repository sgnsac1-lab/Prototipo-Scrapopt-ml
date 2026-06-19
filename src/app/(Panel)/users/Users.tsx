'use client'

import { useState } from "react"
import { mockUsers } from "@/src/types/temp/mock"
import { Search, Plus, ShieldAlert, MoreVertical, Shield } from 'lucide-react'
import Modal from "@/src/components/ui/Modal"
import { RolUsuario, Usuario } from "@/src/types"
import { registrarUsuarioAdmin } from "@/src/actions/usuarios.actions"

interface RoleOption {
  value: RolUsuario | string
  label: string;             
  description: string;        
}
interface Props {
    usuarios: Usuario[]
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'ADMINISTRADOR', 
    label: 'Administrador del sistema',
    description: 'Acceso total. Crear usuarios, asignar permisos, configurar parámetros generales.'
  },
  {
    value: 'GERENTE',
    label: 'Gerente / Dirección',
    description: 'Consulta ejecutiva. Revisar indicadores, reportes de ahorro e impacto ambiental.'
  },
  {
    value: 'JEFE_PRODUCCION',
    label: 'Jefe de Producción',
    description: 'Acceso operativo avanzado. Registrar órdenes, revisar recomendaciones ML, aprobar cortes.'
  },
  {
    value: 'ENCARGADO_ALMACEN',
    label: 'Encargado de Almacén',
    description: 'Acceso operativo. Registrar ingresos, salidas, retazos y ubicación de inventario.'
  },
  {
    value: 'OPERARIO',
    label: 'Operario / Técnico de Taller',
    description: 'Acceso limitado. Consultar instrucciones de uso material, registrar consumo real.'
  },
  {
    value: 'RESPONSABLE_CALIDAD',
    label: 'Responsable Ambiental / Calidad',
    description: 'Consulta especializada. Validar datos, revisar reportes de emisiones evitadas.'
  }
]

export default function Users({usuarios}:Props) {
    const [searchTerm, setSearchTerm] = useState('')
      const [isModalOpen, setIsModalOpen] = useState(false)
      const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null)
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState<string | null>(null)
    
      const filteredUsers = mockUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
      const handleAddUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                setLoading(true)
                setError(null)
          
                const formData = new FormData(e.currentTarget)
                const result = await registrarUsuarioAdmin(formData)
          
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
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h1>
              <p className="text-slate-500 mt-1">Administración de accesos, roles y permisos de la plataforma.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Usuario
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
                  placeholder="Buscar por nombre, correo o rol..."
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
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Rol y Acceso</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {usuarios.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-700 font-bold border border-blue-200">
                            {user.nombre_completo.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{user.nombre_completo}</div>
                            <div className="text-slate-500 text-xs flex items-center">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center mb-1">
                          {user.rol === 'ADMINISTRADOR' ? (
                            <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                          ) : (
                            <Shield className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                          )}
                          <span className={`font-medium ${user.rol === 'ADMINISTRADOR' ? 'text-purple-700' : 'text-slate-700'}`}>
                            {user.rol}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 max-w-xs truncate">
                          {/*ROLE_OPTIONS[user.role]*/}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-slate-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
    
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nuevo Usuario">
            <form className="space-y-4" onSubmit={handleAddUsuario}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                  <input type="text" name="nombre_completo" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="ej. Juan Pérez" required />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <input type="email" name="email" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="jperez@scrapopt.com" required />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Temporal</label>
                  <input type="password" name="password" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="••••••••" required />
                  <p className="text-xs text-slate-500 mt-1">El usuario deberá cambiar su contraseña al iniciar sesión por primera vez.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rol en la Plataforma</label>
                  <select 
                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" 
                    value={selectedRole?.value}
                    name="rol"
                    onChange={(e) => {const rolEncontrado = ROLE_OPTIONS.find(opt => opt.value === e.target.value);setSelectedRole(rolEncontrado || null); }}
                    required
                  >
                    {ROLE_OPTIONS.map((rol) => (
                      <option key={rol.value} value={rol.value}>
                        {rol.label}
                      </option>
                    ))}
                  </select>
                </div>
    
                {/* Hint Box for Role Description */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Permisos de este rol</h4>
                  <p className="text-sm text-blue-700">
                    {selectedRole?.description}
                  </p>
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado de la cuenta</label>
                  <select name="estado" className="w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none">
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-md transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors">
                  Crear Usuario
                </button>
              </div>
            </form>
          </Modal>
    </div>
  )
}
