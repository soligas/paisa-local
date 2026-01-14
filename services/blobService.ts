
import { put } from '@vercel/blob';

/**
 * Servicio Táctico Paisa de Vercel Blob
 * Esta función toma un recurso (URL o Base64) y lo guarda permanentemente
 * en tu almacenamiento de objetos de Vercel.
 */
export async function uploadToVercelBlob(source: string, fileName: string): Promise<string | null> {
  const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

  if (!BLOB_TOKEN) {
    console.warn("⚠️ Vercel Blob Token no configurado. Mijo, revisa tus variables de entorno.");
    return null;
  }

  try {
    let body: Blob | Uint8Array;

    if (source.startsWith('data:image')) {
      // Manejo de imágenes generadas por IA (Base64)
      const parts = source.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      body = new Blob([u8arr], { type: mime });
    } else {
      // Manejo de imágenes de stock (URLs externas)
      // Usamos un proxy o fetch directo si el origen lo permite
      const response = await fetch(source);
      if (!response.ok) throw new Error("Error descargando imagen mijo.");
      body = await response.blob();
    }

    // El nombre del archivo debe ser limpio para evitar errores de URL
    const safeName = `paisa-local/${fileName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;

    const { url } = await put(safeName, body, {
      access: 'public',
      token: BLOB_TOKEN,
      addRandomSuffix: true, // Evita colisiones de nombres
    });

    console.debug(`🚀 Imagen estabilizada en Blob: ${url}`);
    return url;
  } catch (error) {
    console.error("❌ Falló la subida al Blob mijo:", error);
    return null;
  }
}
