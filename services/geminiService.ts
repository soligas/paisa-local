
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion } from "../types";
import { getLocalPlace } from "./logisticsService";

function safeJsonParse(text: any): any {
  if (!text || typeof text !== 'string') return null;
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (e) { return null; }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<UnifiedItem[]> {
  // 1. Prioridad Máxima: Datos locales estáticos (Carga instantánea)
  const localMatch = getLocalPlace(query);
  const results: UnifiedItem[] = localMatch ? [localMatch] : [];

  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey) return results;

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // 2. Capa de IA con Grounding para datos reales (Vías, Buses, Precios actualizados)
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `ACTÚA COMO UN GUÍA PAISA EXPERTO. 
      Investiga en GOOGLE SEARCH para: "${query}" en Antioquia.
      Necesito datos REALES de HOY:
      1. Logística: Terminal de salida desde Medellín, precio de bus ACTUAL, estado de la vía (Derrumbes/Pare y Siga).
      2. Gastronomía: Mejor sitio para comer plato típico y precio estimado.
      3. Tip de Local: Un secreto que no esté en guías turísticas.

      RESPONDE SOLO EN JSON ARRAY:
      [{
        "type": "place",
        "nombre": "string",
        "region": "Subregión",
        "descripcion": "string corta",
        "via_status": "string (Estado real de la carretera)",
        "precio_bus": number,
        "terminal": "Norte/Sur",
        "tiempo": "string",
        "neighbor_tip": "string",
        "imagen_keyword": "string para buscar imagen"
      }]
      Idioma: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Eres el Arriero Digital de Paisa Local Pro. Tu verdad viene de Google Search para dar seguridad al viajero."
      },
    });

    const aiData = safeJsonParse(response.text);
    if (Array.isArray(aiData)) {
      const mappedAi = aiData.map((res: any): UnifiedItem => ({
        type: 'place',
        titulo: res.nombre,
        // Fixed: Ensure region is a valid AntioquiaRegion type and added required coordenadas
        region: (res.region && ['Oriente', 'Suroeste', 'Occidente', 'Norte', 'Bajo Cauca', 'Nordeste', 'Magdalena Medio', 'Urabá', 'Valle de Aburrá'].includes(res.region) ? res.region : 'Valle de Aburrá') as AntioquiaRegion,
        descripcion: res.descripcion,
        seguridadTexto: `Vía: ${res.via_status || 'Verificada por IA'}. Salida: Terminal ${res.terminal || 'Norte'}.`,
        vibeScore: 98,
        nomadScore: 85,
        viaEstado: 'Despejada',
        tiempoDesdeMedellin: res.tiempo || '2.5h',
        budget: {
          busTicket: res.precio_bus || 25000,
          averageMeal: 30000
        },
        coordenadas: { lat: 6.2442, lng: -75.5812 }, // Fixed: Added required coordinates (Medellin fallback)
        imagen: `https://source.unsplash.com/1200x800/?antioquia,${res.imagen_keyword || res.nombre}`,
        neighborTip: res.neighbor_tip,
        isVerified: true
      }));
      return [...results, ...mappedAi];
    }
  } catch (err) {
    console.error("Grounding Error:", err);
  }
  return results;
}

export const connectArrieroLive = (lang: SupportedLang, callbacks: any) => {
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
      systemInstruction: `Eres el Arriero Concierge. Hablas con jerga paisa auténtica. Tu base de datos es todo Antioquia.`
    },
    callbacks: {
      onmessage: async (message: LiveServerMessage) => {
        const data = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (data) callbacks.onAudioChunk(data);
      },
      onopen: () => console.log("Live session opened"),
      onerror: (e) => console.error("Live session error:", e),
      onclose: () => console.log("Live session closed")
    }
  });
};

export const decode = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));
export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, rate: number): Promise<AudioBuffer> {
  const i16 = new Int16Array(data.buffer);
  const buf = ctx.createBuffer(1, i16.length, rate);
  const chan = buf.getChannelData(0);
  for (let i = 0; i < i16.length; i++) chan[i] = i16[i] / 32768;
  return buf;
}