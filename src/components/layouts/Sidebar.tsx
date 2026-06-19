'use client'

import { useRouter } from 'next/navigation'
import { cerrarSesion } from '@/src/actions/logOut.actions'
import Link from 'next/link'
import { 
  Users, 
  Package, 
  ClipboardList, 
  Lightbulb, 
  Scale, 
  BarChart3,
  Factory,
  LogOut,
  Layers
} from 'lucide-react'
import { usePathname } from "next/navigation"
import { Usuario } from '@/src/types'

interface Props {
  usuario: Usuario
}

export default function Sidebar({usuario}:Props) {
    const router = useRouter()
    const pathname = usePathname()

    const navItems = [
    { href: '/dashboard', icon: <BarChart3 className="w-5 h-5" />, label: 'Reportes de Impacto' },
    { href: '/catalog', icon: <Layers className="w-5 h-5" />, label: 'Catálogo Materiales' },
    { href: '/inventory', icon: <Package className="w-5 h-5" />, label: 'Inventario Digital' },
    { href: '/orders', icon: <ClipboardList className="w-5 h-5" />, label: 'Órdenes de Fabricación' },
    { href: '/recommender', icon: <Lightbulb className="w-5 h-5" />, label: 'Recomendador Inteligente' },
    { href: '/consumption', icon: <Scale className="w-5 h-5" />, label: 'Consumo Real y Merma' },
    { href: '/users', icon: <Users className="w-5 h-5" />, label: 'Gestión de Usuarios' }, 
  ]

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col items-stretch border-r border-slate-800 shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <Factory className="w-6 h-6 text-green-500 mr-3" />
        <span className="text-white font-bold text-lg tracking-wide">ScrapOpt-ML</span>
      </div>
      
      <div className="px-6 py-4 border-b border-slate-800 shrink-0">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mi Perfil</div>
        <div className="text-slate-200 font-medium truncate">{usuario.nombre_completo}</div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
        return(
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2.5 rounded-md transition-colors duration-200 ${
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
          >
            {item.icon}
            <span className="ml-3 text-sm">{item.label}</span>
          </Link>
        )})}
      </nav>
      
      <div className="p-4 border-t border-slate-800 shrink-0">
        <div className="bg-slate-800 rounded-md p-3 mb-3">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Estado del Sistema</p>
          <div className="flex items-center">
            <span className="flex w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-slate-200 font-medium">ML Core Activo</span>
          </div>
        </div>

        <button 
          onClick={cerrarSesion}
          className="w-full flex items-center px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
