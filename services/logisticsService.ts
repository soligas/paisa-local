
import { PlaceData } from "../types";
import { localData } from "../data";

export const normalizeText = (str: string) => 
  str.normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")
     .toLowerCase()
     .trim();

export const MUNICIPIOS_ANTIOQUIA = [
  "Abejorral", "Abriaqui", "Alejandria", "Amaga", "Amalfi", "Andes", "Angelopolis", "Angostura", "Anori", "Anza", "Apartado", "Arboletes", "Argelia", "Armenia", "Barbosa", "Belmira", "Bello", "Betania", "Betulia", "Briceño", "Buritica", "Caicedo", "Caldas", "Campamento", "Cañasgordas", "Caracoli", "Caramanta", "Carepa", "El Carmen de Viboral", "Carolina del Principe", "Caucasia", "Chigorodo", "Cisneros", "Ciudad Bolivar", "Cocorna", "Concepcion", "Concordia", "Copacabana", "Dabeiba", "Donmatias", "Ebejico", "El Bagre", "El Peñol", "El Retiro", "El Santuario", "Entrerrios", "Envigado", "Frontino", "Fredonia", "Giraldo", "Girardota", "Gomez Plata", "Granada", "Guadalupe", "Guarne", "Guatape", "Heliconia", "Hispania", "Itagui", "Ituango", "Jardin", "Jerico", "La Ceja", "La Estrella", "La Pintada", "La Union", "Liborina", "Maceo", "Marinilla", "Medellín", "Montebello", "Murindo", "Mutata", "Nariño", "Nechi", "Necocli", "Olaya", "Peque", "Pueblorrico", "Puerto Berrio", "Puerto Nare", "Puerto Triunfo", "Remedios", "Rionegro", "Sabanalarga", "Sabaneta", "Salgar", "San Andres de Cuerquia", "San Carlos", "San Francisco", "San Jeronimo", "San Jose de la Montaña", "San Juan de Uraba", "San Luis", "San Pedro de los Milagros", "San Pedro de Uraba", "San Rafael", "San Roque", "San Vicente Ferrer", "Santa Barbara", "Santa Fe de Antioquia", "Santa Rosa de Osos", "Santo Domingo", "Segovia", "SSonson", "Sopetran", "Tamesis", "Taraza", "Tarso", "Titiribi", "Toledo", "Turbo", "Uramita", "Urrao", "Valdivia", "Valparaiso", "Vegachi", "Venecia", "Vigia del Fuerte", "Yali", "Yarumal", "Yolombo", "Yondo", "Zaragoza"
];

const DEFAULT_LOGISTICS: Record<string, { terminal: string, avgPrice: number, time: string, frequency: string, marketDay: string, companies: string[] }> = {
  'Oriente': { terminal: 'Norte', avgPrice: 18000, time: '1.5h', frequency: 'Cada 15-20 min', marketDay: 'Sábados y Domingos', companies: ['Sotra San Vicente', 'Transunidos', 'Sotramar'] },
  'Suroeste': { terminal: 'Sur', avgPrice: 35000, time: '3h', frequency: 'Cada 30-45 min', marketDay: 'Domingos (Día Grande)', companies: ['Transportes Suroeste', 'Rápido Ochoa', 'Coonorte'] },
  'Occidente': { terminal: 'Norte', avgPrice: 16000, time: '1.5h', frequency: 'Cada 20-30 min', marketDay: 'Sábados', companies: ['Sotrasur', 'Gomez Hernandez'] },
  'Norte': { terminal: 'Norte', avgPrice: 28000, time: '2.5h', frequency: 'Cada 40 min', marketDay: 'Domingos', companies: ['Coonorte', 'Expreso Brasilia'] },
  'Urabá': { terminal: 'Norte', avgPrice: 85000, time: '8h', frequency: 'Salidas diarias c/ 2 horas', marketDay: 'Sábados', companies: ['Sotrauraba', 'Coonorte'] },
  'Valle de Aburrá': { terminal: 'Norte/Sur', avgPrice: 3500, time: '0.5h', frequency: 'Cada 5-10 min', marketDay: 'Todos los días (Plazas de mercado)', companies: ['Metro de Medellín', 'Buses Integrados'] }
};

export function getLocalSuggestions(query: string): string[] {
  const q = normalizeText(query);
  if (!q || q.length < 2) return [];
  const allNames = Array.from(new Set([...Object.values(localData).map(p => p.titulo), ...MUNICIPIOS_ANTIOQUIA]));
  return allNames.filter(name => normalizeText(name).includes(q)).sort().slice(0, 8);
}

export function getLocalPlace(query: string): PlaceData | null {
  const q = normalizeText(query);
  if (!q || q.length < 2) return null;

  let foundKey = Object.keys(localData).find(key => normalizeText(key) === q || normalizeText(localData[key].titulo) === q);
  
  if (foundKey) {
    const found = localData[foundKey];
    const logistics = DEFAULT_LOGISTICS[found.region] || DEFAULT_LOGISTICS['Norte'];
    return { 
      ...found, 
      type: 'place',
      budget: { busTicket: found.budget?.busTicket || logistics.avgPrice, averageMeal: found.budget?.averageMeal || 25000 },
      terminalInfo: `Terminal del ${logistics.terminal}`,
      busFrequency: logistics.frequency,
      marketDay: found.marketDay || logistics.marketDay,
      viaEstado: found.viaEstado || "🟢 Despejada"
    };
  }

  const muniMatch = MUNICIPIOS_ANTIOQUIA.find(m => normalizeText(m) === q || normalizeText(m).includes(q));
  if (muniMatch) {
    const logistics = DEFAULT_LOGISTICS['Norte']; 
    
    return {
      titulo: muniMatch,
      region: 'Antioquia',
      descripcion: `Descubre la magia de ${muniMatch}, un tesoro de nuestra tierra con gente amable y paisajes inolvidables.`,
      imagen: "https://images.unsplash.com/photo-1591605417688-6c0b3b320791",
      budget: { busTicket: 35000, averageMeal: 25000 },
      viaEstado: "🟢 Despejada",
      tiempoDesdeMedellin: "2.5 Horas",
      terminalInfo: "Terminal del Norte",
      busFrequency: "Cada 45 minutos aprox.",
      marketDay: "Sábados y Domingos",
      type: 'place',
      vibeScore: 90,
      neighborTip: "No deje de preguntar por la especialidad del pueblo en el parque principal."
    } as any;
  }
  
  return null;
}
