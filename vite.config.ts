
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Intentamos encontrar la URL de Supabase en varias posibles variables
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || env.URL || env.DATABASE_URL || '';
  // Intentamos encontrar la Key de Supabase en varias posibles variables
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || env.ANON_KEY || env.SERVICE_ROLE_KEY || '';
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './')
      }
    },
    define: {
      // Shimming process.env para que el SDK y el código actual no fallen
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || ''),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
      // Inyectamos también en import.meta.env por si acaso
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey)
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
    }
  };
});
