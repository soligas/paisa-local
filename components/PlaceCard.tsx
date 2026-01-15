
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Heart, Bus, Wallet, ShieldCheck, Zap, 
  Maximize2, Minimize2, Utensils, Users, Sun, Accessibility, 
  Loader2, CheckCircle, Map, Play, Instagram, MessageSquare, Moon, ExternalLink, Info
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

  const handleGenerateItinerary = async () => {
    setLoadingItinerary(true);
    const result = await generateSmartItinerary(data.titulo, lang);
    setItinerary(result);
    setLoadingItinerary(false);
  };

  const normalizeForHashtag = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();
  };

  const quickActions = [
    { 
      label: i18n?.quickMap || "Mapa Real", 
      icon: Map, 
      color: 'text-blue-500',
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.titulo + " Antioquia")}`
    },
    { 
      label: i18n?.quickVideo || "Video Guía", 
      icon: Play, 
      color: 'text-red-500',
      href: `https://www.youtube.com/results?search_query=${encodeURIComponent("Guia de viaje " + data.titulo + " Antioquia")}`
    },
    { 
      label: i18n?.quickFood || "Comida", 
      icon: Utensils, 
      color: 'text-paisa-emerald',
      href: `https://www.google.com/search?q=${encodeURIComponent("Donde comer en " + data.titulo + " Antioquia")}`
    },
    { 
      label: i18n?.quickSocial || "Red Social", 
      icon: Instagram, 
      color: 'text-purple-500',
      href: `https://www.instagram.com/explore/tags/${normalizeForHashtag(data.titulo)}/`
    }
  ];

  const arrieroTips = [
    { label: 'Sazón de Pueblo', desc: data.foodTip || '¡La sazón de pueblo es única!', icon: Utensils, bg: 'bg-orange-50', color: 'text-orange-600' },
    { label: 'Cultura Arriera', desc: data.cultureTip || "El respeto abre todas las puertas.", icon: MessageSquare, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Logística Táctica', desc: data.logisticsTip || 'El comercio madruga mucho mijo!', icon: Clock, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Gente del Pueblo', desc: data.peopleTip || 'Los locales son los mejores guías.', icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
  ];

  return (
    <motion.div layout className="w-full px-2 md:px-0">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div 
            key="compact" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 bg-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
            onClick={() => setIsExpanded(true)}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg shrink-0 group-hover:scale-105 transition-transform">
              <SafeImage src={data.imagen} alt={data.titulo} region={data.region} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-3 mb-1">
                 <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900">{data.titulo}</h3>
                 <Badge color="emerald" className="scale-75 origin-left">{data.region}</Badge>
              </div>
              <p className="text-slate-400 font-serif italic line-clamp-1 text-sm md:text-base">"{data.descripcion}"</p>
            </div>
            <button className="p-3 md:p-4 rounded-full bg-slate-50 text-slate-400 group-hover:bg-paisa-emerald group-hover:text-white transition-all">
              <Maximize2 size={20} />
            </button>
          </motion.div>
        ) : (
          <motion.div key="full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
            
            {/* Hero Full */}
            <section className="rounded-[40px] md:rounded-[64px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row bg-white relative">
              <div className="w-full md:w-5/12 h-[300px] md:h-auto min-h-[300px] md:min-h-[500px] relative">
                 <SafeImage src={data.imagen} alt={data.titulo} region={data.region} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-8 md:p-12 lg:p-20 space-y-8 md:space-y-10">
                 <div className="flex justify-between items-start">
                    <Badge color="gold" className="text-sm md:text-lg px-4 md:px-6 py-2">{data.region}</Badge>
                    <div className="flex gap-2 md:gap-4">
                      <button onClick={() => setIsExpanded(false)} className="p-3 md:p-4 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100"><Minimize2 size={20} /></button>
                      <button onClick={() => onToggleFavorite(data.titulo)} className={`p-3 md:p-4 rounded-full border transition-all ${isFavorite ? 'bg-red-500 text-white shadow-lg' : 'text-red-300 bg-white'}`}><Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} /></button>
                    </div>
                 </div>
                 <div className="space-y-3 md:space-y-4">
                    <h2 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85]">{data.titulo}</h2>
                    <p className="text-slate-500 text-xl md:text-3xl font-serif italic max-w-2xl leading-snug">"{data.descripcion}"</p>
                 </div>

                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pt-6 border-t border-slate-100">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black uppercase text-slate-300">{i18n?.weather || "Clima"}</span>
                       <div className="flex items-center gap-2 text-paisa-emerald"><Sun size={18} /><span className="text-lg md:text-2xl font-black">22°C</span></div>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-black uppercase text-slate-300">{i18n?.accessibility || "Accesibilidad"}</span>
                       <div className="flex items-center gap-2 text-paisa-emerald"><Accessibility size={18} /><span className="text-lg md:text-2xl font-black">{data.accessibility?.score || 90}%</span></div>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-black uppercase text-slate-300">Seguridad</span>
                       <div className="flex items-center gap-2 text-emerald-600"><ShieldCheck size={18} /><span className="text-lg md:text-2xl font-black">Seguro</span></div>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-black uppercase text-slate-300">Bus</span>
                       <div className="flex items-center gap-2 text-slate-900"><Bus size={18} /><span className="text-lg md:text-2xl font-black">{data.terminalInfo?.split(' ').pop() || 'Norte'}</span></div>
                    </div>
                 </div>

                 <button onClick={handleGenerateItinerary} disabled={loadingItinerary} className="w-full h-16 md:h-24 px-8 md:px-12 rounded-2xl md:rounded-[32px] bg-paisa-emerald text-white flex items-center justify-center gap-4 text-[11px] md:text-[13px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                    {loadingItinerary ? <Loader2 className="animate-spin" /> : <Zap size={24} className="text-paisa-gold" />} 
                    {itinerary ? "Refrescar Plan" : (i18n?.itineraryIA || "Itinerario IA")}
                 </button>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {quickActions.map((action, idx) => (
                 <motion.a 
                    key={idx} 
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -8, scale: 1.02 }} 
                    className="flex flex-col items-center justify-center gap-4 p-8 md:p-14 rounded-[32px] md:rounded-[64px] bg-white border border-slate-100 shadow-lg cursor-pointer group no-underline"
                 >
                   <action.icon size={32} className={`${action.color} group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
                   <span className="text-[10px] md:text-[13px] font-black uppercase tracking-widest text-slate-900 group-hover:text-paisa-emerald">{action.label}</span>
                 </motion.a>
               ))}
            </section>

            {/* Fuentes de Información (Grounding) */}
            {data.groundingLinks && data.groundingLinks.length > 0 && (
              <section className="px-4 py-8 bg-slate-100/50 rounded-[40px] border border-slate-200">
                <div className="flex items-center gap-3 mb-6 px-4">
                  <Info size={16} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{i18n?.sourcesTitle || 'Fuentes Consultadas'}</span>
                </div>
                <div className="flex flex-wrap gap-4 px-4">
                  {data.groundingLinks.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.uri} 
                      target="_blank" 
                      className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl text-[10px] font-bold text-slate-600 border border-slate-200 hover:border-paisa-emerald hover:text-paisa-emerald transition-all shadow-sm group"
                    >
                      {link.title}
                      <ExternalLink size={12} className="opacity-30 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Presupuesto Local */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
               <div className="p-8 md:p-12 rounded-[48px] bg-[#FFFAF0] border border-amber-100 shadow-sm flex flex-col gap-8 relative overflow-hidden group">
                  <div className="flex items-center gap-4 text-amber-700 relative z-10">
                    <Wallet size={24} /> <span className="text-[11px] font-black uppercase tracking-[0.3em]">{i18n?.budgetTitle || "Presupuesto"}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                     <div className="p-8 bg-white/80 backdrop-blur-md rounded-[32px] border border-amber-50">
                        <span className="text-[9px] font-black text-amber-600 uppercase block mb-1">{i18n?.busTicket || "Pasaje"}</span>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">${data.budget?.busTicket?.toLocaleString() || '35,000'}</p>
                     </div>
                     <div className="p-8 bg-white/80 backdrop-blur-md rounded-[32px] border border-amber-50">
                        <span className="text-[9px] font-black text-amber-600 uppercase block mb-1">{i18n?.meal || "Almuerzo"}</span>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">${data.budget?.averageMeal?.toLocaleString() || '25,000'}</p>
                     </div>
                  </div>
               </div>

               <div className="p-8 md:p-12 rounded-[48px] bg-[#F0F7FF] border border-blue-100 flex flex-col gap-8 shadow-sm relative overflow-hidden">
                  <div className="bg-white rounded-[32px] p-8 shadow-sm space-y-1">
                     <span className="text-[10px] font-black uppercase text-blue-500">{i18n?.departurePoint || "Sale de"}</span>
                     <h4 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">{data.terminalInfo || 'Terminal del Norte'}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {data.busCompanies?.map((company, idx) => (
                       <div key={idx} className="px-5 py-2 rounded-full bg-white text-blue-700 text-[9px] font-black uppercase border border-blue-100 shadow-sm">{company}</div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Guía del Arriero */}
            <section className="rounded-[48px] md:rounded-[64px] bg-paisa-emerald p-10 md:p-20 text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 flex flex-col lg:flex-row items-start gap-12 md:gap-16">
                  <div className="shrink-0 flex flex-col items-center lg:items-start gap-6">
                     <div className="w-40 h-40 md:w-56 md:h-56 rounded-[40px] border-4 border-white/20 overflow-hidden bg-white/10 rotate-[-3deg]">
                        <SafeImage src="https://images.unsplash.com/photo-1596570073289-535359b85642?auto=format&fit=crop&q=80&w=400" alt="Arriero" className="opacity-80" />
                     </div>
                  </div>

                  <div className="flex-1 space-y-12">
                     <div className="space-y-4">
                        <span className="text-white/40 text-[11px] font-black uppercase tracking-[0.5em]">{i18n?.arrieroGuide || "Guía del Arriero"}</span>
                        <h4 className="text-4xl md:text-6xl font-serif italic leading-[1.1]">
                          "{data.neighborTip || '¡Eavemaría mijo! Venga a conocer que esto aquí es un paraíso.'}"
                        </h4>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {arrieroTips.map((tip, idx) => (
                           <div key={idx} className="p-8 rounded-[40px] bg-white/10 border border-white/10 flex gap-6 items-start">
                              <div className={`w-14 h-14 rounded-2xl ${tip.bg} ${tip.color} flex items-center justify-center shrink-0`}>
                                 <tip.icon size={28} />
                              </div>
                              <div className="space-y-1">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{tip.label}</span>
                                 <p className="text-lg font-serif italic text-white/90 leading-snug">{tip.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
