
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Coffee, Mountain, Waves, Trees, 
  Compass, Loader2, MapPin, Wind, Sun, ShieldCheck, Plus, Utensils
} from 'lucide-react';
import { AntioquiaRegion } from '../../types';

interface SafeImageProps {
  src?: string | null | undefined;
  alt: string;
  className?: string;
  region?: AntioquiaRegion | string;
  type?: 'place' | 'dish' | 'experience' | string;
  isThumbnail?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  region = "Valle de Aburrá", 
  type = 'place',
  isThumbnail = false
}) => {
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

  const regionConfig = {
    'Suroeste': { color: '#3E2A19', Icon: Coffee, label: 'Tierra Cafetera', grad: 'from-amber-100 to-amber-50' },
    'Oriente': { color: '#0369a1', Icon: Waves, label: 'Aguas del Oriente', grad: 'from-blue-100 to-blue-50' },
    'Urabá': { color: '#1e40af', Icon: Wind, label: 'Mar de Antioquia', grad: 'from-blue-200 to-blue-50' },
    'Norte': { color: '#065f46', Icon: Trees, label: 'Ruta Lechera', grad: 'from-green-100 to-green-50' },
    'Occidente': { color: '#b45309', Icon: Sun, label: 'Sol de Occidente', grad: 'from-orange-100 to-orange-50' },
    'Valle de Aburrá': { color: '#065f46', Icon: Sparkles, label: 'Corazón Urbano', grad: 'from-emerald-100 to-emerald-50' },
    'Nordeste': { color: '#B45309', Icon: Mountain, label: 'Minería y Montaña', grad: 'from-amber-200 to-amber-50' },
    'Bajo Cauca': { color: '#1E3A8A', Icon: Waves, label: 'Riberas del Cauca', grad: 'from-blue-200 to-blue-100' },
    'Magdalena Medio': { color: '#92400E', Icon: Sun, label: 'Calor de Río', grad: 'from-yellow-100 to-orange-50' },
  }[region as string];

  const typeConfig = {
    'dish': { color: '#B45309', Icon: Utensils, label: 'Gastronomía', grad: 'from-orange-100 to-amber-50' },
    'experience': { color: '#6366F1', Icon: Sparkles, label: 'Experiencia', grad: 'from-indigo-100 to-blue-50' },
    'place': { color: '#1B4D31', Icon: Mountain, label: 'Pueblo Antioqueño', grad: 'from-slate-100 to-slate-50' }
  }[type as string] || { color: '#1B4D31', Icon: Mountain, label: 'Pueblo Antioqueño', grad: 'from-slate-100 to-slate-50' };

  const config = regionConfig || typeConfig;

  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-slate-100 ${className}`}>
      <AnimatePresence mode="wait">
        {loading && !error && (
          <motion.div 
            key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white"
          >
             <Loader2 className="animate-spin text-paisa-emerald" size={isThumbnail ? 20 : 32} />
             {!isThumbnail && <span className="text-[10px] font-black uppercase tracking-[0.3em] text-paisa-emerald">Sincronizando...</span>}
          </motion.div>
        )}

        {!error && src ? (
          <motion.img
            key={src} src={src} alt={alt}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: loading ? 0 : 1, scale: loading ? 1.1 : 1 }}
            transition={{ duration: 0.8 }}
            onLoad={() => setLoading(false)}
            onError={() => { setError(true); setLoading(false); }}
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.div 
            key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${config.grad} ${isThumbnail ? 'p-2' : 'p-8'}`}
          >
            <div className={`flex flex-col items-center text-center ${isThumbnail ? 'gap-1' : 'gap-8'}`}>
              <div className="relative group">
                {!isThumbnail && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-4 -right-4 text-slate-950/20"
                    >
                      <Plus size={24} strokeWidth={3} />
                    </motion.div>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border border-dashed border-slate-950/10 rounded-full scale-150"
                    />
                  </>
                )}
                
                <div className={`relative z-10 rounded-[28px] bg-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] flex items-center justify-center border-2 border-white ${isThumbnail ? 'w-12 h-12' : 'w-24 h-24'}`}>
                  <config.Icon size={isThumbnail ? 24 : 48} style={{ color: config.color }} strokeWidth={2.5} />
                  <div className={`absolute -top-1 -right-1 bg-emerald-500 rounded-full text-white shadow-lg flex items-center justify-center ${isThumbnail ? 'p-0.5' : 'p-1.5'}`}>
                    <ShieldCheck size={isThumbnail ? 8 : 12} strokeWidth={3} />
                  </div>
                </div>
              </div>

              {!isThumbnail && (
                <div className="space-y-4 relative z-10">
                  <span className="block text-[11px] font-black uppercase tracking-[0.4em] text-slate-950/60">{region}</span>
                  <h4 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-950 leading-[0.85] max-w-[240px] drop-shadow-sm">{alt}</h4>
                  <div className="w-16 h-1.5 bg-paisa-gold/60 mx-auto rounded-full shadow-sm" />
                  <div className="flex items-center justify-center gap-2">
                     <Sparkles size={12} className="text-paisa-gold" />
                     <p className="text-[11px] font-black uppercase tracking-widest text-[#B48444] drop-shadow-sm">{config.label}</p>
                  </div>
                </div>
              )}
            </div>
            
            {!isThumbnail && (
              <div className="absolute bottom-10 left-10 opacity-20">
                 <Compass size={24} className="text-paisa-emerald animate-pulse" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
