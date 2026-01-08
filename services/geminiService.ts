
// @google/genai: World-class senior frontend engineer fix
import { GoogleGenAI, Modality, LiveServerMessage, Type } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion, GroundingLink } from "../types";
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
  if (!apiKey || apiKey === 'undefined' || apiKey === '') return { ok: false, msg: "Falta API_KEY." };
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "ping",
      config: { maxOutputTokens: 1 }
    });
    return { ok: !!response.text, msg: response.text ? "IA Activa" : "Sin respuesta" };
  } catch (e: any) {
    return { ok: false, msg: "Error IA.", code: e.status === 429 ? 429 : 500 };
  }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<UnifiedItem[]> {
  const localMatch = getLocalPlace(query);
  if (localMatch) return [localMatch];

  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey) return [];

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Municipio: "${query}" en Antioquia. LOGÍSTICA, ACCESIBILIDAD Y SEGURIDAD 2024. 
      Analiza: 1. Movilidad para sillas de ruedas. 2. Facilidad para adultos mayores. 3. Estado de seguridad pública.
      Responde JSON ARRAY de 1 objeto 'place'.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `Eres un guía experto e INCLUSIVO de Antioquia. 
        Debes priorizar datos sobre rampas, ascensores y seguridad para extranjeros.
        Esquema JSON: { 
          nombre, region, descripcion, precio_bus, terminal, tiempo, clima_temp, clima_desc,
          accessibility: { wheelchairFriendly, elderlyApproved, score, notes },
          security: { status (Seguro/Precaucion), lastReported, emergencyNumber }
        }`
      },
    });

    // Extraer links reales de Grounding (Crucial para Confianza)
    const groundingLinks: GroundingLink[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          const type = chunk.web.uri.includes('youtube.com') ? 'video' : 
                       chunk.web.uri.includes('.gov.co') ? 'official' : 
                       chunk.web.uri.includes('tripadvisor') ? 'news' : 'other';
          
          groundingLinks.push({
            title: chunk.web.title || "Referencia Real",
            uri: chunk.web.uri,
            type: type as any
          });
        }
      });
    }

    const aiData = safeJsonParse(response.text);
    if (Array.isArray(aiData) && aiData.length > 0) {
      const res = aiData[0];
      return [{
        type: 'place',
        titulo: res.nombre || query,
        region: (res.region || 'Antioquia') as AntioquiaRegion,
        descripcion: res.descripcion || "Un tesoro por descubrir.",
        seguridadTexto: "Vía monitoreada por Policía de Turismo.",
        groundingLinks: groundingLinks.slice(0, 4), // Solo los mejores 4
        security: {
          status: res.security?.status || 'Seguro',
          lastReported: res.security?.lastReported || 'Hoy',
          emergencyNumber: res.security?.emergencyNumber || '123 / #767',
          touristPoliceLink: "https://www.policia.gov.co/turismo"
        },
        accessibility: {
          wheelchairFriendly: res.accessibility?.wheelchairFriendly || false,
          elderlyApproved: res.accessibility?.elderlyApproved || false,
          brailleAvailable: false,
          sensoryFriendly: true,
          score: res.accessibility?.score || 70,
          notes: res.accessibility?.notes || "Infraestructura estándar."
        },
        vibeScore: 90,
        nomadScore: 80,
        wifiQuality: 'Excelente',
        busFrequency: 'Cada 45 min',
        busCompanies: ['Coonorte', 'Sotraurabá'],
        viaEstado: 'Despejada',
        tiempoDesdeMedellin: res.tiempo || '3h',
        budget: { busTicket: res.precio_bus || 35000, averageMeal: 25000 },
        coordenadas: { lat: 6.2, lng: -75.5 },
        imagen: ``,
        weather: { temp: res.clima_temp || 22, condition: res.clima_desc || 'Despejado', icon: 'Sun' }
      }];
    }
  } catch (err) { return []; }
  return [];
}

export async function generateSmartItinerary(place: string): Promise<any> {
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crea un itinerario detallado de 1 día para visitar "${place}" en Antioquia. Enfócate en la accesibilidad para personas mayores y con discapacidad.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            morning: { type: Type.STRING },
            afternoon: { type: Type.STRING },
            evening: { type: Type.STRING },
            accessibilityScore: { type: Type.NUMBER },
            safetyTips: { type: Type.STRING }
          },
          required: ["title", "summary", "morning", "afternoon", "evening"]
        },
        systemInstruction: "Eres un planificador de viajes experto e inclusivo en el departamento de Antioquia, Colombia."
      }
    });
    return safeJsonParse(response.text);
  } catch (err) { return null; }
}

export const connectArrieroLive = (lang: SupportedLang, callbacks: any) => {
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction: `Eres el Arriero de Paisa Local. Eres un experto en turismo regenerativo y ACCESIBILIDAD. 
      Si un usuario es mayor o tiene discapacidad, dale consejos específicos sobre rampas y baños.`
    },
    callbacks: {
      onmessage: async (message: LiveServerMessage) => {
        const data = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (data) callbacks.onAudioChunk(data);
      },
      onopen: () => console.log("Live ON"),
      onerror: (e) => console.error("Live ERR", e),
      onclose: () => console.log("Live OFF")
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
