
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
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `DESTINATION: "${query}, Antioquia, Colombia". 
      Language: ${lang}.
      Generate a JSON ARRAY (max 2-3 items). 
      IMPORTANT: Translate the description and all tips into ${lang}.
      Structure: { 
        "titulo": "...", 
        "region": "...", 
        "descripcion": "Short description in ${lang}", 
        "imgKeyword": "search term", 
        "viaEstado": "Road status in ${lang}", 
        "budget": {"busTicket": 0, "averageMeal": 0},
        "foodTip": "Food tip in ${lang}", 
        "cultureTip": "Culture tip in ${lang}", 
        "logisticsTip": "Logistics tip in ${lang}", 
        "peopleTip": "People tip in ${lang}"
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        systemInstruction: `You are the Arriero Pro. You specialize in Antioquia tourism. Your job is to provide accurate, tactical travel data. Even if the data is local, all text in the JSON must be in ${lang}. Be very professional but keep the Paisa spirit. NEVER mention the current year or specific dates.`
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
      let finalImageUrl = await findBlobUrlByName(data.titulo);

      if (!finalImageUrl) {
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
      contents: `Generate a tactical tourist itinerary for one day in ${pueblo}, Antioquia. 
      Language for output: ${lang}.
      Must be a JSON object with 3 key moments (morning, afternoon, evening). 
      Each moment must have 'activity' (short, engaging string in ${lang}) and 'tip' (short local tip in ${lang}).
      Example: {"8:00 AM": {"activity": "Coffee at the main square", "tip": "Try Doña Rosa's coffee"}}`,
      config: { 
        responseMimeType: "application/json",
        systemInstruction: `You are an expert guide for Arriero Pro. Your output must be entirely in ${lang}. Never mention current year or specific dates.`
      }
    });
    return safeJsonParse(response.text);
  } catch (e) { 
    console.error("Error generating itinerary:", e);
    return null; 
  }
}

export async function generateTacticalRecommendations(pueblo: string, lang: SupportedLang = 'es') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 tactical and practical recommendations for visiting ${pueblo}, Antioquia. 
      Language for output: ${lang}.
      CRITICAL: One recommendation MUST be about a lesser-known but excellent local hostel, lodge, or accommodation (a "hidden gem" that travelers usually miss).
      Other recommendations should cover: Safety (tactical advice), Local Food/Drink, Best spot for a non-touristy photo, and a secret Arriero tip.
      Must be a JSON ARRAY of strings in ${lang}.`,
      config: { 
        responseMimeType: "application/json",
        systemInstruction: `You are the Arriero Pro. You know every secret corner, charco, and hostel in Antioquia. Your output must be authentic, providing value beyond typical search results. Use the language: ${lang}.`
      }
    });
    return safeJsonParse(response.text);
  } catch (e) { 
    console.error("Error generating recommendations:", e);
    return null; 
  }
}
