
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLang, PlaceData, AntioquiaRegion, DishData, CultureExperience } from "../types";
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
  } catch (e) { 
    console.error("Error parseando JSON de Gemini:", e);
    return null; 
  }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<any[]> {
  const localMatch = getLocalPlace(query);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Proporciona información turística y logística real para: "${query}, Antioquia, Colombia". Idioma: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            places: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  titulo: { type: Type.STRING },
                  region: { type: Type.STRING, description: "Subregión de Antioquia (Oriente, Suroeste, etc)" },
                  descripcion: { type: Type.STRING },
                  imgKeyword: { type: Type.STRING },
                  viaEstado: { type: Type.STRING, description: "Estado actual de la vía (Despejada, Obras)" },
                  pavementType: { type: Type.STRING, description: "Pavimentada, Placa Huella o Destapada" },
                  tiempoDesdeMedellin: { type: Type.STRING },
                  budget: {
                    type: Type.OBJECT,
                    properties: {
                      busTicket: { type: Type.NUMBER },
                      averageMeal: { type: Type.NUMBER }
                    }
                  }
                },
                required: ["titulo", "region", "descripcion"]
              }
            },
            dishes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nombre: { type: Type.STRING },
                  descripcion: { type: Type.STRING },
                  categoria: { type: Type.STRING },
                  precioLocalEstimated: { type: Type.NUMBER }
                }
              }
            }
          }
        },
        systemInstruction: `Eres Arriero Pro. Tu misión es proveer datos tácticos precisos sobre Antioquia. Siempre usa Google Search para verificar precios de pasajes y estados de vías actuales.`
      },
    });

    const rawData = safeJsonParse(response.text);
    
    // Extracción obligatoria de enlaces de grounding (Google Search Rules)
    const groundingLinks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Fuente de verificación",
      uri: chunk.web?.uri || "#",
      type: 'news'
    })) || [];

    if (!rawData) return localMatch ? [localMatch] : [];

    const results: any[] = [];

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
          terminalInfo: data.region?.includes('Oriente') || data.region?.includes('Norte') ? "Terminal del Norte" : "Terminal del Sur",
          accessibility: { score: 85, wheelchairFriendly: true },
          security: { status: 'Seguro' },
          tiempoDesdeMedellin: data.tiempoDesdeMedellin || "2-3 Horas",
          groundingLinks: groundingLinks // Inyectamos las fuentes verificadas
        });
      }
    }

    if (rawData.dishes) {
      rawData.dishes.forEach((d: any) => {
        results.push({ ...d, type: 'dish' });
      });
    }

    if (localMatch && !results.some(r => r.type === 'place' && r.titulo.toLowerCase().includes(localMatch.titulo.toLowerCase()))) {
      results.unshift(localMatch);
    }

    return results;
  } catch (e) {
    console.error("Fallo crítico en búsqueda:", e);
    return localMatch ? [localMatch] : [];
  }
}

export async function generateSmartItinerary(pueblo: string, lang: SupportedLang = 'es') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crea un itinerario de 3 momentos para ${pueblo}, Antioquia. Idioma: ${lang}.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            morning: { type: Type.OBJECT, properties: { activity: { type: Type.STRING }, tip: { type: Type.STRING } } },
            afternoon: { type: Type.OBJECT, properties: { activity: { type: Type.STRING }, tip: { type: Type.STRING } } },
            evening: { type: Type.OBJECT, properties: { activity: { type: Type.STRING }, tip: { type: Type.STRING } } }
          }
        }
      }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}

export async function generateTacticalRecommendations(pueblo: string, lang: SupportedLang = 'es') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dame 5 tips tácticos secretos para visitar ${pueblo}, Antioquia. Idioma: ${lang}.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}
