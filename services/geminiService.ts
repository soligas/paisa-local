
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLang, PlaceData, GroundingLink } from "../types";
import { getLocalPlace } from "./logisticsService";
import { getUnsplashImage } from "./unsplashService";
import { findBlobUrlByName } from "./blobService";

function safeJsonParse(text: string) {
  if (!text) return null;
  try {
    let cleaned = text.trim();
    cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
    const startIdx = cleaned.search(/[\{\[]/);
    const lastBracket = cleaned.lastIndexOf(']');
    const lastBrace = cleaned.lastIndexOf('}');
    const endIdx = Math.max(lastBracket, lastBrace);
    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return null;
    return JSON.parse(cleaned.substring(startIdx, endIdx + 1));
  } catch (e) { return null; }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<any[]> {
  const localMatch = getLocalPlace(query);
  if (!process.env.API_KEY) return localMatch ? [localMatch] : [];
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Realiza una auditoría táctica de viaje para: "${query}, Antioquia". Idioma: ${lang}.
      Necesito detalles CRUDOS para un turista:
      1. Logística: Buses, frecuencia, terminal y movilidad local.
      2. Economía: Cajeros (ATM), si aceptan tarjeta, nota táctica sobre pagos (efectivo vs QR Bancolombia), lugares específicos de cambio de moneda (Western Union o bancos), puntos específicos de retiro y qué día es el mercado.
      3. Gastronomía: 3 platos típicos imperdibles con precio estimado.
      4. Aventura: 3 charcos/rutas con dificultad y equipo.
      5. Maleta: 5 cosas esenciales.`,
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
                  region: { type: Type.STRING },
                  descripcion: { type: Type.STRING },
                  busFrequency: { type: Type.STRING },
                  atmAvailable: { type: Type.BOOLEAN },
                  marketDay: { type: Type.STRING },
                  paymentMethods: {
                    type: Type.OBJECT,
                    properties: {
                      cashOnly: { type: Type.BOOLEAN },
                      cardAcceptance: { type: Type.STRING },
                      tacticalNote: { type: Type.STRING }
                    }
                  },
                  financialSpots: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        nombre: { type: Type.STRING },
                        tipo: { type: Type.STRING, enum: ["ATM", "CORRESPONSAL", "CAMBIO", "BANCO"] },
                        nota: { type: Type.STRING }
                      }
                    }
                  },
                  gastronomia: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        nombre: { type: Type.STRING },
                        precio: { type: Type.NUMBER },
                        descripcion: { type: Type.STRING }
                      }
                    }
                  },
                  localMobility: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER }
                    }
                  },
                  packingList: { type: Type.ARRAY, items: { type: Type.STRING } },
                  budget: {
                    type: Type.OBJECT,
                    properties: {
                      busTicket: { type: Type.NUMBER },
                      averageMeal: { type: Type.NUMBER },
                      dailyStay: { type: Type.NUMBER }
                    }
                  },
                  charcosTacticos: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        nombre: { type: Type.STRING },
                        descripcion: { type: Type.STRING },
                        dificultad: { type: Type.STRING },
                        requiereGuia: { type: Type.BOOLEAN },
                        equipoNecesario: { type: Type.ARRAY, items: { type: Type.STRING } },
                        mapUrl: { type: Type.STRING },
                        videoUrl: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        systemInstruction: "Eres Arriero Pro. Sé específico sobre los métodos de pago. En muchos pueblos de Antioquia manda el efectivo o el QR de Bancolombia. Identifica casas de cambio reales o corresponsales bancarios clave."
      },
    });

    const groundingLinks: GroundingLink[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingLinks.push({
            title: chunk.web.title || 'Referencia',
            uri: chunk.web.uri,
            type: 'news'
          });
        }
      });
    }

    const rawData = safeJsonParse(response.text || "");
    const results: any[] = [];
    if (rawData?.places) {
      for (const data of rawData.places) {
        const img = await findBlobUrlByName(data.titulo) || await getUnsplashImage(`${data.titulo} Antioquia`);
        results.push({
          type: 'place',
          ...data,
          imagen: img || "https://images.unsplash.com/photo-1591605417688-6c0b3b320791",
          terminalInfo: data.region?.toLowerCase().includes('oriente') ? "Terminal del Norte" : "Terminal del Sur",
          groundingLinks
        });
      }
    }
    return results.length === 0 && localMatch ? [localMatch] : results;
  } catch (e) { return localMatch ? [localMatch] : []; }
}

export async function generateSmartItinerary(place: string, lang: SupportedLang = 'es'): Promise<any> {
  if (!process.env.API_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crea un itinerario táctico de un día (mañana, tarde, noche) para un viaje a ${place}, Antioquia. Incluye horas sugeridas, actividades recomendadas y un 'tip del arriero' por cada parada. Idioma: ${lang}.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hora: { type: Type.STRING },
                  actividad: { type: Type.STRING },
                  lugar: { type: Type.STRING },
                  tip: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return safeJsonParse(response.text);
  } catch (e) { return null; }
}

export async function generateTacticalRecommendations(place: string, lang: SupportedLang = 'es'): Promise<string[] | null> {
  if (!process.env.API_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dime 5 secretos o 'tips del arriero' que solo un local sabe sobre ${place}, Antioquia. Se muy específico sobre lugares, rutas o comida.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    const data = safeJsonParse(response.text);
    return data?.tips || null;
  } catch (e) { return null; }
}
