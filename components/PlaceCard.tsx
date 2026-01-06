
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Added Sparkles to the imports below
import { 
  MapPin, Clock, Wifi, Car, AlertTriangle, Heart, 
  HeartHandshake, Zap, Star, Users, X, Loader2, Info, ExternalLink, Award, CheckCircle, Bus, Wallet, Shield, Sparkles
} from 'lucide-react';
import { PlaceData, SupportedLang } from '../types';
import { Badge } from './atoms/Badge';
import { SafeImage } from './atoms/SafeImage';
import { getPlaceUGC, UGCContent } from '../services/supabaseService';
import { Button } from './atoms/Button';

interface PlaceCardProps {
  data: PlaceData & { sources?: any[] };
  lang: SupportedLang;
  i18n: any;
  isFavorite: boolean;
  isVisited?: boolean;
  onToggleFavorite: (title: string) => void;
  onToggleVisited?: (title: string) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ 
  data, isFavorite, isVisited, onToggleFavorite, onToggleVisited 
}) => {
  const [feed, setFeed] = useState<UGCContent[]>([]);
  const roadColor = data.viaEstado === 'Despejada' ? 'emerald' : data.viaEstado === 'Cerrada' ? 'red' : 'gold';

  useEffect(() => {
    loadUGC();
  }, [data.titulo]);

  const loadUGC = async () => {
    const results = await getPlaceUGC(data.titulo);
    setFeed(results);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative aspect-[4/3] md:aspect-[21/9] rounded-[56px] overflow-hidden shadow-2xl bg-slate-900 border border-slate-200">
        <SafeImage src={data.imagen} alt={data.titulo} className="absolute inset-0 w-full h-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        <div className="absolute top-8 right-8 z-20 flex gap-3">
          <Button 
            variant={isVisited ? "accent" : "secondary"}
            onClick={() => onToggleVisited?.(data.titulo)}
            className="px-6 h-12 text-[9px]"
          >
            {isVisited ? <CheckCircle size={14} /> : <Award size={14} />}
            {isVisited ? "Sello Listo" : "Sellar Pasaporte"}
          </Button>
          <button 
            onClick={() => onToggleFavorite(data.titulo)}
            className={`p-3 rounded-full backdrop-blur-xl border ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/10 text-white border-white/20'}`}
          >
            <Heart size={20} fill={isFavorite ? 'white' : 'none'} />
          </button>
        </div>

        <div className="absolute bottom-10 left-10 right-10 z-10 space-y-4">
           <div className="flex gap-2">
             <Badge color="gold">{data.region}</Badge>
             {data.isVerified && <Badge color="emerald">Verificado por Locales</Badge>}
           </div>
           <h2 className="text-white text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">{data.titulo}</h2>
           <p className="text-white/80 text-lg md:text-2xl font-serif italic max-w-3xl leading-snug">"{data.descripcion}"</p>
        </div>
      </section>

      {/* Info Logística Crucial (Puntos para el Turista) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 p-10 rounded-[48px] border border-emerald-100 space-y-4">
             <div className="flex items-center gap-3 text-paisa-emerald">
                <Bus size={28} />
                <h4 className="font-black uppercase text-xs tracking-widest">Transporte</h4>
             </div>
             <p className="text-slate-700 font-bold text-lg">{data.trivia || "Bus en Terminal del Norte/Sur."}</p>
             <div className="flex items-center gap-2 text-paisa-emerald/60 text-[10px] font-black uppercase">
                <Clock size={12} /> {data.tiempoDesdeMedellin} aprox.
             </div>
          </div>

          <div className="bg-amber-50 p-10 rounded-[48px] border border-amber-100 space-y-4">
             <div className="flex items-center gap-3 text-amber-600">
                <Wallet size={28} />
                <h4 className="font-black uppercase text-xs tracking-widest">Presupuesto</h4>
             </div>
             <p className="text-slate-700 font-bold text-lg">Pasaje: ${data.budget.busTicket.toLocaleString()} COP</p>
             <p className="text-slate-700 font-bold text-lg">Almuerzo: ${data.budget.averageMeal.toLocaleString()} COP</p>
          </div>

          <div className="bg-blue-50 p-10 rounded-[48px] border border-blue-100 space-y-4">
             <div className="flex items-center gap-3 text-blue-600">
                <Shield size={28} />
                <h4 className="font-black uppercase text-xs tracking-widest">Seguridad</h4>
             </div>
             <p className="text-slate-700 font-bold text-lg">{data.seguridadTexto}</p>
             <div className="flex items-center gap-2 text-blue-600/60 text-[10px] font-black uppercase">
                <Info size={12} /> Sugerencia de locales
             </div>
          </div>
      </section>

      {/* Neighbor Tip (El Secreto) */}
      {data.neighborTip && (
        <section className="p-12 rounded-[56px] bg-slate-900 text-white relative overflow-hidden group">
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                 <Sparkles className="text-paisa-gold animate-pulse" />
                 <span className="text-paisa-gold font-black uppercase text-[10px] tracking-[0.3em]">Secreto de Arriero</span>
              </div>
              <p className="text-3xl md:text-4xl font-serif italic leading-relaxed max-w-4xl">
                 "{data.neighborTip}"
              </p>
           </div>
           <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
              <Users size={200} />
           </div>
        </section>
      )}

      {/* Grid de Stats Técnicos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100">
            <p className="text-[9px] font-black uppercase opacity-40 mb-2">Estado Vía</p>
            <p className={`text-xl font-black text-${roadColor}-500`}>{data.viaEstado}</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100">
            <p className="text-[9px] font-black uppercase opacity-40 mb-2">Nomad Score</p>
            <p className="text-xl font-black">{data.nomadScore}/100</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100">
            <p className="text-[9px] font-black uppercase opacity-40 mb-2">Vibe Level</p>
            <p className="text-xl font-black">{data.vibeScore}%</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100">
            <p className="text-[9px] font-black uppercase opacity-40 mb-2">Región</p>
            <p className="text-xl font-black">{data.region}</p>
          </div>
      </div>
    </motion.div>
  );
};
