import { prisma } from "@/src/lib/prisma/prisma";

type TipoRegistro = 'CATALOGO' | 'MATERIAL' | 'ORDEN';

export async function generarSiguienteCodigo(tipo: TipoRegistro): Promise<string> {
  let prefijo = '';
  let ultimoRegistro = null;

  switch (tipo) {
    case 'CATALOGO':
      prefijo = 'CAT-';
      ultimoRegistro = await prisma.catalogoMaterial.findFirst({
        where: { codigo_interno: { not: null } },
        orderBy: { creado_en: 'desc' }, // Trae el último creado
      });
      break;
    case 'MATERIAL':
      prefijo = 'MAT-';
      ultimoRegistro = await prisma.material.findFirst({
        where: { codigo_interno: { not: null } },
        orderBy: { creado_en: 'desc' },
      });
      break;
    case 'ORDEN':
      prefijo = 'ORD-';
      ultimoRegistro = await prisma.ordenFabricacion.findFirst({
        where: { codigo_interno: { not: null } },
        orderBy: { creado_en: 'desc' },
      });
      break;
  }

  // Si no hay ningún registro previo, empezamos en el 001
  if (!ultimoRegistro || !ultimoRegistro.codigo_interno) {
    return `${prefijo}001`;
  }

  // Si el último fue "ORD-042", extraemos el "042" y lo pasamos a número (42)
  const numeroString = ultimoRegistro.codigo_interno.replace(prefijo, '');
  const numeroActual = parseInt(numeroString, 10);

  // Le sumamos 1 (43)
  const siguienteNumero = numeroActual + 1;

  // El padStart asegura que siempre tenga 3 dígitos (ej: "43" -> "043")
  return `${prefijo}${siguienteNumero.toString().padStart(3, '0')}`;
}