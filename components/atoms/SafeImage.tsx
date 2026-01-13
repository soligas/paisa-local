
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
  type?: 'place' | 'dish' | 'experience';
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className = "", region = "Valle de Aburrá", type = 'place' }) => {
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
    <div className={`relative overflow-hidden flex items-center justify-center bg-slate-100 ${className}`}>
      <AnimatePresence mode="wait">
        {loading && !error && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-slate-100 flex flex-col items-center justify-center gap-2"
          >
             <Loader2 className="animate-spin text-slate-300" size={24} />
             <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Cargando Postal...</span>
          </motion.div>
        )}

        {!error && src ? (
          <motion.img
            key={src}
            src={src}
            alt={alt}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: loading ? 0 : 1, 
              scale: loading ? 1.1 : 1,
              transition: { duration: 0.6 }
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <motion.div 
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-50 p-6"
          >
            <div className="flex flex-col items-center gap-3 text-center opacity-30">
              <config.Icon size={32} style={{ color: config.color }} />
              <div>
                <span className="block text-[8px] font-black uppercase tracking-[0.2em] mb-1">{region}</span>
                <h4 className="text-xs font-bold uppercase tracking-tighter">{alt}</h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
