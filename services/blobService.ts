
import { put, list, del } from '@vercel/blob';

const LOCAL_STORAGE_KEY = 'paisa_local_blob_cache';
const TOKEN_STORAGE_KEY = 'paisa_blob_token_override';

// Caché en memoria para evitar latencia
let cachedBlobs: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 30; // 30 segundos

export function getBlobToken(): string | null {
  if (typeof window !== 'undefined') {
    const manualToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (manualToken && manualToken.trim() !== '') return manualToken;
  }
  return process.env.BLOB_READ_WRITE_TOKEN || null;
}

export function saveManualToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    cachedBlobs = null;
    lastFetchTime = 0; // Forzar refresco
  }
}

export function clearManualToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    cachedBlobs = null;
  }
}

/**
 * Normalización extrema para búsquedas:
 * Quita tildes, extensiones, prefijos 'paisa-local' y caracteres raros.
 */
export const normalizeForSearch = (str: string) => {
  if (!str) return "";
  let clean = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Quitar extensiones
  clean = clean.replace(/\.(jpg|jpeg|png|webp|gif|avif)$/i, "");
  
  // Quitar prefijos comunes que el usuario o el sistema puedan poner
  clean = clean.replace(/paisa-local/g, "");
  
  // Dejar solo letras y números
  return clean.replace(/[^a-z0-9]/g, "").trim();
};

function getLocalInventory(): Array<{url: string, pathname: string, isLocal: boolean}> {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data).map((i: any) => ({ ...i, isLocal: true })) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Busca una URL de imagen con lógica difusa:
 * 'paisa-localGuatape.jpg' -> coincide con 'Guatapé'
 */
export async function findBlobUrlByName(name: string): Promise<string | null> {
  const searchTarget = normalizeForSearch(name);
  if (!searchTarget) return null;

  // 1. Buscar en LocalStorage (Caché local de subidas recientes)
  const localItems = getLocalInventory();
  const localMatch = localItems.find(i => normalizeForSearch(i.pathname).includes(searchTarget));
  if (localMatch) return localMatch.url;

  // 2. Buscar en la Nube (Vercel Blob)
  const token = getBlobToken();
  if (token) {
    try {
      if (!cachedBlobs || (Date.now() - lastFetchTime > CACHE_DURATION)) {
        const { blobs } = await list({ token });
        cachedBlobs = blobs;
        lastFetchTime = Date.now();
      }

      // Búsqueda inteligente: ¿El nombre normalizado del blob contiene el objetivo?
      const match = cachedBlobs.find(b => {
        const normalizedBlobName = normalizeForSearch(b.pathname);
        return normalizedBlobName.includes(searchTarget) || searchTarget.includes(normalizedBlobName);
      });
      
      if (match) return match.url;
    } catch (e) {
      console.warn("Bodega: Error buscando en la nube.", e);
    }
  }
  return null;
}

export async function uploadToVercelBlob(source: string | File, fileName: string): Promise<{url: string | null, error?: string, isLocal?: boolean}> {
  const token = getBlobToken();
  const cleanName = normalizeForSearch(fileName);

  try {
    let body: any;
    let previewUrl: string | null = null;

    if (source instanceof File) {
      body = await source.arrayBuffer();
      previewUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(source);
      });
    } else {
      previewUrl = source;
      const res = await fetch(source);
      if (!res.ok) throw new Error("No se pudo obtener la imagen del link.");
      body = await res.blob();
    }

    if (token) {
      // Usamos el prefijo con guión para consistencia
      const result = await put(`paisa-local-${cleanName}.png`, body, {
        access: 'public',
        token,
        addRandomSuffix: true,
      });
      
      cachedBlobs = null; 
      return { url: result.url, isLocal: false };
    }

    if (previewUrl) {
      const inventory = getLocalInventory();
      inventory.push({ url: previewUrl, pathname: `local/${cleanName}.png`, isLocal: true });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inventory));
      return { url: previewUrl, isLocal: true };
    }

    return { url: null, error: "Falta el Token." };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
}

export async function listPaisaBlobs() {
  const localItems = getLocalInventory();
  const token = getBlobToken();
  if (!token) return localItems;

  try {
    const { blobs } = await list({ token });
    cachedBlobs = blobs;
    lastFetchTime = Date.now();
    return [...localItems, ...blobs.map(b => ({ ...b, isLocal: false }))];
  } catch (error) {
    return localItems;
  }
}

export function deleteLocalBlob(pathname: string) {
  const inventory = getLocalInventory();
  const filtered = inventory.filter(i => i.pathname !== pathname);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
}
