
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // En Vercel, cargamos todas las variables (prefijadas y no prefijadas)
  // El tercer parámetro '' permite cargar variables sin el prefijo VITE_
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './')
      }
    },
    define: {
      // Mapeo manual para asegurar disponibilidad en el bundle de cliente
      // Priorizamos las versiones VITE_ por convención, pero permitimos las directas de Vercel
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || ''),
      'process.env.UNSPLASH_API_KEY': JSON.stringify(env.VITE_UNSPLASH_API_KEY || env.UNSPLASH_API_KEY || ''),
      'process.env.PEXELS_API_KEY': JSON.stringify(env.VITE_PEXELS_API_KEY || env.PEXELS_API_KEY || ''),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || env.SUPABASE_URL || ''),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || ''),
      // Polyfill para process.env general por si alguna librería lo requiere
      'process.env': JSON.stringify({
        API_KEY: env.VITE_API_KEY || env.API_KEY || '',
        UNSPLASH_API_KEY: env.VITE_UNSPLASH_API_KEY || env.UNSPLASH_API_KEY || '',
        PEXELS_API_KEY: env.VITE_PEXELS_API_KEY || env.PEXELS_API_KEY || '',
        NODE_ENV: mode
      })
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
    }
  };
});
