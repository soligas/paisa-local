
import { PlaceData } from "../types";
import { localData } from "../data";

/**
 * DATOS MAESTROS (LOGÍSTICA DE ANTIOQUIA)
 * Estos datos viven en el Edge. Si necesitas cambiar un precio rápido,
 * puedes usar las variables de entorno en Vercel.
 */
const DEFAULT_LOGISTICS: Record<string, { terminal: string, avgPrice: number, time: string }> = {
  'Oriente': { terminal: 'Norte', avgPrice: 18000, time: '1.5h' },
  'Suroeste': { terminal: 'Sur', avgPrice: 32000, time: '3h' },
  'Occidente': { terminal: 'Norte', avgPrice: 15000, time: '1.5h' },
  'Norte': { terminal: 'Norte', avgPrice: 25000, time: '2.5h' },
  'Valle de Aburrá': { terminal: 'Norte/Sur', avgPrice: 3000, time: '0.5h' },
  'Urabá': { terminal: 'Norte', avgPrice: 85000, time: '8h' },
  'Magdalena Medio': { terminal: 'Norte', avgPrice: 45000, time: '4h' },
  'Nordeste': { terminal: 'Norte', avgPrice: 38000, time: '4h' },
  'Bajo Cauca': { terminal: 'Norte', avgPrice: 65000, time: '6h' }
};

export function getQuickLogistics(region: string) {
  // En Vercel, podrías inyectar esto vía process.env.LOGISTICS_DATA
  return DEFAULT_LOGISTICS[region] || { terminal: 'Norte', avgPrice: 25000, time: '3h' };
}

export function getLocalPlace(query: string): PlaceData | null {
  const normalized = query.toLowerCase().trim();
  
  // Búsqueda ultra-rápida por coincidencia de nombre
  const found = Object.values(localData).find(p => 
    p.titulo.toLowerCase().includes(normalized) || 
    normalized.includes(p.titulo.toLowerCase())
  );
  
  if (found) {
    const logistics = getQuickLogistics(found.region);
    return { 
      ...found, 
      type: 'place',
      // Fusionamos con los datos maestros más recientes
      budget: {
        busTicket: logistics.avgPrice,
        averageMeal: found.budget?.averageMeal || 25000
      },
      terminalInfo: `Terminal del ${logistics.terminal}`
    };
  }
  
  return null;
}
