
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './')
      }
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || ''),
      'process.env.UNSPLASH_API_KEY': JSON.stringify(env.VITE_UNSPLASH_API_KEY || env.UNSPLASH_API_KEY || ''),
      'process.env.PEXELS_API_KEY': JSON.stringify(env.VITE_PEXELS_API_KEY || env.PEXELS_API_KEY || ''),
      'process.env.BLOB_READ_WRITE_TOKEN': JSON.stringify(env.VITE_BLOB_READ_WRITE_TOKEN || env.BLOB_READ_WRITE_TOKEN || ''),
      'process.env': JSON.stringify({
        API_KEY: env.VITE_API_KEY || env.API_KEY || '',
        UNSPLASH_API_KEY: env.VITE_UNSPLASH_API_KEY || env.UNSPLASH_API_KEY || '',
        PEXELS_API_KEY: env.VITE_PEXELS_API_KEY || env.PEXELS_API_KEY || '',
        BLOB_READ_WRITE_TOKEN: env.VITE_BLOB_READ_WRITE_TOKEN || env.BLOB_READ_WRITE_TOKEN || '',
        NODE_ENV: mode
      })
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html')
        }
      }
    }
  };
});
