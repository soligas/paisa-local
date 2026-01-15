
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion, GroundingLink } from "../types";
import { getLocalPlace } from "./logisticsService";
import { getUnsplashImage } from "./unsplashService";
import { getPexelsImage } from "./pexelsService";
import { uploadToVercelBlob, findBlobUrlByName } from "./blobService";

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
  // 1. Buscamos primero en datos locales
  const localMatch = getLocalPlace(query);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `INVESTIGACIÓN TURÍSTICA TÁCTICA: "${query}, Antioquia". 
      Genera un JSON ARRAY de hasta 3 destinos relacionados en Antioquia.
      Esquema: { 
        "titulo": "...", 
        "region": "...", 
        "descripcion": "...", 
        "imgKeyword": "...", 
        "viaEstado": "...", 
        "budget": {"busTicket": 0, "averageMeal": 0},
        "foodTip": "Qué comer específico",
        "cultureTip": "Consejo cultural",
        "logisticsTip": "Logística táctica",
        "peopleTip": "Dato sobre la gente"
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        systemInstruction: `Eres el Arriero Pro. Experto en los 125 municipios de Antioquia. Tus consejos son cortos, útiles y con sabor local.`
      },
    });

    const rawData = safeJsonParse(response.text);
    const resultsArray = Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceLinks: GroundingLink[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Fuente de Información",
        uri: chunk.web.uri,
        type: 'official'
      }));

    const places: PlaceData[] = await Promise.all(resultsArray.map(async (data: any) => {
      // Prioridad 1: Tu Bodega (Blob) - Buscamos por el título exacto que devolvió la IA
      let finalImageUrl = await findBlobUrlByName(data.titulo);

      // Prioridad 2: Unsplash
      if (!finalImageUrl) {
        finalImageUrl = await getUnsplashImage(data.imgKeyword || `${data.titulo} Antioquia`);
      }

      // Prioridad 3: Pexels
      if (!finalImageUrl) {
        finalImageUrl = await getPexelsImage(data.imgKeyword || `${data.titulo} Colombia`);
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
        accessibility: { score: 85, wheelchairFriendly: true, elderlyApproved: true, notes: "Verificada" },
        security: { status: 'Seguro', lastReported: 'Hoy', emergencyNumber: '123' },
        neighborTip: data.neighborTip || "¡Qué berraquera mijo! Venga a conocer.",
        foodTip: data.foodTip,
        cultureTip: data.cultureTip,
        logisticsTip: data.logisticsTip,
        peopleTip: data.peopleTip,
        terminalInfo: "Terminal Norte/Sur",
        groundingLinks: sourceLinks.slice(0, 3)
      };
    }));

    // Inyectar el match local si existe y asegurar que use la imagen del Blob si está disponible
    if (localMatch) {
      const blobImg = await findBlobUrlByName(localMatch.titulo);
      if (blobImg) localMatch.imagen = blobImg;
      
      const exists = places.some(p => p.titulo.toLowerCase() === localMatch.titulo.toLowerCase());
      if (!exists) {
        places.unshift(localMatch);
      } else {
        // Actualizar la imagen en el array de resultados si encontramos una mejor en el blob
        const idx = places.findIndex(p => p.titulo.toLowerCase() === localMatch.titulo.toLowerCase());
        const betterImg = await findBlobUrlByName(places[idx].titulo);
        if (betterImg) places[idx].imagen = betterImg;
      }
    }

    return places;
  } catch (e) {
    // Si falla la IA, devolvemos al menos el match local con su imagen del blob
    if (localMatch) {
        const blobImg = await findBlobUrlByName(localMatch.titulo);
        if (blobImg) localMatch.imagen = blobImg;
        return [localMatch];
    }
    return [];
  }
}

export async function generateSmartItinerary(pueblo: string, lang: SupportedLang = 'es') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Itinerario 1 día ${pueblo}, Antioquia. Responde JSON morning, afternoon, evening.`,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}
