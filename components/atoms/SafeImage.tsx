
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Coffee, Mountain, Waves, Trees, 
  Compass, Loader2
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
    }
  }, [src, alt]);

  const getConfig = () => {
    const regionStyles: Record<string, { color: string, Icon: any }> = {
      'Suroeste': { color: '#4B3621', Icon: Coffee },
      'Oriente': { color: '#2D7A4C', Icon: Mountain },
      'Urabá': { color: '#1E40AF', Icon: Waves },
      'Norte': { color: '#166534', Icon: Trees },
      'Occidente': { color: '#D97706', Icon: Compass },
      'Valle de Aburrá': { color: '#059669', Icon: Sparkles },
    };
    return regionStyles[region as string] || regionStyles['Valle de Aburrá'];
  };

  const config = getConfig();

  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-slate-100 ${className}`}>
      {/* Estado de Carga / Shimmer */}
      {loading && !error && (
        <div className="absolute inset-0 z-10 bg-slate-200 animate-pulse flex flex-col items-center justify-center gap-3">
           <Loader2 className="animate-spin text-slate-400" size={24} />
           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Revelando Paisaje...</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!error && src ? (
          <motion.img
            key={src}
            src={src}
            alt={alt}
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              filter: loading ? 'blur(20px)' : 'blur(0px)',
              transition: { duration: 0.8, ease: "easeOut" }
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
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-50"
          >
            <div className="p-8 rounded-[40px] bg-white shadow-xl border border-slate-100 flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50" style={{ color: config.color }}>
                <config.Icon size={32} />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{region}</span>
                <h4 className="text-xl font-paisa tracking-tighter" style={{ color: config.color }}>{alt}</h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
