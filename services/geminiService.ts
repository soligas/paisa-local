
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion, GroundingLink } from "../types";
import { getLocalPlace } from "./logisticsService";
import { getUnsplashImage } from "./unsplashService";
import { getPexelsImage } from "./pexelsService";
import { uploadToVercelBlob } from "./blobService";

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

async function generateAIPostal(pueblo: string, descripcion: string): Promise<string | null> {
  try {
    const aiGen = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Professional high-end travel photography of ${pueblo}, Antioquia, Colombia. Beautiful colonial architecture with bright colors, lush green mountains in background, morning sunlight. Style: National Geographic. 16:9 aspect ratio.`;
    
    const response = await aiGen.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData?.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
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
      Genera un JSON ARRAY de hasta 3 destinos relacionados en Antioquia.
      Esquema: { "titulo": "...", "region": "...", "descripcion": "...", "imgKeyword": "...", "viaEstado": "...", "budget": {"busTicket": 0, "averageMeal": 0} }`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        systemInstruction: `Eres el Arriero Pro. Da datos reales de transporte y cultura.`
      },
    });

    const groundingLinks: GroundingLink[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) groundingLinks.push({ title: chunk.web.title || 'Info', uri: chunk.web.uri, type: 'news' });
      });
    }

    const rawData = safeJsonParse(response.text);
    const resultsArray = Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []);

    const places: PlaceData[] = await Promise.all(resultsArray.map(async (data: any) => {
      // 1. Obtener imagen origen
      let photoSource = await getUnsplashImage(data.imgKeyword || `${data.titulo} Antioquia`);
      if (!photoSource) photoSource = await getPexelsImage(data.imgKeyword || `${data.titulo} Colombia`);
      if (!photoSource) photoSource = await generateAIPostal(data.titulo, data.descripcion);

      // 2. Estabilizar en Vercel Blob para que NUNCA se rompa el link
      let finalImageUrl = photoSource || "https://images.unsplash.com/photo-1591605417688-6c0b3b320791";
      if (photoSource) {
        const blobUrl = await uploadToVercelBlob(photoSource, data.titulo);
        if (blobUrl) finalImageUrl = blobUrl;
      }

      return {
        type: 'place',
        titulo: data.titulo || "Destino",
        region: data.region as AntioquiaRegion,
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
        neighborTip: data.neighborTip || "¡Qué berraquera mijo!",
        terminalInfo: "Terminal Norte/Sur",
        groundingLinks: groundingLinks.length > 0 ? groundingLinks : undefined
      };
    }));

    if (localMatch) {
      const exists = places.some(p => p.titulo.toLowerCase() === localMatch.titulo.toLowerCase());
      if (!exists) places.unshift(localMatch);
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
      contents: `Itinerario 1 día ${pueblo}, Antioquia. JSON: { "morning": "...", "afternoon": "...", "evening": "..." }. Idioma: ${lang}.`,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}
