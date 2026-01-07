
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
  const localMatch = getLocalPlace(query);
  const results: UnifiedItem[] = localMatch ? [localMatch] : [];

  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey) {
    console.warn("[GEMINI-CONFIG] API_KEY no encontrada. Solo se mostrarán resultados locales.");
    return results;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    console.info(`[GEMINI-GROUNDING] Iniciando búsqueda para: ${query}`);
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Investiga en GOOGLE SEARCH para: "${query}" en Antioquia.
      Necesito datos REALES de HOY: Logística (Terminal, Precio Bus, Vía), Gastronomía y Tip de Local.
      RESPONDE SOLO EN JSON ARRAY con tipo 'place'. Idioma: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Eres el Arriero Digital de Paisa Local Pro."
      },
    });

    const aiData = safeJsonParse(response.text);
    if (Array.isArray(aiData)) {
      console.info(`[GEMINI-GROUNDING] Éxito. Encontrados ${aiData.length} resultados.`);
      const mappedAi = aiData.map((res: any): UnifiedItem => ({
        type: 'place',
        titulo: res.nombre || res.titulo,
        region: (res.region || 'Valle de Aburrá') as AntioquiaRegion,
        descripcion: res.descripcion,
        seguridadTexto: `Vía: ${res.via_status || 'Verificada'}. Terminal: ${res.terminal || 'Norte'}.`,
        vibeScore: 98,
        nomadScore: 85,
        viaEstado: 'Despejada',
        tiempoDesdeMedellin: res.tiempo || '2h',
        budget: {
          busTicket: res.precio_bus || 25000,
          averageMeal: 30000
        },
        coordenadas: { lat: 6.2442, lng: -75.5812 },
        imagen: `https://source.unsplash.com/1200x800/?antioquia,${res.nombre || 'town'}`,
        neighborTip: res.neighbor_tip,
        isVerified: true
      }));
      return [...results, ...mappedAi];
    }
  } catch (err) {
    console.error("[GEMINI-GROUNDING] Error en la llamada:", err);
  }
  return results;
}

export const connectArrieroLive = (lang: SupportedLang, callbacks: any) => {
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  console.info("[GEMINI-LIVE] Iniciando conexión WebSocket...");
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
      systemInstruction: `Eres el Arriero Concierge. Hablas con jerga paisa auténtica.`
    },
    callbacks: {
      onmessage: async (message: LiveServerMessage) => {
        const data = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (data) callbacks.onAudioChunk(data);
      },
      onopen: () => console.info("[GEMINI-LIVE] Conexión abierta y lista."),
      onerror: (e) => console.error("[GEMINI-LIVE] Error de sesión:", e),
      onclose: () => console.info("[GEMINI-LIVE] Sesión cerrada.")
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
