
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Heart, Bus, Wallet, ShieldCheck, Zap, 
  Maximize2, Minimize2, Utensils, Users, Sun, Accessibility, 
  Loader2, Map, Play, Instagram, MessageSquare, ExternalLink, Info,
  Coffee, Sparkles, Navigation, Cloud, Target, Compass, Quote, Award,
  Truck, ArrowRight, RotateCcw, Activity, AlertTriangle
} from 'lucide-react';
import { PlaceData, SupportedLang } from '../types';
import { Badge } from './atoms/Badge';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);

  const t: any = i18n || {};

  const handleGenerateItinerary = async () => {
    setLoadingItinerary(true);
    const result = await generateSmartItinerary(data.titulo, lang);
    if (result) {
      setItinerary(result);
    }
    setLoadingItinerary(false);
  };

  const quickActions = [
    { 
      label: t?.quickMap || "Mapa", 
      icon: Map, 
      color: 'text-blue-600',
      bg: 'bg-blue-500/5',
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.titulo + " Antioquia")}`
    },
    { 
      label: t?.quickVideo || "Video", 
      icon: Play, 
      color: 'text-red-600',
      bg: 'bg-red-500/5',
      href: `https://www.youtube.com/results?search_query=${encodeURIComponent("Guia de viaje " + data.titulo + " Antioquia")}`
    },
    { 
      label: t?.quickFood || "Comida", 
      icon: Utensils, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/5',
      href: `https://www.google.com/search?q=${encodeURIComponent("Donde comer en " + data.titulo + " Antioquia")}`
    },
    { 
      label: t?.quickSocial || "Explorar", 
      icon: Instagram, 
      color: 'text-purple-600',
      bg: 'bg-purple-500/5',
      href: `https://www.instagram.com/explore/tags/${data.titulo.toLowerCase().replace(/\s+/g, '')}/`
    }
  ];

  const tipLabels = t.tipLabels || {};

  const arrieroTips = [
    { label: tipLabels.food || 'Sazón Local', val: data.foodTip || "Pida el plato del día, mijo, que eso no tiene pierde.", icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: tipLabels.culture || 'Cultura', val: data.cultureTip || "Salude a todo el mundo que aquí somos muy amables.", icon: Sparkles, color: 'text-paisa-gold', bg: 'bg-paisa-gold/10' },
    { label: tipLabels.logistics || 'Vía/Ruta', val: data.logisticsTip || "Salga tempranito para que rinda el día.", icon: Navigation, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: tipLabels.people || 'El Parche', val: data.peopleTip || "Váyase para la plaza que allá es donde está el ambiente.", icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: tipLabels.weather || 'Clima', val: "Cargue sombrilla que el clima de la montaña es traicionero.", icon: Cloud, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { label: tipLabels.tactical || 'Táctico', val: "Tenga efectivo a la mano que el internet a veces falla.", icon: Target, color: 'text-rose-500', bg: 'bg-rose-500/10' }
  ];

  return (
    <motion.div layout className="w-full">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div 
            key="compact" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-[40px] border border-slate-100 bg-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
            onClick={() => setIsExpanded(true)}
          >
            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
              <SafeImage src={data.imagen} alt={data.titulo} region={data.region} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                 <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{data.titulo}</h3>
                 <Badge color="emerald" className="scale-90 origin-left">{data.region}</Badge>
              </div>
              <p className="text-slate-500 font-serif italic line-clamp-1 text-lg">"{data.descripcion}"</p>
            </div>
            <div className="p-5 rounded-full bg-slate-50 text-slate-300 group-hover:bg-paisa-emerald group-hover:text-white transition-all">
              <Maximize2 size={24} strokeWidth={1.5} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            
            <section className="rounded-[64px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row bg-white">
              <div className="w-full md:w-5/12 h-[400px] md:h-auto min-h-[400px] relative">
                 <SafeImage src={data.imagen} alt={data.titulo} region={data.region} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-8 md:p-12 lg:p-20 space-y-10">
                 <div className="flex justify-between items-start">
                    <Badge color="gold" className="text-lg px-6 py-2 shadow-md">{data.region}</Badge>
                    <div className="flex gap-4">
                      <button onClick={() => setIsExpanded(false)} className="p-4 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all border border-slate-100"><Minimize2 size={24} strokeWidth={1.5} /></button>
                      <button onClick={() => onToggleFavorite(data.titulo)} className={`p-4 rounded-full border transition-all ${isFavorite ? 'bg-red-500 text-white shadow-lg border-red-500' : 'text-red-300 bg-white border-slate-100 hover:border-red-200'}`}><Heart size={24} fill={isFavorite ? 'white' : 'none'} strokeWidth={1.5} /></button>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-slate-950">{data.titulo}</h2>
                    <p className="text-slate-600 text-2xl md:text-4xl font-serif italic max-w-2xl leading-snug">"{data.descripcion}"</p>
                 </div>

                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-slate-100">
                    {[
                      { icon: Sun, label: t.weather || 'CLIMA', val: '22°C', col: 'text-amber-700' },
                      { icon: Accessibility, label: t.accessibility || 'ACCESIBILIDAD', val: `${data.accessibility?.score || 90}%`, col: 'text-emerald-700' },
                      { icon: ShieldCheck, label: 'SEGURIDAD', val: 'Seguro', col: 'text-blue-700' },
                      { icon: Bus, label: 'TERMINAL', val: data.terminalInfo?.split(' ').pop() || 'Sur', col: 'text-slate-900' }
                    ].map((st, idx) => (
                      <div key={idx} className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{st.label}</span>
                        <div className={`flex items-center gap-2 ${st.col}`}><st.icon size={20} strokeWidth={2} /><span className="text-2xl font-black">{st.val}</span></div>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-6">
                    <button 
                      onClick={handleGenerateItinerary} 
                      disabled={loadingItinerary} 
                      className="w-full h-24 px-12 rounded-[40px] bg-paisa-emerald text-white flex flex-col items-center justify-center gap-1 text-center shadow-2xl active:scale-95 transition-all overflow-hidden relative group"
                    >
                        {loadingItinerary ? (
                          <div className="flex items-center gap-4">
                            <Loader2 className="animate-spin" size={24} />
                            <span className="text-[14px] font-black uppercase tracking-widest">Indexando...</span>
                          </div>
                        ) : (
                          <>
                            <span className="text-[16px] font-black uppercase tracking-widest leading-none">
                              {itinerary ? "REFRESCAR ITINERARIO" : t.itineraryIA || "GENERAR ITINERARIO"}
                            </span>
                            {!itinerary && (
                              <span className="text-[9px] font-medium opacity-70 uppercase tracking-widest">
                                {t.itinerarySubtitle || "Recomendaciones del horario ideal para viajar"}
                              </span>
                            )}
                          </>
                        )}
                    </button>

                    <AnimatePresence>
                        {itinerary && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-slate-50 rounded-[40px] p-8 md:p-10 space-y-8 border border-slate-200 overflow-hidden shadow-inner"
                            >
                                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                    <div className="flex items-center gap-3">
                                      <Clock size={18} className="text-paisa-emerald" strokeWidth={2.5} />
                                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                                        {t.itinerarySubtitle || "RECOMENDACIONES DEL HORARIO IDEAL PARA VIAJAR"}
                                      </span>
                                    </div>
                                    <Badge color="emerald" className="shadow-sm">Verificado</Badge>
                                </div>
                                
                                <div className="space-y-12">
                                  {Object.entries(itinerary).map(([time, val]: [string, any], idx) => (
                                      <motion.div 
                                          key={time} 
                                          initial={{ opacity: 0, x: -10 }} 
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: idx * 0.1 }}
                                          className="flex flex-col md:flex-row gap-4 md:gap-10 items-start group"
                                      >
                                          <div className="w-full md:w-32 text-[12px] font-black uppercase text-paisa-emerald shrink-0 pt-1 border-b md:border-none border-emerald-100 pb-2 md:pb-0">
                                              {time}
                                          </div>
                                          <div className="flex-1 space-y-4">
                                              <p className="text-2xl md:text-4xl font-black text-slate-950 leading-tight">
                                                  {typeof val === 'string' ? val : val.activity}
                                              </p>
                                              {val.tip && (
                                                  <div className="flex items-start gap-4 text-sm italic text-slate-700 bg-white p-5 rounded-3xl w-full md:w-fit border border-slate-200 shadow-sm">
                                                      <Info size={16} className="text-paisa-gold shrink-0 mt-0.5" strokeWidth={2.5} />
                                                      <span className="leading-relaxed font-medium">{val.tip}</span>
                                                  </div>
                                              )}
                                          </div>
                                      </motion.div>
                                  ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
              </div>
            </section>

            {/* Acciones Rápidas */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {quickActions.map((action, idx) => (
                 <motion.a 
                    key={idx} href={action.href} target="_blank" rel="noopener noreferrer" whileHover={{ y: -10 }} 
                    className="flex flex-col items-center justify-center gap-6 p-8 md:p-12 rounded-[48px] md:rounded-[64px] bg-white border border-slate-100 shadow-xl group no-underline transition-all relative overflow-hidden"
                 >
                   <div className={`absolute inset-0 ${action.bg} opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700`} />
                   
                   <div className={`relative z-10 p-6 rounded-[32px] bg-white ${action.color} group-hover:bg-paisa-emerald group-hover:text-white transition-all shadow-lg border border-slate-50`}>
                      <action.icon size={44} strokeWidth={1} />
                   </div>
                   <span className="relative z-10 text-[12px] font-black uppercase tracking-[0.2em] text-slate-950 group-hover:text-paisa-emerald transition-colors">{action.label}</span>
                 </motion.a>
               ))}
            </section>

            {/* Logística y Presupuesto */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Logística Detallada */}
               <div className="p-10 md:p-16 rounded-[64px] bg-[#F4F9F6] border border-emerald-100 flex flex-col gap-12 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-emerald-800">
                      <Truck size={24} strokeWidth={2.5} /> 
                      <span className="text-[12px] font-black uppercase tracking-[0.3em]">{t.logisticsTitle || "¿CÓMO LLEGAR?"}</span>
                    </div>
                    <Badge color="blue" className="px-4 py-2">Real Time</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-8 bg-white rounded-[40px] border border-emerald-50 shadow-sm text-center space-y-2">
                        <span className="text-[10px] font-black text-emerald-600 uppercase opacity-60 tracking-widest">{t.departurePoint || "SALE DE"}</span>
                        <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{data.terminalInfo || "Terminal Sur"}</p>
                     </div>
                     <div className="p-8 bg-white rounded-[40px] border border-emerald-50 shadow-sm text-center space-y-2">
                        <span className="text-[10px] font-black text-emerald-600 uppercase opacity-60 tracking-widest">{t.travelTime || "DURACIÓN"}</span>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">{data.tiempoDesdeMedellin || "2.5 Horas"}</p>
                     </div>
                  </div>

                  {/* Estado de la Vía */}
                  <div className="p-10 bg-[#1A242F] rounded-[48px] border border-white/5 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
                     <div className="flex items-center gap-5 relative z-10">
                        <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
                           <AlertTriangle size={24} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">{t.roadStatus || "ESTADO DE LA VÍA"}</span>
                           <p className="text-white text-lg font-serif italic">"{data.viaEstado || 'Vía pavimentada, sin cierres reportados.'}"</p>
                        </div>
                     </div>
                     
                     <a 
                       href={t.terminalUrl || "https://terminalesmedellin.com/"} 
                       target="_blank" 
                       className="w-full py-7 bg-paisa-gold text-slate-950 rounded-full font-black uppercase text-[12px] tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4 shadow-xl group"
                     >
                       {t.reserveTicket || "VER TERMINALES"}
                       <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                     </a>
                  </div>
               </div>

               {/* Presupuesto */}
               <div className="p-10 md:p-16 rounded-[64px] bg-[#FFFBF4] border border-amber-200 flex flex-col gap-12 shadow-xl">
                  <div className="flex items-center justify-center md:justify-start gap-4 text-amber-800">
                    <Wallet size={24} strokeWidth={2.5} /> 
                    <span className="text-[12px] font-black uppercase tracking-[0.3em]">{t.budgetTitle || "PRESUPUESTO ESTIMADO"}</span>
                  </div>
                  <div className="flex flex-col gap-8">
                     <div className="p-12 bg-white rounded-[48px] border border-amber-100 shadow-sm flex flex-col items-center text-center group hover:border-amber-400 transition-all">
                        <span className="text-[14px] font-black text-[#A35A05] uppercase block mb-3 tracking-[0.2em]">{t.busTicket || "PASAJE"}</span>
                        <p className="text-7xl md:text-8xl font-black text-slate-950 tracking-tighter leading-none group-hover:scale-105 transition-transform">${data.budget?.busTicket?.toLocaleString() || '35,000'}</p>
                     </div>
                     <div className="p-12 bg-white rounded-[48px] border border-amber-100 shadow-sm flex flex-col items-center text-center group hover:border-amber-400 transition-all">
                        <span className="text-[14px] font-black text-[#A35A05] uppercase block mb-3 tracking-[0.2em]">{t.meal || "ALMUERZO"}</span>
                        <p className="text-7xl md:text-8xl font-black text-slate-950 tracking-tighter leading-none group-hover:scale-105 transition-transform">${data.budget?.averageMeal?.toLocaleString() || '25,000'}</p>
                     </div>
                  </div>
               </div>
            </section>

            {/* Guía del Arriero */}
            <section className="grid grid-cols-1 gap-8">
               <div className="p-10 md:p-20 rounded-[64px] bg-[#1E5233] text-white flex flex-col gap-16 relative overflow-hidden shadow-2xl border-4 border-white/10">
                  <div className="relative z-10 flex flex-col gap-16 items-start w-full">
                     <div className="flex flex-col md:flex-row gap-12 items-center md:items-start w-full">
                        <div className="relative shrink-0">
                           <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 bg-white/5 overflow-hidden backdrop-blur-md shadow-2xl relative z-10">
                              <SafeImage alt="Arriero" src="https://images.unsplash.com/photo-1596570073289-535359b85642?auto=format&fit=crop&q=80&w=400" className="opacity-90 scale-125" />
                           </div>
                           <motion.div 
                              initial={{ scale: 0, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                              className="absolute -bottom-2 -right-2 z-20 bg-paisa-gold p-4 rounded-3xl shadow-xl border-4 border-[#1E5233] flex items-center justify-center"
                           >
                              <Award size={32} className="text-[#1E5233]" fill="currentColor" />
                           </motion.div>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-6">
                          <span className="text-paisa-gold text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center md:justify-start gap-4">
                             <Compass size={20} strokeWidth={3} className="animate-pulse" />
                             {t.arrieroGuide || "GUÍA DEL ARRIERO"}
                          </span>
                          <div className="relative inline-block px-4">
                            <Quote className="absolute -left-12 -top-10 opacity-20 text-white" size={80} />
                            <p className="text-4xl md:text-7xl font-serif italic leading-[1.1] text-white drop-shadow-2xl">
                               "{data.neighborTip || '¡Eavemaría mijo! Venga a conocer que esto aquí es un paraíso.'}"
                            </p>
                          </div>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                        {arrieroTips.map((tip, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                className="p-10 rounded-[48px] bg-white/5 border border-white/10 flex flex-col gap-6 hover:bg-white/10 transition-all group backdrop-blur-sm shadow-inner relative overflow-hidden"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl bg-white/10 ${tip.color} shadow-lg group-hover:scale-110 transition-transform`}>
                                      <tip.icon size={24} strokeWidth={3} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60">{tip.label}</span>
                                </div>
                                <p className="text-xl font-serif italic text-white leading-relaxed font-medium relative z-10">"{tip.val}"</p>
                                
                                <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                                   <tip.icon size={120} />
                                </div>
                            </motion.div>
                        ))}
                     </div>
                  </div>
                  
                  {/* Decoración Fondo */}
                  <div className="absolute -bottom-40 -right-40 opacity-[0.03] pointer-events-none rotate-12">
                    <MessageSquare size={600} strokeWidth={0.5} />
                  </div>
                  <div className="absolute top-20 left-20 opacity-[0.03] pointer-events-none">
                     <Activity size={300} strokeWidth={1} />
                  </div>
               </div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
