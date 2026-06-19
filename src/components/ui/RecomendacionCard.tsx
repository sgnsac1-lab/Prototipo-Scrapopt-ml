import { OrdenFabricacion, RecomendacionML } from "@/src/types"
import { CheckCircle2, LayoutTemplate, Lightbulb, Save } from "lucide-react";

interface Props {
  orden: OrdenFabricacion;
  recomendacion: RecomendacionML;
  onAprobar: ()=> void;
}

export default function RecomendacionCard({ recomendacion, orden, onAprobar }: Props) {
  
  // 1. Extraemos la info para el texto principal
  const cantidadRetazos = recomendacion.detalles?.length;
  
  // Mapeamos los códigos (ej. ["MAT-002", "MAT-008"]) y los unimos con " y "
  const codigosMateriales = recomendacion.detalles?.map(d => d.material?.catalogo?.nombre || d.material?.id.slice(0,8)).join(' y ');

  // 2. Lógica del mensaje dinámico (como en tu captura)
  let mensajePlanCorte = "";
  if (cantidadRetazos! > 1) {
    mensajePlanCorte = `Combinando retazos ${codigosMateriales} se cubre el área necesaria para ${orden.descripcion || 'el proyecto'} con un algoritmo de anidamiento óptimo. Evita desperdiciar material nuevo.`;
  } else if (cantidadRetazos === 1) {
    mensajePlanCorte = `Utilizando el retazo ${codigosMateriales} se cubre el área necesaria. Evita desperdiciar material nuevo.`;
  } else {
    mensajePlanCorte = `No se encontraron retazos suficientes. Se sugiere utilizar material nuevo del catálogo.`;
  }

  // 3. Matemática para el mensaje de "Uso de material nuevo EVITADO"
  // Asumimos que usar una plancha virgen genera un 25% de merma estándar.
  const mermaPlanchaVirgen = 25.0; 
  const mermaLograda = recomendacion.merma_esperada_porcentaje; // ej: 4.2%
  
  // Calculamos cuánto redujo (Ej: de 25% a 4.2% es una reducción del ~83%)
  const reduccionMerma = ((mermaPlanchaVirgen - mermaLograda) / mermaPlanchaVirgen) * 100;

  return (
    <div className="bg-white rounded-xl border-2 border-green-500 shadow-lg flex flex-col h-full overflow-hidden relative">
              {/* Ribbon */}
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center tracking-wider">
                <Lightbulb className="w-3 h-3 mr-1" /> CORE ML ACTIVO
              </div>
              
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center text-green-600 mb-2">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm tracking-wide uppercase">Recomendación Óptima Encontrada</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Plan de Corte para {orden.codigo_interno}</h2>
                <p className="text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 text-sm leading-relaxed">
                  {mensajePlanCorte}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                  <LayoutTemplate className="w-5 h-5 mr-2 text-blue-500" />
                  Materiales Sugeridos del Inventario
                </h3>
                
                <div className="space-y-4">
                  {recomendacion.detalles?.map((item, idx) => (
                    <div key={item.material?.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-4">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-bold text-slate-900 mr-2">{item.material?.codigo_interno}</span>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">{item.material?.estado_material}</span>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            {item.material?.catalogo?.nombre} • {item.material?.espesor_mm}mm • {item.material?.ancho_mm}x{item.material?.largo_mm}mm
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-slate-500 mb-1">Uso Sugerido</div>
                        <div className="flex items-center justify-end">
                          <div className="w-32 bg-slate-200 rounded-full h-2.5 mr-2">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.porcentaje_uso_sugerido}%` }}></div>
                          </div>
                          <span className="font-mono font-bold text-slate-800 text-sm">{item.porcentaje_uso_sugerido.toFixed(0)}%</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Ubicación: <span className="font-medium text-slate-600">{item.material?.ubicacion}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Predicted Waste */}
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-green-900 uppercase text-xs tracking-wider mb-1">Merma Esperada</h4>
                    <span className="text-3xl font-black text-green-700">{mermaLograda}%</span>
                  </div>
                  <div className="text-right max-w-xs">
                    <p className="text-sm text-green-800 font-medium">Uso de material nuevo EVITADO.</p>
                    <p className="text-xs text-green-600 mt-1">Este plan de corte reduce la merma en un {reduccionMerma.toFixed(0)}% comparado con usar una plancha virgen.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
                <button className="flex items-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium px-4 py-2 rounded-md transition-colors mr-3">
                  Ver Diagrama de Anidamiento
                </button>
                <button onClick={onAprobar} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-sm transition-colors">
                  <Save className="w-4 h-4 mr-2" />
                  Aprobar Recomendación
                </button>
              </div>
            </div>
    
  )
}