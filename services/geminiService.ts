
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData } from "../types";
import { searchVerifiedPlaces, getVerifiedDishes } from "./supabaseService";
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
    const dbPlaces = await searchVerifiedPlaces(query);
    const dbDishes = await getVerifiedDishes(query);
    dbResults = [...(dbPlaces || []), ...(dbDishes || [])];
  } catch (e) { }

  const combined = [...localResults];
  dbResults.forEach(item => {
    const name = item.type === 'place' ? item.titulo : (item as any).nombre;
    if (!combined.some(c => (c.type === 'place' ? c.titulo : (c as any).nombre) === name)) {
      combined.push(item);
    }
  });

  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey || apiKey === 'undefined') return combined;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const matchedTown = MUNICIPIOS_ANTIOQUIA.find(m => cleanString(m) === nQuery || cleanString(m).includes(nQuery));
    const searchQuery = matchedTown ? `Logística de viaje a ${matchedTown}, Antioquia` : query;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Search in Antioquia/Medellin for: "${searchQuery}".
      Found: ${combined.map(r => r.type === 'place' ? (r as any).titulo : (r as any).nombre).join(", ")}.
      Return an ARRAY JSON of 4 items.
      IF PLACE: {type: 'place', nombre, region, descripcion, bus_terminal, bus_price_cop (number), duration_hours, safety_score (1-10), safety_tip, secret_tip}.
      IF DISH: {type: 'dish', nombre, descripcion, best_place, price_est}.
      Language: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are the ultimate Antioquia travel concierge. You MUST provide real logistics: terminal names, bus prices, and travel times. Be precise for all 125 municipalities."
      },
    });

    const aiData = safeJsonParse(response.text);
    if (Array.isArray(aiData)) {
      const mappedAi = aiData.map((res: any): UnifiedItem => {
        const common = { 
          imagen: res.imagen || FALLBACK_IMG,
          isVerified: false 
        };
        if (res.type === 'dish') {
          return {
            type: 'dish',
            nombre: res.nombre,
            descripcion: res.descripcion,
            dondeProbar: res.best_place || "Medellín",
            categoria: "Gastronomía",
            precioLocalEstimated: res.price_est || "30,000",
            precioTuristaEstimated: "45,000",
            precioVerificado: false,
            economiaCircular: true,
            ...common
          };
        }
        return {
          type: 'place',
          titulo: res.nombre,
          region: res.region || "Antioquia",
          descripcion: res.descripcion,
          seguridadTexto: `Seguridad ${res.safety_score || '8'}/10: ${res.safety_tip || 'Tranquilo.'}`,
          vibeScore: 90,
          nomadScore: 85,
          viaEstado: 'Despejada',
          tiempoDesdeMedellin: res.duration_hours || '3h',
          budget: { 
            busTicket: parseInt(res.bus_price_cop?.toString().replace(/\D/g, '')) || 25000, 
            averageMeal: 25000 
          },
          coordenadas: { lat: 6.25, lng: -75.5 },
          neighborTip: res.secret_tip || "Pregunta por el café local.",
          trivia: `🚌 Terminal ${res.bus_terminal || 'Norte/Sur'} • 💰 Pasaje: $${res.bus_price_cop || '25k'}`,
          ...common
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
      contents: `3 popular search terms in Antioquia starting with "${query}". JSON string array.`,
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
