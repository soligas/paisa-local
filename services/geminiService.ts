
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

export async function checkSystemHealth(): Promise<{ok: boolean, msg: string, code?: number}> {
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    return { ok: false, msg: "Falta API_KEY en Vercel." };
  }
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "ping",
      config: { maxOutputTokens: 1 }
    });
    if (response.text) return { ok: true, msg: "IA Activa" };
    return { ok: false, msg: "Sin respuesta de Google" };
  } catch (e: any) {
    if (e.message?.includes('429')) return { ok: false, msg: "Cuota excedida (429).", code: 429 };
    return { ok: false, msg: "Error de conexión con Gemini." };
  }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<UnifiedItem[]> {
  console.log(`[ARRIERO] Buscando localmente: ${query}`);
  
  // 1. Prioridad Local (Ahora con normalización de acentos)
  const localMatch = getLocalPlace(query);
  const results: UnifiedItem[] = localMatch ? [localMatch] : [];

  // Si encontramos algo local y la IA está fallando, no arriesgamos y devolvemos local
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey || apiKey === 'undefined' || apiKey === '') return results;

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Pueblo: "${query}" en Antioquia. LOGÍSTICA 2024. JSON ARRAY 'place'.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Eres un experto en rutas de buses de Medellín. Solo responde JSON válido."
      },
    });

    const aiData = safeJsonParse(response.text);
    if (Array.isArray(aiData) && aiData.length > 0) {
      // Changed return type from UnifiedItem to PlaceData to fix the 'titulo' property access error on line 82
      const mappedAi = aiData.map((res: any): PlaceData => ({
        type: 'place',
        titulo: res.nombre || res.titulo || query,
        region: (res.region || 'Antioquia') as AntioquiaRegion,
        descripcion: res.descripcion || "Un destino increíble en las montañas.",
        seguridadTexto: `Vía: ${res.via_status || 'Reportada'}. Terminal: ${res.terminal || 'Norte/Sur'}.`,
        vibeScore: 90,
        nomadScore: 80,
        viaEstado: 'Despejada',
        tiempoDesdeMedellin: res.tiempo || '2-4h',
        budget: {
          busTicket: res.precio_bus || 35000,
          averageMeal: 25000
        },
        coordenadas: { lat: 6.2, lng: -75.5 },
        imagen: `https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=800`,
        neighborTip: res.neighbor_tip || "Disfruta un tinto en el parque principal.",
        isVerified: true
      }));
      
      // Access to .titulo is now safe because mappedAi is typed as PlaceData[]
      if (localMatch && mappedAi[0].titulo.toLowerCase() === localMatch.titulo.toLowerCase()) {
        return results;
      }
      return [...results, ...mappedAi];
    }
  } catch (err: any) {
    console.warn("[ARRIERO] Fallo IA, entregando resultados locales.");
    return results;
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
      systemInstruction: `Eres el Arriero de Paisa Local. Habla con jerga paisa.`
    },
    callbacks: {
      onmessage: async (message: LiveServerMessage) => {
        const data = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (data) callbacks.onAudioChunk(data);
      },
      onopen: () => console.info("Live Connected"),
      onerror: (e) => console.error("Live Error", e),
      onclose: () => console.info("Live Closed")
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
