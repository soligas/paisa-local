
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Coffee, Mountain, Waves, Trees, 
  Compass, Loader2, Image as ImageIcon
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
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-slate-50"
          >
             <Loader2 className="animate-spin text-slate-200" size={24} />
             <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300">Cargando...</span>
          </motion.div>
        )}

        {!error && src ? (
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
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.div 
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-100 p-8"
          >
            <div className="flex flex-col items-center gap-4 text-center opacity-10">
              <config.Icon size={48} style={{ color: config.color }} />
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.4em] mb-2">{region}</span>
                <h4 className="text-sm font-bold uppercase tracking-tighter">{alt}</h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
