
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=1200";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className = "" }) => {
  const [imgSrc, setImgSrc] = useState<string>(src || FALLBACK_IMG);
  const [loading, setLoading] = useState(true);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setLoading(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-slate-100 min-h-[100px] ${className}`}>
      <AnimatePresence>
        {loading && (
          <motion.div 
            key="shimmer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-slate-200"
          >
            <motion.div 
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-full h-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: loading ? 0 : 1, 
          scale: loading ? 1.05 : 1
        }}
        src={imgSrc} 
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (errorCount < 1) {
            setImgSrc(FALLBACK_IMG);
            setErrorCount(1);
          } else {
            setLoading(false);
          }
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
