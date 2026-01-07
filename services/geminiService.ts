
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion } from "../types";
import { getLocalPlace } from "./logisticsService";

function safeJsonParse(text: any): any {
  if (!text || typeof text !== 'string') return null;
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (e) { 
    console.error("[PAISA-DEBUG] Error parseando JSON de Gemini:", e);
    return null; 
  }
}

export async function checkSystemHealth(): Promise<{ok: boolean, msg: string}> {
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey || apiKey === 'undefined') {
    return { ok: false, msg: "Falta la API_KEY en las variables de Vercel." };
  }
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "ping",
      config: { maxOutputTokens: 1 }
    });
    if (response.text) return { ok: true, msg: "Conexión exitosa con Google AI." };
    return { ok: false, msg: "Respuesta vacía del servidor." };
  } catch (e: any) {
    console.error("[PAISA-DEBUG] Fallo Health Check:", e);
    return { ok: false, msg: e.message || "Error de red desconocido." };
  }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<UnifiedItem[]> {
  console.log(`%c[ARRIERO-LOG] Iniciando búsqueda: ${query}`, "color: #2D7A4C; font-weight: bold;");
  
  const localMatch = getLocalPlace(query);
  const results: UnifiedItem[] = localMatch ? [localMatch] : [];

  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey || apiKey === 'undefined') {
    console.error("%c[ARRIERO-ERROR] API_KEY no configurada en Vercel.", "color: red; font-weight: bold;");
    return results;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Investiga en GOOGLE SEARCH para: "${query}" en Antioquia.
      Necesito datos REALES 2024: Logística, Precios Bus, Vía y Tip.
      RESPONDE SOLO EN JSON ARRAY con tipo 'place'. Idioma: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Eres el Arriero Digital de Paisa Local Pro. Experto en logística de buses de Medellín."
      },
    });

    console.log("[ARRIERO-LOG] Respuesta cruda de Gemini:", response.text);

    const aiData = safeJsonParse(response.text);
    if (Array.isArray(aiData)) {
      const mappedAi = aiData.map((res: any): UnifiedItem => ({
        type: 'place',
        titulo: res.nombre || res.titulo || query,
        region: (res.region || 'Antioquia') as AntioquiaRegion,
        descripcion: res.descripcion || "Destino encontrado en el camino.",
        seguridadTexto: `Vía: ${res.via_status || 'Reportada'}. Terminal: ${res.terminal || 'Norte/Sur'}.`,
        vibeScore: 90,
        nomadScore: 80,
        viaEstado: 'Despejada',
        tiempoDesdeMedellin: res.tiempo || 'Consultando...',
        budget: {
          busTicket: res.precio_bus || 30000,
          averageMeal: 25000
        },
        coordenadas: { lat: 6.244, lng: -75.581 },
        imagen: `https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=1200`,
        neighborTip: res.neighbor_tip || "Pregúntale a un lugareño por el mejor tinto.",
        isVerified: true
      }));
      return [...results, ...mappedAi];
    }
  } catch (err: any) {
    console.error("%c[ARRIERO-ERROR] Error en Gemini Grounding:", "color: red;", err);
    throw err;
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
