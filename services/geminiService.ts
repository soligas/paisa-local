
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion, GroundingLink } from "../types";
import { getLocalPlace } from "./logisticsService";
import { getUnsplashImage } from "./unsplashService";
import { getPexelsImage } from "./pexelsService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function safeJsonParse(text: string) {
  if (!text) return null;
  try {
    let cleaned = text.trim();
    cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
    const startIdx = cleaned.search(/[\{\[]/);
    if (startIdx === -1) return null;
    const lastBracket = cleaned.lastIndexOf(']');
    const lastBrace = cleaned.lastIndexOf('}');
    const endIdx = Math.max(lastBracket, lastBrace);
    if (endIdx === -1 || endIdx < startIdx) return null;
    cleaned = cleaned.substring(startIdx, endIdx + 1);
    cleaned = cleaned.replace(/,\s*([\]\}])/g, '$1');
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<UnifiedItem[]> {
  // 1. INTENTO CACHE LOCAL
  const localMatch = getLocalPlace(query);
  if (localMatch && localMatch.imagen) {
    return [localMatch];
  }

  // 2. PIPELINE DE IMÁGENES MULTI-FUENTE (Unsplash -> Pexels)
  let photo = await getUnsplashImage(query);
  if (!photo) {
    photo = await getPexelsImage(query);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `INVESTIGACIÓN TURÍSTICA TÁCTICA: "${query}, Antioquia". 
      Devuelve un JSON con datos de transporte, presupuesto y cultura.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        systemInstruction: "Eres un experto en geografía antioqueña. Devuelve datos precisos de terminales (Norte/Sur) y precios actuales de bus."
      },
    });

    const groundingLinks: GroundingLink[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingLinks.push({
            title: chunk.web.title || 'Referencia web',
            uri: chunk.web.uri,
            type: 'news'
          });
        }
      });
    }

    const rawData = safeJsonParse(response.text);
    const data = Array.isArray(rawData) ? rawData[0] : rawData;

    if (data) {
      const place: PlaceData = {
        type: 'place',
        titulo: data.titulo || data.nombre || query,
        region: (data.region || 'Suroeste') as AntioquiaRegion,
        descripcion: data.descripcion || "Destino indexado mediante inteligencia artificial.",
        imagen: photo || data.imagen || "https://images.unsplash.com/photo-1588698944122-0a27196013a2",
        viaEstado: data.viaEstado || "Verificada por IA",
        tiempoDesdeMedellin: data.tiempoDesdeMedellin || "Variable",
        coordenadas: data.coordenadas || { lat: 6.2, lng: -75.5 },
        budget: {
          busTicket: data.budget?.busTicket || 35000,
          averageMeal: data.budget?.averageMeal || 25000
        },
        accessibility: {
          score: data.accessibility?.score || 85,
          wheelchairFriendly: !!data.accessibility?.wheelchairFriendly,
          elderlyApproved: !!data.accessibility?.elderlyApproved,
          notes: data.accessibility?.notes || "Datos basados en reportes locales."
        },
        security: {
          status: data.security?.status || 'Seguro',
          lastReported: data.security?.lastReported || 'Recientemente',
          emergencyNumber: data.security?.emergencyNumber || '123'
        },
        neighborTip: data.neighborTip || "Pregunta por el mejor café de la plaza.",
        terminalInfo: data.terminalInfo || "Terminal del Norte",
        groundingLinks: groundingLinks.length > 0 ? groundingLinks : undefined
      };
      return [place];
    }
  } catch (e) {
    if (localMatch) return [localMatch];
  }
  return localMatch ? [{...localMatch, imagen: photo || localMatch.imagen}] : [];
}

export async function generateSmartItinerary(pueblo: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crea un itinerario de 1 día para ${pueblo}, Antioquia. Responde JSON: { "morning": "...", "afternoon": "...", "evening": "..." }.`,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}
