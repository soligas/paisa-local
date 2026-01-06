
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData } from "../types";
import { searchVerifiedPlaces, getVerifiedDishes, getVerifiedExperiences } from "./supabaseService";
import { localData } from "../data";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=1200";

export const MUNICIPIOS_ANTIOQUIA = [
  "Abejorral", "Abriaquí", "Alejandría", "Amagá", "Amalfi", "Andes", "Angelópolis", "Angostura", "Anorí", "Anzá", "Apartadó", "Arboletes", "Argelia", "Armenia", "Barbosa", "Belmira", "Bello", "Betania", "Betulia", "Briceño", "Buriticá", "Caicedo", "Caldas", "Campamento", "Cañasgordas", "Caracolí", "Caramanta", "Carepa", "Carmen de Viboral", "Carolina del Príncipe", "Caucasia", "Chigorodó", "Cisneros", "Ciudad Bolívar", "Cocorná", "Concepción", "Concordia", "Copacabana", "Dabeiba", "Donmatías", "Ebéjico", "El Bagre", "El Peñol", "El Retiro", "El Santuario", "Entrerríos", "Envigado", "Fredonia", "Frontino", "Giraldo", "Girardota", "Gómez Plata", "Granada", "Guadalupe", "Guarne", "Guatapé", "Heliconia", "Hispania", "Itagüí", "Ituango", "Jardín", "Jericó", "La Ceja", "La Estrella", "La Pintada", "La Unión", "Liborina", "Maceo", "Marinilla", "Medellín", "Montebello", "Murindó", "Mutatá", "Nariño", "Nechí", "Necoclí", "Olaya", "Peque", "Pueblorrico", "Puerto Berrío", "Puerto Nare", "Puerto Triunfo", "Remedios", "Rionegro", "Sabanalarga", "Sabaneta", "Salgar", "San Andrés de Cuerquia", "San Carlos", "San Francisco", "San Jerónimo", "San José de la Montaña", "San Juan de Urabá", "San Luis", "San Pedro de los Milagros", "San Pedro de Urabá", "San Rafael", "San Roque", "San Vicente Ferrer", "Santa Bárbara", "Santa Fe de Antioquia", "Santa Rosa de Osos", "Santo Domingo", "Segovia", "Sonsón", "Sopetrán", "Támesis", "Tarazá", "Tarso", "Titiribí", "Toledo", "Turbo", "Uramita", "Urrao", "Valdivia", "Valparaíso", "Vegachí", "Venecia", "Vigía del Fuerte", "Yalí", "Yarumal", "Yolombó", "Yondó", "Zaragoza"
];

