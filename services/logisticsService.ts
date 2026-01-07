
import { PlaceData } from "../types";
import { localData } from "../data";

// Precios base estimados por subregión (Datos Maestros rápidos)
const REGION_LOGISTICS: Record<string, { terminal: string, avgPrice: number, time: string }> = {
  'Oriente': { terminal: 'Norte', avgPrice: 18000, time: '1.5h' },
  'Suroeste': { terminal: 'Sur', avgPrice: 32000, time: '3h' },
  'Occidente': { terminal: 'Norte', avgPrice: 15000, time: '1.5h' },
  'Norte': { terminal: 'Norte', avgPrice: 25000, time: '2.5h' },
  'Valle de Aburrá': { terminal: 'Norte/Sur', avgPrice: 3000, time: '0.5h' },
  'Urabá': { terminal: 'Norte', avgPrice: 85000, time: '8h' }
};

export function getQuickLogistics(region: string) {
  return REGION_LOGISTICS[region] || { terminal: 'Norte', avgPrice: 25000, time: '3h' };
}

export function getLocalPlace(query: string): PlaceData | null {
  const normalized = query.toLowerCase().trim();
  const found = Object.values(localData).find(p => 
    p.titulo.toLowerCase().includes(normalized) || 
    normalized.includes(p.titulo.toLowerCase())
  );
  return found ? { ...found, type: 'place' } : null;
}
