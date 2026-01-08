
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Utensils, Info, CheckCircle2, Wallet, Leaf, MapPin, Camera, Search } from 'lucide-react';
import { DishData } from '../../types';
import { SafeImage } from '../atoms/SafeImage';
import { Badge } from '../atoms/Badge';

interface DishCardProps {
  dish: DishData;
  isFavorite: boolean;
  onToggleFavorite: (name: string) => void;
  onClick?: () => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, isFavorite, onToggleFavorite, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl group flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48">
        <SafeImage alt={dish.nombre} type="dish" className="w-full h-full group-hover:scale-110 transition-transform duration-700" />
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(dish.nombre); }}
          className={`absolute top-6 right-6 p-4 rounded-full backdrop-blur-md border transition-all ${isFavorite ? 'bg-red-500 text-white border-red-400' : 'bg-white/80 border-slate-100 text-slate-300'}`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge color="gold">{dish.categoria}</Badge>
            {dish.economiaCircular && <Badge color="emerald">Sostenible</Badge>}
          </div>
          <h4 className="text-2xl font-black uppercase tracking-tight text-slate-900 group-hover:text-paisa-emerald transition-colors">{dish.nombre}</h4>
          <p className="text-sm font-serif italic text-slate-500 line-clamp-2">"{dish.descripcion}"</p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-paisa-emerald">
              <Wallet size={16} />
              <span className="text-xl font-black">${dish.precioLocalEstimated}</span>
            </div>
            {dish.precioVerificado && <CheckCircle2 size={16} className="text-emerald-500" />}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
             <a 
                href={`https://www.google.com/search?q=${dish.nombre}+Antioquia+receta+fotos&tbm=isch`} 
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-paisa-emerald hover:bg-emerald-50 transition-all"
              >
                <Camera size={12} /> Ver Fotos
              </a>
              <a 
                href={`https://www.google.com/search?q=donde+comer+${dish.nombre}+en+Antioquia`} 
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
              >
                <MapPin size={12} /> Dónde Probar
              </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
