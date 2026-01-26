import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Bus, ShieldCheck, Sun, Accessibility, 
  Loader2, Utensils, Coffee, Sparkles, Navigation, 
  Wallet, ExternalLink, Info, Users, ChevronDown, 
  CheckCircle, Map, Play, Instagram, ArrowRight, AlertTriangle, Clock,
  Target, Truck, Activity, Compass, Plus, Minus, Calculator, MapPin, Star,
  Home, Flag
} from 'lucide-react';
import { PlaceData, SupportedLang } from '../types';
import { SafeImage } from './atoms/SafeImage';
import { generateSmartItinerary, generateTacticalRecommendations } from '../services/geminiService';

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
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [mealsCount, setMealsCount] = useState(1);
  const [showCalculator, setShowCalculator] = useState(false);

  const t: any = i18n || {};

  const handleGenerateItinerary = async () => {
    setLoadingItinerary(true);
    const result = await generateSmartItinerary(data.titulo, lang);
    if (result) setItinerary(result);
    setLoadingItinerary(false);
  };

  const handleGenerateRecommendations = async () => {
    setLoadingRecommendations(true);
    const result = await generateTacticalRecommendations(data.titulo, lang);
    if (result) setRecommendations(result);
    setLoadingRecommendations(false);
  };

  const handleTerminalRoute = (terminalName: string) => {
    const destination = encodeURIComponent(`${terminalName} Medellín`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  const stats = [
    { icon: Sun, label: t.climate, val: data.weather?.temp ? `${data.weather.temp}°C` : '22°C', color: 'text-amber-600' },
    { icon: Accessibility, label: t.accessibility, val: `${data.accessibility?.score || 90}%`, color: 'text-emerald-700' },
    { icon: ShieldCheck, label: t.security, val: data.security?.status || 'Seguro', color: 'text-blue-600' },
    { 
      icon: Bus, 
      label: t.terminal, 
      val: data.terminalInfo?.split(' ').pop() || 'Sur', 
      color: 'text-slate-900',
      isClickable: true,
      onClick: () => handleTerminalRoute(data.terminalInfo || 'Terminal del Sur')
    }
  ];

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
      href: `https://www.youtube.com/results?search_query=${encodeURIComponent("guia de viaje " + data.titulo + " antioquia como llegar")}` 
    },
    { 
      icon: Utensils, 
      label: 'COMIDA', 
      color: 'text-emerald-500', 
      href: `https://www.google.com/search?q=${encodeURIComponent("donde comer rico en " + data.titulo + " antioquia recomendaciones")}` 
    },
    { 
      icon: Instagram, 
      label: 'EXPLORAR', 
      color: 'text-purple-500', 
      href: `https://www.google.com/search?q=site:instagram.com+oficial+alcaldia+${encodeURIComponent(data.titulo)}+Antioquia` 
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

  const busPrice = data.budget?.busTicket || 32000;
  const mealPrice = data.budget?.averageMeal || 25000;
  const totalBudget = (busPrice * passengers) + (mealPrice * mealsCount);

  const journeySteps = [
    { icon: Home, label: 'Medellín', desc: 'Arranque mijo' },
    { icon: Bus, label: data.terminalInfo || 'Terminal del Sur', desc: 'Pa\' comprar el tiquete' },
    { icon: Navigation, label: 'Ruta Regional', desc: 'A disfrutar el paisaje' },
    { icon: Flag, label: data.titulo, desc: '¡Llegamos al paraíso!' }
  ];

  return (
    <motion.div layout className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
      <div className="rounded-[40px] md:rounded-[64px] bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row relative min-h-[500px]">
        {/* Lado Izquierdo (Hero) */}
        <div className="w-full lg:w-[35%] bg-[#FEF9C3]/40 relative p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-6">
           <div className="relative">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-white shadow-xl flex items-center justify-center">
                 <Coffee size={36} className="text-slate-700" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                <CheckCircle size={14} strokeWidth={3} />
              </div>
           </div>
           
           <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">{data.region.toUpperCase()}</span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter text-slate-950 leading-tight text-balance">{data.titulo}</h1>
           </div>

           <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-1 bg-paisa-gold/40 rounded-full" />
              <div className="flex items-center gap-2 text-paisa-gold">
                <Sparkles size={12} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">TIERRA CAFETERA</span>
              </div>
           </div>
           
           <div className="absolute bottom-6 left-6 opacity-10"><Navigation size={20} /></div>
        </div>

        {/* Lado Derecho (Stats & Action) */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-between bg-white space-y-10">
           <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-slate-950 leading-[0.9] text-balance">
                 {data.titulo}
              </h2>
              <p className="text-xl md:text-2xl font-serif italic text-slate-400 line-clamp-3">"{data.descripcion || '...'}"</p>
           </div>

           <div className="w-full h-px bg-slate-50" />

           {/* Stats Grid */}
           <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {stats.map((st, i) => (
                <div key={i} className={`space-y-2 ${st.isClickable ? 'cursor-pointer group' : ''}`} onClick={st.onClick}>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                     {st.label}
                     {st.isClickable && <ExternalLink size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                   </span>
                   <div className={`flex items-center gap-3 ${st.color}`}>
                      <st.icon size={20} strokeWidth={2.5} className={st.isClickable ? 'group-hover:scale-110 transition-transform' : ''} />
                      <span className={`text-xl md:text-2xl font-black tracking-tighter uppercase ${st.isClickable ? 'group-hover:text-paisa-emerald' : ''}`}>{st.val}</span>
                   </div>
                </div>
              ))}
           </div>

           {/* Botón Principal */}
           <div className="pt-6">
              <button 
                onClick={handleGenerateItinerary}
                disabled={loadingItinerary}
                className="w-full h-24 md:h-28 rounded-[32px] md:rounded-[64px] bg-[#2D7A4C] text-white flex flex-col items-center justify-center gap-1 shadow-xl hover:brightness-110 active:scale-95 transition-all"
              >
                {loadingItinerary ? <Loader2 className="animate-spin" size={28} /> : (
                  <>
                    <span className="text-lg md:text-2xl font-black uppercase tracking-[0.1em]">{t.btnItinerary}</span>
                    <span className="text-[8px] md:text-[10px] font-bold opacity-60 uppercase tracking-widest">{t.btnItinerarySub}</span>
                  </>
                )}
              </button>
           </div>
        </div>
      </div>

      {/* Grid de Accesos Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {utilityGrid.map((item, i) => (
           <a 
             key={i} 
             href={item.href} 
             target="_blank" 
             rel="noopener noreferrer"
             className="p-6 md:p-8 rounded-[32px] md:rounded-[48px] bg-white border border-slate-100 shadow-lg flex flex-col items-center justify-center gap-4 group hover:translate-y-[-4px] transition-all"
           >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[28px] flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${item.color.startsWith('bg') ? item.color : 'bg-white border border-slate-100'}`}>
                 <item.icon size={24} className={!item.color.startsWith('bg') ? item.color : 'text-white'} />
              </div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-paisa-emerald text-center">{item.label}</span>
           </a>
         ))}
      </div>

      {/* Sección "¿Cómo llegar?" */}
      <div className="rounded-[40px] md:rounded-[64px] bg-[#F7FBF9] p-8 md:p-16 border border-[#EAF5EF] space-y-10 relative overflow-hidden">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-paisa-emerald flex items-center justify-center">
                  <Truck size={20} />
               </div>
               <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-[#1A4731]">{t.howToGet}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
               <a 
                 href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.titulo + ", Antioquia")}`}
                 target="_blank" rel="noopener noreferrer"
                 className="px-5 py-2 rounded-full bg-[#3B82F6] text-white text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-blue-600 transition-colors flex items-center gap-2"
               >
                  <Navigation size={10} /> {t.verRuta}
               </a>
               <div className="px-5 py-2 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-md">
                  {t.realTime}
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <a 
              href="https://terminalesmedellin.com" target="_blank" rel="noopener noreferrer"
              className="p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white shadow-xl flex flex-col items-center justify-center text-center space-y-3 hover:scale-[1.02] transition-transform"
            >
               <span className="text-[9px] font-black uppercase tracking-widest text-paisa-gold">{t.leavesFrom}</span>
               <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900">{data.terminalInfo || 'TERMINAL DEL SUR'}</h4>
            </a>
            <div className="p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white shadow-xl flex flex-col items-center justify-center text-center space-y-3">
               <span className="text-[9px] font-black uppercase tracking-widest text-paisa-emerald">{t.duration}</span>
               <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900">{data.tiempoDesdeMedellin || '2.5 Horas'}</h4>
            </div>
         </div>

         {/* Guía Gráfica de Inicio a Fin */}
         <div className="py-10 px-4">
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4">
               {/* Línea de conexión de fondo (Desktop) */}
               <div className="absolute top-10 left-[10%] right-[10%] h-0.5 bg-slate-200 hidden md:block" />
               
               {journeySteps.map((step, i) => (
                 <div key={i} className="relative z-10 flex flex-row md:flex-col items-center gap-6 md:gap-4 flex-1">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 border-white shadow-2xl transition-colors
                        ${i === 0 ? 'bg-slate-100 text-slate-400' : 
                          i === journeySteps.length - 1 ? 'bg-paisa-emerald text-white shadow-emerald-500/20' : 
                          'bg-white text-paisa-gold'}`}
                    >
                       <step.icon size={24} />
                    </motion.div>
                    <div className="flex flex-col items-start md:items-center text-left md:text-center space-y-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{step.label}</span>
                       <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 italic">"{step.desc}"</span>
                    </div>
                    {/* Flecha de conexión (Mobile) */}
                    {i < journeySteps.length - 1 && (
                      <div className="md:hidden absolute -bottom-6 left-8 text-slate-200">
                         <ChevronDown size={16} />
                      </div>
                    )}
                 </div>
               ))}
            </div>
         </div>

         <div className="rounded-[32px] md:rounded-[48px] bg-[#1A242F] p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-14 h-14 rounded-2xl bg-[#2D7A4C]/20 border border-[#2D7A4C]/40 text-paisa-emerald flex items-center justify-center shrink-0">
               <AlertTriangle size={28} />
            </div>
            <div className="flex-1 space-y-1 text-center md:text-left">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t.roadStatus}</span>
               <p className="text-white text-xl md:text-2xl font-serif italic">"{data.viaEstado || 'Vía pavimentada, sin cierres reportados.'}"</p>
            </div>
            <a 
              href="https://terminalesmedellin.com" target="_blank" rel="noopener noreferrer"
              className="px-10 py-5 rounded-full bg-[#D4A574] text-slate-950 font-black uppercase text-[10px] tracking-widest shadow-lg flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all"
            >
               {t.verTerminales} <ArrowRight size={16} />
            </a>
         </div>
      </div>

      {/* Sección "Presupuesto Estimado" */}
      <div className="rounded-[40px] md:rounded-[64px] bg-[#FFFBF0] p-8 md:p-16 border border-[#FEF3C7] space-y-10 relative">
         <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full text-center px-4">
            <span className="text-[8px] md:text-[9px] font-black text-amber-900/40 uppercase tracking-[0.3em]">
               * Los precios son un valor aproximado y pueden variar
            </span>
         </div>
         <div className="flex items-center gap-4 justify-center pt-6 md:pt-8">
            <Wallet size={20} className="text-paisa-gold" />
            <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.3em] text-[#92400E]">{t.estimatedBudget}</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <a 
              href="https://terminalesmedellin.com" target="_blank" rel="noopener noreferrer"
              className="p-10 md:p-12 rounded-[40px] md:rounded-[56px] bg-white shadow-xl border border-slate-50 flex flex-col items-center justify-center space-y-4 hover:scale-[1.02] transition-transform"
            >
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-paisa-gold">{t.pasaje}</span>
               <h4 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900">${busPrice.toLocaleString()}</h4>
            </a>
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent("donde almorzar en " + data.titulo + " Antioquia precios")}`}
              target="_blank" rel="noopener noreferrer"
              className="p-10 md:p-12 rounded-[40px] md:rounded-[56px] bg-white shadow-xl border border-slate-50 flex flex-col items-center justify-center space-y-4 hover:scale-[1.02] transition-transform"
            >
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-paisa-gold">{t.almuerzo}</span>
               <h4 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900">${mealPrice.toLocaleString()}</h4>
            </a>
         </div>

         {/* Calculadora de Presupuesto */}
         <div className="pt-6 flex flex-col items-center">
            {!showCalculator ? (
              <button 
                onClick={() => setShowCalculator(true)}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#92400E] text-white text-[11px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <Calculator size={16} /> {t.calcTotal}
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-[32px] md:rounded-[48px] shadow-2xl border border-paisa-gold/20 space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t.calcPersons}</span>
                      <div className="flex items-center justify-center gap-6">
                        <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100"><Minus size={16} /></button>
                        <span className="text-3xl font-black text-slate-900">{passengers}</span>
                        <button onClick={() => setPassengers(passengers + 1)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100"><Plus size={16} /></button>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t.calcMeals}</span>
                      <div className="flex items-center justify-center gap-6">
                        <button onClick={() => setMealsCount(Math.max(0, mealsCount - 1))} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100"><Minus size={16} /></button>
                        <span className="text-3xl font-black text-slate-900">{mealsCount}</span>
                        <button onClick={() => setMealsCount(mealsCount + 1)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100"><Plus size={16} /></button>
                      </div>
                   </div>
                </div>
                <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-1">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-paisa-gold">TOTAL</span>
                   <h5 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">${totalBudget.toLocaleString()}</h5>
                   <button onClick={() => setShowCalculator(false)} className="mt-4 text-[8px] font-black text-slate-300 uppercase hover:text-slate-500 tracking-widest">Ocultar</button>
                </div>
              </motion.div>
            )}
         </div>
      </div>

      {/* Sección "Guía del Arriero" */}
      <div className="rounded-[40px] md:rounded-[64px] bg-[#1a4731] p-10 md:p-20 space-y-12 relative overflow-hidden text-center">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
            <Activity size={300} />
         </div>

         <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 justify-center">
               <Compass size={20} className="text-paisa-gold" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4A574]">{t.arrieroGuide}</h3>
            </div>
            <div className="flex justify-center">
               <div className="w-20 h-20 rounded-full bg-[#D4A574]/20 flex items-center justify-center border border-[#D4A574]/40">
                  <ShieldCheck size={32} className="text-paisa-gold" />
               </div>
            </div>
            <p className="text-white text-3xl md:text-5xl lg:text-6xl font-serif italic max-w-4xl mx-auto leading-tight text-pretty">
               "{t.quote}"
            </p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {tacticalTips.map((tip, i) => (
              <div key={i} className="p-8 rounded-[40px] bg-white/10 border border-white/10 backdrop-blur-md flex flex-col items-start text-left space-y-4 hover:bg-white/20 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 text-paisa-gold flex items-center justify-center">
                       <tip.icon size={20} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">{tip.label}</span>
                 </div>
                 <p className="text-white text-lg md:text-xl font-serif italic leading-relaxed">
                    "{tip.val}"
                 </p>
              </div>
            ))}
         </div>
         
         <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a 
              href={data.groundingLinks?.[0]?.uri || `https://www.google.com/search?q=${encodeURIComponent(data.titulo + " Antioquia turismo guia oficial")}`} 
              target="_blank" rel="noopener noreferrer"
              className="px-10 py-5 rounded-full bg-[#1A242F] text-white font-black uppercase text-[9px] tracking-widest shadow-xl hover:bg-slate-800 transition-all inline-flex items-center gap-3"
            >
               {t.btnVerMas} <ExternalLink size={12} />
            </a>

            <button 
              onClick={handleGenerateRecommendations}
              disabled={loadingRecommendations}
              className="px-10 py-5 rounded-full bg-paisa-gold text-slate-900 font-black uppercase text-[9px] tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all inline-flex flex-col items-center justify-center gap-0.5"
            >
              {loadingRecommendations ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  <span>{t.btnRecommendations}</span>
                  <span className="text-[7px] opacity-60 font-bold tracking-widest">{t.btnRecommendationsSub}</span>
                </>
              )}
            </button>
         </div>

         <AnimatePresence>
            {recommendations && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-2xl mx-auto pt-8 grid grid-cols-1 gap-4"
              >
                {recommendations.map((rec, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md text-left flex items-start gap-4 shadow-2xl"
                  >
                    <div className="p-2 rounded-full bg-paisa-gold/20 text-paisa-gold mt-1 shrink-0">
                      <Star size={16} fill="currentColor" />
                    </div>
                    <p className="text-white text-base md:text-xl font-serif italic leading-relaxed">
                      "{rec}"
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Itinerario Resultante */}
      <AnimatePresence>
        {itinerary && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="w-full space-y-6 pt-4">
             {Object.entries(itinerary).map(([time, val]: [string, any], idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start p-8 rounded-[32px] bg-white border border-slate-100 shadow-lg">
                   <div className="text-xl font-black text-paisa-emerald uppercase w-auto sm:w-32 pt-1 whitespace-nowrap">{time}</div>
                   <div className="space-y-2 flex-1">
                      <p className="text-2xl font-black text-slate-900 leading-tight">{val.activity}</p>
                      <p className="text-base italic text-slate-400 font-serif">"{val.tip}"</p>
                   </div>
                </div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
