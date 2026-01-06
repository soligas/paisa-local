
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Utensils, Info, CheckCircle2, Wallet, Star, ChefHat, Leaf } from 'lucide-react';
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
      whileHover={{ y: -12 }}
      className="bg-white rounded-[56px] overflow-hidden border border-slate-100 shadow-paisa-xl group flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <SafeImage src={`${dish.imagen}?auto=format&fit=crop&q=80&w=1000`} alt={dish.nombre} className="w-full h-full transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(dish.nombre); }}
          className={`absolute top-8 right-8 p-5 rounded-full backdrop-blur-xl border transition-all duration-500 ${isFavorite ? 'bg-red-500 text-white border-red-400 shadow-xl scale-110' : 'bg-white/10 border-white/20 text-white hover:bg-white/30'}`}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-2 pointer-events-none">
           <div className="flex items-center gap-2">
              <Badge color="gold" className="px-3 py-1">ORIGEN LOCAL</Badge>
              {dish.economiaCircular && (
                <div className="p-2 rounded-full bg-emerald-500/80 text-white backdrop-blur-md">
                   <Leaf size={10} />
                </div>
              )}
           </div>
           <h4 className="text-white text-4xl font-black uppercase tracking-tighter leading-none">{dish.nombre}</h4>
        </div>
      </div>

      <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
        <div className="space-y-4">
          <p className="text-base font-serif italic text-slate-500 leading-relaxed">
            "{dish.descripcion}"
          </p>

          {/* NUEVA SECCIÓN: PRODUCTORES DE ORIGEN */}
          {dish.productoresOrigen && dish.productoresOrigen.length > 0 && (
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
               <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Productor de Origen</p>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-paisa-gold/10 text-paisa-gold flex items-center justify-center">
                    <ChefHat size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase leading-none">{dish.productoresOrigen[0].nombre}</p>
                    <p className="text-[10px] italic text-slate-400">Finca {dish.productoresOrigen[0].finca}</p>
                  </div>
               </div>
            </div>
          )}
        </div>
        
        <div className="pt-8 border-t border-slate-50 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase opacity-30 tracking-widest">Precio Estimado</span>
              <div className="flex items-center gap-2 text-paisa-emerald">
                <Wallet size={18} />
                <span className="text-2xl font-black">${dish.precioLocalEstimated}</span>
              </div>
            </div>
            {dish.precioVerificado && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl text-[9px] font-black text-paisa-emerald uppercase tracking-widest">
                <CheckCircle2 size={12} /> Verificado
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-slate-400">
             <Info size={14} className="text-paisa-gold" />
             <span className="text-[10px] font-bold uppercase tracking-widest leading-none truncate">Dónde: {dish.dondeProbar}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
