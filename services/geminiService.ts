
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion, DishData, CultureExperience } from "../types";
import { getLocalPlace } from "./logisticsService";
import { getUnsplashImage } from "./unsplashService";
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
  } catch (e) { return null; }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<any[]> {
  const localMatch = getLocalPlace(query);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `SEARCH QUERY: "${query}, Antioquia, Colombia". Language: ${lang}.
      Urgente: Genera un mix de información turística táctica. Devuelve un objeto JSON con:
      1. "places": [max 1 objeto con titulo, region, descripcion, imgKeyword, viaEstado, pavementType, budget: {busTicket, averageMeal}, foodTip, cultureTip, logisticsTip, peopleTip]
      2. "dishes": [max 2 objetos con nombre, descripcion, categoria, precioLocalEstimated, precioVerificado, economiaCircular]
      3. "experiences": [max 2 objetos con titulo, descripcion, categoria, impactoSocial, ubicacion]
      
      IMPORTANTE: 'viaEstado' debe indicar si está despejada o hay obras. 'pavementType' debe indicar si es Pavimentada, Destapada o Placa Huella. Los precios en COP.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        systemInstruction: `Eres Arriero Pro. Tu misión es proveer datos tácticos y ricos sobre el turismo en Antioquia. Combina sabiduría popular con precisión técnica extrema sobre logística de transporte.`
      },
    });

    const rawData = safeJsonParse(response.text);
    if (!rawData) return localMatch ? [localMatch] : [];

    const results: any[] = [];

    // Procesar Lugares (PlaceCard)
    if (rawData.places) {
      for (const data of rawData.places) {
        let img = await findBlobUrlByName(data.titulo) || await getUnsplashImage(data.imgKeyword || `${data.titulo} Antioquia`);
        results.push({
          type: 'place',
          titulo: data.titulo,
          region: data.region || "Valle de Aburrá",
          descripcion: data.descripcion,
          imagen: img || "https://images.unsplash.com/photo-1591605417688-6c0b3b320791",
          viaEstado: data.viaEstado || "Despejada",
          pavementType: data.pavementType || "Pavimentada",
          budget: data.budget || { busTicket: 35000, averageMeal: 25000 },
          foodTip: data.foodTip,
          cultureTip: data.cultureTip,
          logisticsTip: data.logisticsTip,
          peopleTip: data.peopleTip,
          terminalInfo: data.region === 'Oriente' || data.region === 'Norte' ? "Terminal del Norte" : "Terminal del Sur",
          accessibility: { score: 85, wheelchairFriendly: true },
          security: { status: 'Seguro' },
          tiempoDesdeMedellin: data.tiempoDesdeMedellin || "2-3 Horas"
        });
      }
    }

    // Procesar Platos (DishCard)
    if (rawData.dishes) {
      rawData.dishes.forEach((d: any) => {
        results.push({ ...d, type: 'dish' });
      });
    }

    // Procesar Experiencias (ExperienceCard)
    if (rawData.experiences) {
      rawData.experiences.forEach((e: any) => {
        results.push({ ...e, type: 'experience' });
      });
    }

    // Priorizar match local exacto si existe
    if (localMatch && !results.some(r => r.type === 'place' && r.titulo.toLowerCase() === localMatch.titulo.toLowerCase())) {
      results.unshift(localMatch);
    }

    return results;
  } catch (e) {
    return localMatch ? [localMatch] : [];
  }
}

export async function generateSmartItinerary(pueblo: string, lang: SupportedLang = 'es') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crea un itinerario de 3 momentos (mañana, tarde, noche) para ${pueblo}, Antioquia. Idioma: ${lang}. JSON: {"morning": {"activity": "...", "tip": "..."}, "afternoon": {...}, "evening": {...}}`,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}

export async function generateTacticalRecommendations(pueblo: string, lang: SupportedLang = 'es') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dame 5 tips tácticos secretos para visitar ${pueblo}, Antioquia. Idioma: ${lang}. Devuelve un array JSON de strings.`,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}
