
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalCarouselProps {
  children?: React.ReactNode;
}

export const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 500;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full group py-4">
      {/* Botones de Accesibilidad con mayor visibilidad */}
      <button 
        onClick={() => scroll('left')}
        aria-label="Anterior"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/95 backdrop-blur-xl shadow-2xl flex items-center justify-center text-paisa-emerald border border-slate-100 hover:scale-110 active:scale-90 transition-all md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronLeft size={28} strokeWidth={3} />
      </button>

      <button 
        onClick={() => scroll('right')}
        aria-label="Siguiente"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/95 backdrop-blur-xl shadow-2xl flex items-center justify-center text-paisa-emerald border border-slate-100 hover:scale-110 active:scale-90 transition-all md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronRight size={28} strokeWidth={3} />
      </button>

      <div 
        ref={scrollRef}
        className="overflow-x-auto pb-12 no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth snap-x"
      >
        <div className="flex gap-6 md:gap-10 min-w-full px-8">
          {React.Children.map(children, child => (
            <div className="snap-start">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
