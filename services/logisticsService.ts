
import { PlaceData } from "../types";
import { localData } from "../data";

export const normalizeText = (str: string) => 
  str.normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")
     .toLowerCase()
     .trim();

export const MUNICIPIOS_ANTIOQUIA = [
  "Abejorral", "Abriaqui", "Alejandria", "Amaga", "Amalfi", "Andes", "Angelopolis", "Angostura", "Anori", "Anza", "Apartado", "Arboletes", "Argelia", "Armenia", "Barbosa", "Belmira", "Bello", "Betania", "Betulia", "Briceño", "Buritica", "Caicedo", "Caldas", "Campamento", "Cañasgordas", "Caracoli", "Caramanta", "Carepa", "El Carmen de Viboral", "Carolina del Principe", "Caucasia", "Chigorodo", "Cisneros", "Ciudad Bolivar", "Cocorna", "Concepcion", "Concordia", "Copacabana", "Dabeiba", "Donmatias", "Ebejico", "El Bagre", "El Peñol", "El Retiro", "El Santuario", "Entrerrios", "Envigado", "Frontino", "Fredonia", "Giraldo", "Girardota", "Gomez Plata", "Granada", "Guadalupe", "Guarne", "Guatape", "Heliconia", "Hispania", "Itagui", "Ituango", "Jardin", "Jerico", "La Ceja", "La Estrella", "La Pintada", "La Union", "Liborina", "Maceo", "Marinilla", "Medellin", "Montebello", "Murindo", "Mutata", "Nariño", "Nechi", "Necocli", "Olaya", "Peque", "Pueblorrico", "Puerto Berrio", "Puerto Nare", "Puerto Triunfo", "Remedios", "Rionegro", "Sabanalarga", "Sabaneta", "Salgar", "San Andres de Cuerquia", "San Carlos", "San Francisco", "San Jeronimo", "San Jose de la Montaña", "San Juan de Uraba", "San Luis", "San Pedro de los Milagros", "San Pedro de Uraba", "San Rafael", "San Roque", "San Vicente Ferrer", "Santa Barbara", "Santa Fe de Antioquia", "Santa Rosa de Osos", "Santo Domingo", "Segovia", "Sonson", "Sopetran", "Tamesis", "Taraza", "Tarso", "Titiribi", "Toledo", "Turbo", "Uramita", "Urrao", "Valdivia", "Valparaiso", "Vegachi", "Venecia", "Vigia del Fuerte", "Yali", "Yarumal", "Yolombo", "Yondo", "Zaragoza"
];

const DEFAULT_LOGISTICS: Record<string, { terminal: string, avgPrice: number, time: string, frequency: string, companies: string[] }> = {
  'Oriente': { terminal: 'Norte', avgPrice: 18000, time: '1.5h', frequency: 'Cada 15 min', companies: ['Sotra San Vicente', 'Transunidos', 'Sotrasantafe'] },
  'Suroeste': { terminal: 'Sur', avgPrice: 32000, time: '3h', frequency: 'Cada 30 - 45 min', companies: ['Transportes Suroeste', 'Rápido Ochoa', 'Cootransandina'] },
  'Occidente': { terminal: 'Norte', avgPrice: 15000, time: '1.5h', frequency: 'Cada 20 min', companies: ['Sotrasur', 'Gomez Hernandez'] },
  'Norte': { terminal: 'Norte', avgPrice: 25000, time: '2.5h', frequency: 'Cada 45 min', companies: ['Sotraurabá', 'Expreso Brasilia'] },
  'Valle de Aburrá': { terminal: 'Norte/Sur', avgPrice: 3000, time: '0.5h', frequency: 'Cada 5 min', companies: ['Metro de Medellín', 'Cootrans'] },
  'Urabá': { terminal: 'Norte', avgPrice: 85000, time: '8h', frequency: '3 al día', companies: ['Sotraurabá', 'Rápido Ochoa'] },
  'Magdalena Medio': { terminal: 'Norte', avgPrice: 45000, time: '4h', frequency: 'Cada hora', companies: ['Coonorte', 'Brasilia'] },
  'Nordeste': { terminal: 'Norte', avgPrice: 38000, time: '4h', frequency: 'Cada hora', companies: ['Coonorte'] },
  'Bajo Cauca': { terminal: 'Norte', avgPrice: 65000, time: '6h', frequency: 'Cada hora', companies: ['Coonorte', 'Brasilia'] }
};

export function getQuickLogistics(region: string) {
  return DEFAULT_LOGISTICS[region] || { terminal: 'Norte', avgPrice: 25000, time: '3h', frequency: 'Frecuente', companies: ['Varios'] };
}

export function getLocalSuggestions(query: string): string[] {
  const q = normalizeText(query);
  if (!q || q.length < 2) return [];

  // Combinar localData con la lista maestra de municipios
  const allNames = Array.from(new Set([
    ...Object.values(localData).map(p => p.titulo),
    ...MUNICIPIOS_ANTIOQUIA
  ]));

  return allNames
    .filter(name => normalizeText(name).includes(q))
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 8);
}

export function getLocalPlace(query: string): PlaceData | null {
  const q = normalizeText(query);
  if (!q || q.length < 2) return null;

  let foundKey = Object.keys(localData).find(key => normalizeText(key) === q);
  if (!foundKey) {
    foundKey = Object.keys(localData).find(key => normalizeText(localData[key].titulo) === q);
  }
  if (!foundKey) {
    foundKey = Object.keys(localData).find(key => {
      const tituloNorm = normalizeText(localData[key].titulo);
      return tituloNorm.includes(q) || q.includes(tituloNorm);
    });
  }
  
  if (foundKey) {
    const found = localData[foundKey];
    const logistics = getQuickLogistics(found.region);
    
    return { 
      ...found, 
      type: 'place',
      nomadScore: found.nomadScore || (found.region === 'Oriente' ? 95 : found.region === 'Valle de Aburrá' ? 99 : 75),
      wifiQuality: found.wifiQuality || (found.region === 'Oriente' || found.region === 'Valle de Aburrá' ? 'Excelente' : 'Estable'),
      busFrequency: logistics.frequency,
      busCompanies: logistics.companies,
      budget: {
        busTicket: found.budget?.busTicket || logistics.avgPrice,
        averageMeal: found.budget?.averageMeal || 25000
      },
      terminalInfo: `Terminal del ${logistics.terminal}`,
      seguridadTexto: found.seguridadTexto || "Vía reportada como segura y despejada por autoridades regionales."
    };
  }
  
  return null;
}