export function cleanString(str: string): string {
  if (!str) return "";
  return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function safeJsonParse(text: any): any {
  if (!text || typeof text !== 'string') return null;
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (e) { return null; }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<UnifiedItem[]> {
  const nQuery = cleanString(query);
  if (!nQuery) return [];

  const localResults: UnifiedItem[] = Object.values(localData)
    .filter((p: any) => cleanString(p.titulo).includes(nQuery) || cleanString(p.region).includes(nQuery))
    .map(p => ({ ...p, type: 'place', isVerified: true }));

  let dbResults: UnifiedItem[] = [];
  try {
    const [dbPlaces, dbDishes, dbExps] = await Promise.all([
      searchVerifiedPlaces(query),
      getVerifiedDishes(query),
      getVerifiedExperiences(query)
    ]);
    dbResults = [...dbPlaces, ...dbDishes, ...dbExps];
  } catch (e) { }

  const combined = [...localResults];
  dbResults.forEach(item => {
    const name = item.type === 'place' ? item.titulo : (item as any).nombre || (item as any).titulo;
    if (!combined.some(c => (c.type === 'place' ? c.titulo : (c as any).nombre || (c as any).titulo) === name)) {
      combined.push(item);
    }
  });

  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey || apiKey === 'undefined') return combined;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const matchedTown = MUNICIPIOS_ANTIOQUIA.find(m => cleanString(m) === nQuery || cleanString(m).includes(nQuery));
    const searchQuery = matchedTown ? `Logística viaje Medellín a ${matchedTown} Antioquia terminal norte o sur precios 2024 plato tipico y artesanias` : query;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Explora Antioquia para: "${searchQuery}".
      Retorna un ARRAY JSON con datos REALES de logística y cultura.
      Si es lugar: {
        type: 'place', nombre, region, descripcion, bus_terminal: "Norte" o "Sur", 
        bus_price_cop, duration, parche: "Familiar/Rumba/Romantico/Aventura",
        acceso: "Cualquier Carro/4x4 Recomendado", plato_insignia, budget_range: "$/$$/$$$"
      }.
      Si es plato: {
        type: 'dish', nombre, descripcion, donde, precio_est, 
        origen: [{nombre: "Productor", finca: "Lugar"}]
      }.
      Si es experiencia: {
        type: 'experience', titulo, descripcion, ubicacion, categoria, impacto, 
        maestro: {nombre, especialidad, años}
      }.
      Idioma: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Prioriza la verdad logística: terminales exactas, accesibilidad vehicular y maestros de oficio reales."
      },
    });

    const aiData = safeJsonParse(response.text);
    if (Array.isArray(aiData)) {
      const mappedAi = aiData.map((res: any): UnifiedItem => {
        const common = { imagen: res.imagen || FALLBACK_IMG, isVerified: false };
        if (res.type === 'dish') {
          return {
            type: 'dish', nombre: res.nombre, descripcion: res.descripcion, dondeProbar: res.donde || "Antioquia",
            categoria: "Gastronomía", precioLocalEstimated: (res.precio_est || 30000).toLocaleString(),
            precioTuristaEstimated: ((res.precio_est || 30000) * 1.3).toLocaleString(),
            precioVerificado: false, economiaCircular: true, productoresOrigen: res.origen || [], ...common
          };
        }
        if (res.type === 'experience') {
          return {
            type: 'experience', titulo: res.titulo, descripcion: res.descripcion, ubicacion: res.ubicacion,
            categoria: res.categoria, impactoSocial: res.impacto, imagen: res.imagen || FALLBACK_IMG,
            costoSugeridoCOP: "Variable", horarioRecomendado: "Cita previa", maestroOficio: res.maestro
          };
        }
        return {
          type: 'place', titulo: res.nombre, region: res.region || "Antioquia", descripcion: res.descripcion,
          seguridadTexto: `Plan ${res.parche || 'Familiar'}. Acceso: ${res.acceso || 'Cualquier Carro'}.`,
          vibeScore: 90, nomadScore: 85, viaEstado: 'Despejada', tiempoDesdeMedellin: res.duration || '3h',
          budget: { busTicket: res.bus_price_cop || 25000, averageMeal: 30000 },
          budgetRange: res.budget_range || '$$', coordenadas: { lat: 6.25, lng: -75.5 },
          neighborTip: `Prueba: ${res.plato_insignia}.`, parcheType: res.parche,
          carType: res.acceso, terminalInfo: res.bus_terminal, signatureDish: res.plato_insignia, ...common
        };
      });
      return [...combined, ...mappedAi];
    }
  } catch (err) { }
  return combined;
}

export const connectArrieroLive = (lang: SupportedLang, callbacks: any) => {
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey || apiKey === 'undefined') return null;
  const ai = new GoogleGenAI({ apiKey });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      outputAudioTranscription: {},
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
      systemInstruction: `Sos el Arriero Concierge. Conocés cada terminal de Medellín y los 125 pueblos. Ayudá al turista con jerga paisa y datos reales en ${lang}.`
    },
    callbacks: {
      onmessage: async (message: LiveServerMessage) => {
        const sc = message.serverContent;
        if (sc?.outputTranscription) callbacks.onTranscription(sc.outputTranscription.text);
        if (sc?.interrupted) callbacks.onInterrupted();
        const data = sc?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (data) callbacks.onAudioChunk(data);
      }
    }
  });
};

export async function getSearchSuggestions(query: string): Promise<string[]> {
  const nQuery = cleanString(query);
  if (nQuery.length < 2) return [];
  const townMatches = MUNICIPIOS_ANTIOQUIA.filter(m => cleanString(m).includes(nQuery)).slice(0, 3);
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey || apiKey === 'undefined') return townMatches;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `3 términos de búsqueda populares en Antioquia que empiecen con "${query}". Retorna solo un array JSON de strings.`,
      config: { responseMimeType: "application/json" }
    });
    const aiSugs = safeJsonParse(response.text) || [];
    return Array.from(new Set([...townMatches, ...aiSugs]));
  } catch (e) { return townMatches; }
}

export const decode = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));
export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, rate: number): Promise<AudioBuffer> {
  const i16 = new Int16Array(data.buffer);
  const buf = ctx.createBuffer(1, i16.length, rate);
  const chan = buf.getChannelData(0);
  for (let i = 0; i < i16.length; i++) chan[i] = i16[i] / 32768;
  return buf;
}
