
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Coffee, Mountain, Waves, Trees, 
  Compass, Loader2, Image as ImageIcon, Zap, Database
} from 'lucide-react';
import { AntioquiaRegion } from '../../types';

interface SafeImageProps {
  src?: string | null | undefined;
  alt: string;
  className?: string;
  region?: AntioquiaRegion | string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className = "", region = "Valle de Aburrá" }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificamos si la imagen viene de nuestro nuevo Blob Store
  const isVercelBlob = src?.includes('vercel-storage.com');

  useEffect(() => {
    if (src) {
      setError(false);
      setLoading(true);
    } else {
      setLoading(false);
      setError(true);
    }
  }, [src]);

  const config = {
    'Suroeste': { color: '#4B3621', Icon: Coffee },
    'Oriente': { color: '#2D7A4C', Icon: Mountain },
    'Urabá': { color: '#1E40AF', Icon: Waves },
    'Norte': { color: '#166534', Icon: Trees },
    'Occidente': { color: '#D97706', Icon: Compass },
    'Valle de Aburrá': { color: '#059669', Icon: Sparkles },
  }[region as string] || { color: '#2D7A4C', Icon: ImageIcon };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-slate-50 ${className}`}>
      <AnimatePresence mode="wait">
        {loading && !error && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-slate-50"
          >
             <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-paisa-emerald/10 border-t-paisa-emerald animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Database size={16} className="text-paisa-gold" />
                </div>
             </div>
             <div className="space-y-1 text-center">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-paisa-emerald/40 block">Vercel Blob Active</span>
                <span className="text-[8px] font-bold text-slate-300 uppercase">Synchronizing Store...</span>
             </div>
          </motion.div>
        )}

        {!error && src ? (
          <div className="relative w-full h-full">
            <motion.img
              key={src}
              src={src}
              alt={alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError(true);
                setLoading(false);
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {isVercelBlob && !loading && (
              <div className="absolute bottom-4 right-4 z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-paisa-emerald/90 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                  <Database size={10} className="text-paisa-gold" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white">Verified Object</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div 
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-100 p-8"
          >
            <div className="flex flex-col items-center gap-4 text-center opacity-20">
              <config.Icon size={48} style={{ color: config.color }} />
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] mb-2">{region}</span>
                <h4 className="text-sm font-bold uppercase tracking-tighter">{alt}</h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
