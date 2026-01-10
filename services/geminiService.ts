
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion, GroundingLink } from "../types";
import { getLocalPlace } from "./logisticsService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function safeJsonParse(text: string) {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const startIdx = Math.min(
      cleaned.indexOf('[') === -1 ? Infinity : cleaned.indexOf('['),
      cleaned.indexOf('{') === -1 ? Infinity : cleaned.indexOf('{')
    );
    if (startIdx === Infinity) return null;
    return JSON.parse(cleaned.substring(startIdx));
  } catch (e) {
    console.error("JSON Parse Error", e);
    return null;
  }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<UnifiedItem[]> {
  const localMatch = getLocalPlace(query);
  if (localMatch && !query.includes('2025') && !query.includes('hoy')) {
    return [localMatch];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `ACTÚA COMO UN PIPELINE DE INDEXACIÓN TURÍSTICA PARA ANTIOQUIA. 
      Investiga "${query}" para el año 2025.
      
      IMPORTANTE: El campo 'neighborTip' debe ser una recomendación holística que cubra cultura, comida típica recomendada, horarios del comercio y cómo tratar con la gente local.
      
      REQUERIDO:
      - Precios de bus y comida actualizados (2025).
      - Estado de seguridad (status: 'Seguro', 'Precaución' o 'Crítico').
      - Accesibilidad (score 0-100).
      - neighborTip: Incluye cultura, comida y tips de comportamiento.
      
      Responde estrictamente un JSON ARRAY con un objeto compatible con el tipo PlaceData.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Genera datos turísticos precisos. Prioriza la veracidad sobre los precios de transporte y seguridad vial."
      },
    });

    const groundingLinks: GroundingLink[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          groundingLinks.push({
            title: chunk.web.title || "Fuente de Verificación",
            uri: chunk.web.uri,
            type: chunk.web.uri.includes('video') ? 'video' : 'official'
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
        imagen: data.imagen || "https://images.unsplash.com/photo-1590487988256-9ed24133863e",
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
          notes: data.accessibility?.notes || "Información basada en reportes de redes sociales."
        },
        security: {
          status: data.security?.status || 'Seguro',
          lastReported: data.security?.lastReported || 'Recientemente',
          emergencyNumber: data.security?.emergencyNumber || '123'
        },
        socialPulse: data.socialPulse,
        groundingLinks: groundingLinks.slice(0, 4),
        neighborTip: data.neighborTip || "Saluda siempre con 'Buenas', madruga para el mejor café y prueba la trucha local.",
        terminalInfo: data.terminalInfo || "Terminal del Norte"
      };
      return [place];
    }
  } catch (e) {
    console.error("AI Search Error", e);
    if (localMatch) return [localMatch];
  }
  return localMatch ? [localMatch] : [];
}

export async function generateSmartItinerary(pueblo: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crea un itinerario de 1 día para ${pueblo}, Antioquia. Responde JSON: {morning, afternoon, evening}.`,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}

export async function checkSystemHealth(): Promise<boolean> {
  return !!process.env.API_KEY;
}
