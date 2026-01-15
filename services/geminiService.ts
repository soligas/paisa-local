
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion, GroundingLink } from "../types";
import { getLocalPlace } from "./logisticsService";
import { getUnsplashImage } from "./unsplashService";
import { getPexelsImage } from "./pexelsService";
import { findBlobUrlByName } from "./blobService";

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
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<UnifiedItem[]> {
  const localMatch = getLocalPlace(query);
  
  try {
    // Usamos gemini-3-flash-preview para máxima velocidad
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `DESTINO: "${query}, Antioquia". 
      Genera JSON ARRAY (max 2-3 items). 
      Estructura corta: { 
        "titulo": "...", 
        "region": "...", 
        "descripcion": "Corta/paisa", 
        "imgKeyword": "search term", 
        "viaEstado": "...", 
        "budget": {"busTicket": 0, "averageMeal": 0},
        "foodTip": "...", "cultureTip": "...", "logisticsTip": "...", "peopleTip": "..."
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        systemInstruction: `Eres el Arriero Pro. Genera datos reales y tácticos de Antioquia. Sé extremadamente breve.`
      },
    });

    const rawData = safeJsonParse(response.text);
    const resultsArray = Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceLinks: GroundingLink[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Fuente",
        uri: chunk.web.uri,
        type: 'official'
      }));

    const places: PlaceData[] = await Promise.all(resultsArray.map(async (data: any) => {
      // Búsqueda de imagen optimizada: Intenta bodega, si no, busca en las otras dos EN PARALELO
      let finalImageUrl = await findBlobUrlByName(data.titulo);

      if (!finalImageUrl) {
        // Ejecutar Unsplash y Pexels al mismo tiempo y tomar la primera que responda
        const results = await Promise.allSettled([
          getUnsplashImage(data.imgKeyword || `${data.titulo} Antioquia`),
          getPexelsImage(data.imgKeyword || `${data.titulo} Colombia`)
        ]);
        
        for (const res of results) {
          if (res.status === 'fulfilled' && res.value) {
            finalImageUrl = res.value;
            break;
          }
        }
      }

      const fallback = "https://images.unsplash.com/photo-1591605417688-6c0b3b320791";
      finalImageUrl = finalImageUrl || fallback;

      return {
        type: 'place',
        titulo: data.titulo || "Destino",
        region: (data.region || "Valle de Aburrá") as AntioquiaRegion,
        descripcion: data.descripcion || "",
        imagen: finalImageUrl,
        viaEstado: data.viaEstado || "Pavimentada",
        tiempoDesdeMedellin: "Variable",
        coordenadas: { lat: 6.2, lng: -75.5 },
        budget: {
          busTicket: data.budget?.busTicket || 35000,
          averageMeal: data.budget?.averageMeal || 25000
        },
        accessibility: { score: 90, wheelchairFriendly: true, elderlyApproved: true, notes: "Verificada" },
        security: { status: 'Seguro', lastReported: 'Hoy', emergencyNumber: '123' },
        neighborTip: data.neighborTip || "¡Qué berraquera mijo!",
        foodTip: data.foodTip,
        cultureTip: data.cultureTip,
        logisticsTip: data.logisticsTip,
        peopleTip: data.peopleTip,
        terminalInfo: "Terminal Norte/Sur",
        groundingLinks: sourceLinks.slice(0, 2)
      };
    }));

    if (localMatch) {
      const blobImg = await findBlobUrlByName(localMatch.titulo);
      if (blobImg) localMatch.imagen = blobImg;
      if (!places.some(p => p.titulo.toLowerCase() === localMatch.titulo.toLowerCase())) {
        places.unshift(localMatch);
      }
    }

    return places;
  } catch (e) {
    return localMatch ? [localMatch] : [];
  }
}

export async function generateSmartItinerary(pueblo: string, lang: SupportedLang = 'es') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Itinerario corto ${pueblo}, Antioquia. JSON morning, afternoon, evening.`,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}
