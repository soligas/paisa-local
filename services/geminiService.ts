
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

/**
 * Verifica si la API_KEY es válida y el servicio está arriba.
 */
export async function checkSystemHealth(): Promise<boolean> {
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey) return false;
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    // Un simple generateContent de 1 token para validar la llave
    await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "ping",
      config: { maxOutputTokens: 1 }
    });
    return true;
  } catch (e) {
    console.error("[GEMINI-HEALTH] Fallo de conectividad:", e);
    return false;
  }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<UnifiedItem[]> {
  const localMatch = getLocalPlace(query);
  const results: UnifiedItem[] = localMatch ? [localMatch] : [];

  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey) {
    console.warn("[GEMINI-CONFIG] API_KEY no encontrada.");
    return results;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    console.info(`[GEMINI-GROUNDING] Buscando: ${query}`);
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Investiga en GOOGLE SEARCH para: "${query}" en Antioquia.
      Necesito datos REALES 2024: Logística, Precios Bus, Vía y Tip.
      RESPONDE SOLO EN JSON ARRAY con tipo 'place'. Idioma: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Eres el Arriero Digital de Paisa Local Pro."
      },
    });

    const aiData = safeJsonParse(response.text);
    if (Array.isArray(aiData)) {
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
        imagen: `https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=1200`,
        neighborTip: res.neighbor_tip,
        isVerified: true
      }));
      return [...results, ...mappedAi];
    }
  } catch (err) {
    console.error("[GEMINI-GROUNDING] Error:", err);
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
      systemInstruction: `Eres el Arriero Concierge. Hablas con jerga paisa auténtica.`
    },
    callbacks: {
      onmessage: async (message: LiveServerMessage) => {
        const data = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (data) callbacks.onAudioChunk(data);
      },
      onopen: () => console.info("[GEMINI-LIVE] Conectado."),
      onerror: (e) => console.error("[GEMINI-LIVE] Error:", e),
      onclose: () => console.info("[GEMINI-LIVE] Desconectado.")
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
