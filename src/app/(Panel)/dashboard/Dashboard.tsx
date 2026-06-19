'use client'

import { mockKPIs } from '../../../types/temp/mock'
import { 
  TrendingDown, 
  DollarSign, 
  Leaf, 
  BarChart3,
  Calendar
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { DashboardClientProps } from '@/src/types'

const monthlyData = [
  { name: 'Ene', mermaReal: 450, mermaEstimadaSinML: 600 },
  { name: 'Feb', mermaReal: 420, mermaEstimadaSinML: 580 },
  { name: 'Mar', mermaReal: 380, mermaEstimadaSinML: 590 },
  { name: 'Abr', mermaReal: 350, mermaEstimadaSinML: 570 },
  { name: 'May', mermaReal: 310, mermaEstimadaSinML: 550 },
  { name: 'Jun', mermaReal: 290, mermaEstimadaSinML: 560 }, // Empezó ScrapOpt
  { name: 'Jul', mermaReal: 180, mermaEstimadaSinML: 540 },
  { name: 'Ago', mermaReal: 150, mermaEstimadaSinML: 530 },
  { name: 'Sep', mermaReal: 120, mermaEstimadaSinML: 550 },
  { name: 'Oct', mermaReal: 95, mermaEstimadaSinML: 540 },
];


export default function Dashboard({ kpis, graficos }: DashboardClientProps) {
    const dataGraficoCompleta = graficos.evolucionMerma.map(item => ({
        name: item.name,
        mermaReal: item.chatarra,
        mermaEstimadaSinML: Math.round(item.chatarra * 1.52) 
    }))

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reportes de Impacto</h1>
          <p className="text-slate-500 mt-1">Indicadores clave de rendimiento (KPIs) y reducción de merma.</p>
        </div>
        <div className="flex items-center text-sm text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-md shadow-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Últimos 12 meses
        </div>
      </div>

      {/* KPI Cards Dinámicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Tarjeta 1: Merma Evitada */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-start">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg mr-4">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Merma Evitada (Acero)</p>
            <h3 className="text-2xl font-bold text-slate-900">
              {kpis.mermaEvitada.toLocaleString('es-PE', { maximumFractionDigits: 1 })} kg
            </h3>
            <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
              ↓ 34.2% vs periodo anterior
            </p>
          </div>
        </div>

        {/* Tarjeta 2: Ahorro Económico */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-start">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Ahorro Económico Estimado</p>
            <h3 className="text-2xl font-bold text-slate-900">
              S/ {kpis.ahorroEconómico.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Soles
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Recuperado de retazos aprovechados
            </p>
          </div>
        </div>

        {/* Tarjeta 3: Emisiones CO2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-start">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg mr-4">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Emisiones CO₂ Evitadas</p>
            <h3 className="text-2xl font-bold text-slate-900">
              {kpis.co2Evitado.toLocaleString('es-PE', { maximumFractionDigits: 1 })} kg
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Impacto ambiental positivo
            </p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico de Evolución Temporal (Líneas Dinámicas) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Evolución de Merma de Acero (kg)</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataGraficoCompleta} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  name="Merma Real con ScrapOpt" 
                  type="monotone" 
                  dataKey="mermaReal" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  name="Estimado Sin ML" 
                  type="monotone" 
                  dataKey="mermaEstimadaSinML" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico por tipo de Material */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Aprovechamiento de Retazos por Tipo (Último Mes)</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* Nota: Mantenemos el desglose estático o mapeado de tu catálogo */}
              <BarChart data={graficos.aprovechamientoPorTipo} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 500 }} width={80} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value} kg`, 'Aprovechado']}
                />
                <Bar dataKey="valor" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}
