'use client'

import { Factory, Lock, Mail, ArrowRight } from 'lucide-react'
import { loginAction } from '../actions/LoginAction'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    try {
      const response = await loginAction(formData)
      if (response?.error) {
        setError(response.error)
      }else{
        router.push('/dashboard')
      }
    } catch (error) {
      setError("Ocurrió un error inesperado. Intenta de nuevo.")
    }
  }

  return (
    <section>
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        {/* Elementos decorativos de fondo para un look más "industrial/tecnológico" */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-25%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]"></div>
          <div className="absolute top-[60%] right-[-10%] w-[40%] h-[60%] rounded-full bg-green-900/20 blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl relative z-10 overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex justify-center mb-8">
              <div className="bg-slate-900 p-3 rounded-xl shadow-lg border border-slate-700">
                <Factory className="w-10 h-10 text-green-400" />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ScrapOpt-ML</h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">Dashboard Inteligente de Optimización</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo Electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name='email'
                    type="email"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 text-sm transition-colors"
                    placeholder="ej. admin@scrapopt.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-500 font-medium">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name='password'
                    type="password"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 text-sm transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-md flex items-center justify-center transition-all bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Iniciar Sesión
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </form>
            
            <div className="mt-8 text-center bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Credenciales de prueba MVP:</p>
              <p className="text-xs font-mono font-medium text-slate-700">ANROTEC@fstnegocios.com || Prueba2026</p>
            </div>
            <a
                href='https://docs.google.com/document/d/1QBmzZv0q1yGFjhfNX0DMTqxhqSHanUNbA4L1OK18pFo/edit?usp=sharing'
                target='_blank'
                className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg shadow-md flex items-center justify-center transition-all bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Manual de usuario
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
          </div>
        </div>
      </div>
    </section>
  )
}
