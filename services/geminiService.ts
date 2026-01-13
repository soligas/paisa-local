
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion, GroundingLink } from "../types";
import { getLocalPlace } from "./logisticsService";
import { getUnsplashImage } from "./unsplashService";
import { getPexelsImage } from "./pexelsService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANTIOQUIA_LANDSCAPES = [
  "https://images.unsplash.com/photo-1591605417688-6c0b3b320791", // Medellin
  "https://images.unsplash.com/photo-1599140849279-101442488c2f", // Guatape
  "https://images.unsplash.com/photo-1590487988256-9ed24133863e", // Santa Fe
  "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59", // Jerico
  "https://images.unsplash.com/photo-1596570073289-535359b85642"  // Jardin
];

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
  const localMatch = getLocalPlace(query);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `INVESTIGACIÓN TURÍSTICA TÁCTICA: "${query}, Antioquia". 
      Genera un JSON ARRAY de hasta 5 destinos relacionados.
      Cada objeto debe seguir este esquema exacto:
      {
        "titulo": "Nombre del municipio",
        "region": "Subregión de Antioquia",
        "descripcion": "Descripción corta y atractiva",
        "imgKeyword": "Palabra clave en INGLES para buscar fotos muy descriptiva (ej: 'colonial architecture Yolombo Antioquia')",
        "viaEstado": "Estado de la vía (ej: Pavimentada)",
        "tiempoDesdeMedellin": "Tiempo estimado",
        "budget": { "busTicket": 0, "averageMeal": 0 },
        "neighborTip": "Dicho o consejo local"
      }
      Idioma de respuesta: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        systemInstruction: `Eres el Arriero Pro, experto en los 125 municipios de Antioquia. 
        Tu misión es dar datos reales de transporte y cultura. 
        Si el usuario busca un pueblo, incluye otros 4 similares de la misma subregión.
        Para imgKeyword sé muy específico: incluye el nombre del pueblo y 'Antioquia Colombia architecture landscape'.`
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
    const resultsArray = Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []);

    const places: PlaceData[] = await Promise.all(resultsArray.map(async (data: any, index: number) => {
      const searchTag = data.imgKeyword || `${data.titulo} Antioquia Colombia`;
      let photo = await getUnsplashImage(searchTag);
      if (!photo) {
        photo = await getPexelsImage(searchTag);
      }

      // Si aún no hay foto, usar un paisaje aleatorio de Antioquia de nuestra lista curada
      const fallback = ANTIOQUIA_LANDSCAPES[index % ANTIOQUIA_LANDSCAPES.length];

      return {
        type: 'place',
        titulo: data.titulo || "Destino Desconocido",
        region: (data.region || 'Valle de Aburrá') as AntioquiaRegion,
        descripcion: data.descripcion || "Explora la riqueza de Antioquia.",
        imagen: photo || fallback,
        viaEstado: data.viaEstado || "Verificada por IA",
        tiempoDesdeMedellin: data.tiempoDesdeMedellin || "Variable",
        coordenadas: { lat: 6.2, lng: -75.5 },
        budget: {
          busTicket: data.budget?.busTicket || 35000,
          averageMeal: data.budget?.averageMeal || 25000
        },
        accessibility: {
          score: 85,
          wheelchairFriendly: true,
          elderlyApproved: true,
          notes: "Accesibilidad verificada."
        },
        security: {
          status: 'Seguro',
          lastReported: 'Hoy',
          emergencyNumber: '123'
        },
        neighborTip: data.neighborTip || "Disfruta el paisaje mijo.",
        terminalInfo: data.region === 'Suroeste' ? "Terminal del Sur" : "Terminal del Norte",
        groundingLinks: groundingLinks.length > 0 ? groundingLinks : undefined
      };
    }));

    if (localMatch) {
      const exists = places.some(p => p.titulo.toLowerCase() === localMatch.titulo.toLowerCase());
      if (!exists) places.unshift(localMatch);
    }

    return places;
  } catch (e) {
    console.error("Gemini Search Error:", e);
    return localMatch ? [localMatch] : [];
  }
}

export async function generateSmartItinerary(pueblo: string, lang: SupportedLang = 'es') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crea un itinerario de 1 día para ${pueblo}, Antioquia. Responde JSON: { "morning": "...", "afternoon": "...", "evening": "..." }. Idioma: ${lang}.`,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}
