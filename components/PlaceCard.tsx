
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Bus, ShieldCheck, Sun, Accessibility, 
  Loader2, Utensils, Coffee, Sparkles, Navigation, 
  Wallet, ExternalLink, Info, Users, ChevronDown, 
  CheckCircle, Map, Play, Instagram, ArrowRight, AlertTriangle, Clock,
  Target, Truck, Activity, Compass
} from 'lucide-react';
import { PlaceData, SupportedLang } from '../types';
import { SafeImage } from './atoms/SafeImage';
import { generateSmartItinerary } from '../services/geminiService';

interface PlaceCardProps {
  data: PlaceData;
  lang: SupportedLang;
  i18n: any;
  isFavorite: boolean;
  onToggleFavorite: (title: string) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ data, lang, i18n, isFavorite, onToggleFavorite }) => {
  const [itinerary, setItinerary] = useState<any>(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);

  const t: any = i18n || {};

  const handleGenerateItinerary = async () => {
    setLoadingItinerary(true);
    const result = await generateSmartItinerary(data.titulo, lang);
    if (result) setItinerary(result);
    setLoadingItinerary(false);
  };

  const stats = [
    { icon: Sun, label: t.climate, val: data.weather?.temp ? `${data.weather.temp}°C` : '22°C', color: 'text-amber-600' },
    { icon: Accessibility, label: t.accessibility, val: `${data.accessibility?.score || 90}%`, color: 'text-emerald-700' },
    { icon: ShieldCheck, label: t.security, val: data.security?.status || 'Seguro', color: 'text-blue-600' },
    { icon: Bus, label: t.terminal, val: data.terminalInfo?.split(' ').pop() || 'Sur', color: 'text-slate-900' }
  ];

  // Enlaces dinámicos reales para la cuadrícula de utilidades
  const utilityGrid = [
    { 
      icon: Map, 
      label: 'MAPA', 
      color: 'bg-emerald-600', 
      href: `https://www.google.com/maps/search/${encodeURIComponent(data.titulo + ", Antioquia")}` 
    },
    { 
      icon: Play, 
      label: 'VIDEO', 
      color: 'text-red-500', 
      href: `https://www.youtube.com/results?search_query=${encodeURIComponent(data.titulo + " Antioquia turismo")}` 
    },
    { 
      icon: Utensils, 
      label: 'COMIDA', 
      color: 'text-emerald-500', 
      href: `https://www.google.com/search?q=${encodeURIComponent("mejores restaurantes en " + data.titulo + " Antioquia")}` 
    },
    { 
      icon: Instagram, 
      label: 'EXPLORAR', 
      color: 'text-purple-500', 
      href: `https://www.instagram.com/explore/tags/${encodeURIComponent(data.titulo.toLowerCase().replace(/\s/g, ''))}/` 
    }
  ];

  const tacticalTips = [
    { icon: Utensils, label: t.tips?.sazon, val: data.foodTip || "Pida el plato del día, mijo." },
    { icon: Sparkles, label: t.tips?.cultura, val: data.cultureTip || "Salude a todo el mundo." },
    { icon: Navigation, label: t.tips?.ruta, val: data.logisticsTip || "Salga tempranito." },
    { icon: Users, label: t.tips?.parche, val: data.peopleTip || "Váyase para la plaza." },
    { icon: Clock, label: t.tips?.clima, val: "Cargue sombrilla mijo." },
    { icon: Target, label: t.tips?.tactico, val: "Tenga efectivo a la mano." }
  ];

  return (
    <motion.div layout className="w-full max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="rounded-[64px] bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row relative min-h-[600px]">
        {/* Lado Izquierdo (Hero) */}
        <div className="w-full md:w-[40%] bg-[#FEF9C3]/40 relative p-12 flex flex-col items-center justify-center text-center space-y-8">
           <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center">
                 <Coffee size={48} className="text-slate-700" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                <CheckCircle size={16} strokeWidth={3} />
              </div>
           </div>
           
           <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{data.region.toUpperCase()}</span>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-950 leading-none">{data.titulo}</h1>
           </div>

           <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-1.5 bg-paisa-gold/40 rounded-full" />
              <div className="flex items-center gap-2 text-paisa-gold">
                <Sparkles size={14} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">TIERRA CAFETERA</span>
              </div>
           </div>
           
           <div className="absolute bottom-10 left-10 opacity-20"><Navigation size={24} /></div>
        </div>

        {/* Lado Derecho (Stats & Action) */}
        <div className="flex-1 p-12 md:p-20 flex flex-col justify-between bg-white space-y-12">
           <div className="space-y-6">
              <h2 className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter text-slate-950 leading-[0.8]">
                 {data.titulo}
              </h2>
              <p className="text-3xl font-serif italic text-slate-300">"{data.descripcion || '...'}"</p>
           </div>

           <div className="w-full h-px bg-slate-100" />

           {/* Stats Grid */}
           <div className="grid grid-cols-2 gap-x-16 gap-y-12">
              {stats.map((st, i) => (
                <div key={i} className="space-y-3">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">{st.label}</span>
                   <div className={`flex items-center gap-4 ${st.color}`}>
                      <st.icon size={28} strokeWidth={2.5} />
                      <span className="text-4xl font-black tracking-tighter uppercase">{st.val}</span>
                   </div>
                </div>
              ))}
           </div>

           {/* Botón Principal */}
           <div className="pt-8">
              <button 
                onClick={handleGenerateItinerary}
                disabled={loadingItinerary}
                className="w-full h-32 rounded-[64px] bg-[#2D7A4C] text-white flex flex-col items-center justify-center gap-1 shadow-2xl hover:brightness-110 active:scale-95 transition-all"
              >
                {loadingItinerary ? <Loader2 className="animate-spin" size={32} /> : (
                  <>
                    <span className="text-2xl font-black uppercase tracking-[0.1em]">{t.btnItinerary}</span>
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{t.btnItinerarySub}</span>
                  </>
                )}
              </button>
           </div>
        </div>
      </div>

      {/* Grid de Accesos Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {utilityGrid.map((item, i) => (
           <a 
             key={i} 
             href={item.href} 
             target="_blank" 
             rel="noopener noreferrer"
             className="p-8 rounded-[48px] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-6 group hover:translate-y-[-8px] transition-all"
           >
              <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${item.color.startsWith('bg') ? item.color : 'bg-white border border-slate-100'}`}>
                 <item.icon size={32} className={!item.color.startsWith('bg') ? item.color : 'text-white'} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-paisa-emerald">{item.label}</span>
           </a>
         ))}
      </div>

      {/* Sección "¿Cómo llegar?" */}
      <div className="rounded-[64px] bg-[#F7FBF9] p-12 md:p-16 border border-[#EAF5EF] space-y-10 relative overflow-hidden">
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-[#EAF5EF] text-paisa-emerald flex items-center justify-center">
                  <Truck size={24} />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-widest text-[#1A4731]">{t.howToGet}</h3>
            </div>
            <div className="px-6 py-2 rounded-full bg-[#3B82F6] text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
               {t.realTime}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a 
              href="https://terminalesmedellin.com" target="_blank" rel="noopener noreferrer"
              className="p-10 rounded-[48px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center text-center space-y-4 hover:scale-[1.02] transition-transform"
            >
               <span className="text-[10px] font-black uppercase tracking-widest text-paisa-gold">{t.leavesFrom}</span>
               <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{data.terminalInfo || 'TERMINAL DEL SUR'}</h4>
            </a>
            <div className="p-10 rounded-[48px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center text-center space-y-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-paisa-emerald">{t.duration}</span>
               <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{data.tiempoDesdeMedellin || '2.5 Horas'}</h4>
            </div>
         </div>

         <div className="rounded-[48px] bg-[#1A242F] p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-16 h-16 rounded-2xl bg-[#2D7A4C]/20 border border-[#2D7A4C]/40 text-paisa-emerald flex items-center justify-center shrink-0">
               <AlertTriangle size={32} />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.roadStatus}</span>
               <p className="text-white text-2xl font-serif italic">"{data.viaEstado || 'Vía pavimentada, sin cierres reportados.'}"</p>
            </div>
            <a 
              href="https://terminalesmedellin.com" target="_blank" rel="noopener noreferrer"
              className="px-12 py-6 rounded-full bg-[#D4A574] text-slate-950 font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center gap-4 hover:brightness-110 active:scale-95 transition-all"
            >
               {t.verTerminales} <ArrowRight size={18} />
            </a>
         </div>
      </div>

      {/* Sección "Presupuesto Estimado" */}
      <div className="rounded-[64px] bg-[#FFFBF0] p-12 md:p-16 border border-[#FEF3C7] space-y-10">
         <div className="flex items-center gap-5 justify-center">
            <Wallet size={24} className="text-paisa-gold" />
            <h3 className="text-xl font-black uppercase tracking-[0.3em] text-[#92400E]">{t.estimatedBudget}</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a 
              href="https://terminalesmedellin.com" target="_blank" rel="noopener noreferrer"
              className="p-12 rounded-[56px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-slate-50 flex flex-col items-center justify-center space-y-6 hover:scale-[1.02] transition-transform"
            >
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-paisa-gold">{t.pasaje}</span>
               <h4 className="text-7xl font-black tracking-tighter text-slate-900">${(data.budget?.busTicket || 32000).toLocaleString()}</h4>
            </a>
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent("donde almorzar en " + data.titulo + " Antioquia precios")}`}
              target="_blank" rel="noopener noreferrer"
              className="p-12 rounded-[56px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-slate-50 flex flex-col items-center justify-center space-y-6 hover:scale-[1.02] transition-transform"
            >
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-paisa-gold">{t.almuerzo}</span>
               <h4 className="text-7xl font-black tracking-tighter text-slate-900">${(data.budget?.averageMeal || 25000).toLocaleString()}</h4>
            </a>
         </div>
      </div>

      {/* Sección "Guía del Arriero" */}
      <div className="rounded-[64px] bg-[#1a4731] p-12 md:p-24 space-y-16 relative overflow-hidden text-center">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
            <Activity size={400} />
         </div>

         <div className="space-y-8 relative z-10">
            <div className="flex items-center gap-4 justify-center">
               <Compass size={24} className="text-paisa-gold" />
               <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#D4A574]">{t.arrieroGuide}</h3>
            </div>
            <div className="flex justify-center">
               <div className="w-24 h-24 rounded-full bg-[#D4A574]/20 flex items-center justify-center border border-[#D4A574]/40">
                  <ShieldCheck size={40} className="text-paisa-gold" />
               </div>
            </div>
            <p className="text-white text-5xl md:text-7xl font-serif italic max-w-4xl mx-auto leading-tight">
               "{t.quote}"
            </p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {tacticalTips.map((tip, i) => (
              <div key={i} className="p-10 rounded-[56px] bg-white/10 border border-white/10 backdrop-blur-md flex flex-col items-start text-left space-y-6 hover:bg-white/20 transition-all">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-paisa-gold flex items-center justify-center">
                       <tip.icon size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{tip.label}</span>
                 </div>
                 <p className="text-white text-2xl font-serif italic leading-relaxed">
                    "{tip.val}"
                 </p>
              </div>
            ))}
         </div>
         
         <div className="pt-10">
            <a 
              href={data.groundingLinks?.[0]?.uri || `https://www.google.com/search?q=${encodeURIComponent(data.titulo + " Antioquia turismo guia oficial")}`} 
              target="_blank" rel="noopener noreferrer"
              className="px-12 py-6 rounded-full bg-[#1A242F] text-white font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-slate-800 transition-all inline-flex items-center gap-3"
            >
               {t.btnVerMas} <ExternalLink size={14} />
            </a>
         </div>
      </div>

      {/* Itinerario Resultante */}
      <AnimatePresence>
        {itinerary && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="w-full space-y-8 pt-4">
             {Object.entries(itinerary).map(([time, val]: [string, any], idx) => (
                <div key={idx} className="flex gap-10 items-start p-10 rounded-[48px] bg-white border border-slate-100 shadow-xl">
                   <div className="text-2xl font-black text-paisa-emerald uppercase w-32 pt-1">{time}</div>
                   <div className="space-y-3 flex-1">
                      <p className="text-3xl font-black text-slate-900 leading-none">{val.activity}</p>
                      <p className="text-lg italic text-slate-400 font-serif">"{val.tip}"</p>
                   </div>
                </div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
