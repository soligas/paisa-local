
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Bus, ShieldCheck, Sun, Accessibility, 
  Loader2, Truck, Compass, Star,
  MapPin, Navigation, ShieldAlert,
  Wallet, Utensils, Users, Calculator,
  ExternalLink, Banknote, Sparkles, TrendingUp, Share2, Plus, Minus,
  Activity, Instagram, Youtube, PlayCircle, Map, Waves, Coins,
  CreditCard, Store, Landmark, Info, Briefcase, Footprints, UserCheck, Bike,
  CheckCircle2, AlertCircle, Flag, Link as LinkIcon, ShoppingCart, Coffee, Clock,
  X, Repeat, ChevronRight, MapPinned, Award, Shield, ShoppingBag, Lightbulb
} from 'lucide-react';
import { PlaceData, SupportedLang, CharcoTactico, FinancialSpot, GastroRecommendation, LocalTour } from '../types';
import { SafeImage } from './atoms/SafeImage';
import { Badge } from './atoms/Badge';
import { generateSmartItinerary, generateTacticalRecommendations, generateLocalTours } from '../services/geminiService';
import { TRANSLATIONS } from '../constants/translations';

interface PlaceCardProps {
  data: PlaceData;
  lang: SupportedLang;
  i18n: any;
  isFavorite: boolean;
  onToggleFavorite: (title: string) => void;
  onRequestPayment: () => void;
}

type TabType = 'logistica' | 'economia' | 'aventura';

const RouteGraphic = ({ terminalInfo, localMobility, region }: { terminalInfo: string, localMobility: any, region: string }) => {
  return (
    <div className="relative py-20 px-4 flex flex-col items-center gap-16">
      {/* Connecting Line */}
      <div className="absolute top-24 bottom-24 w-0.5 bg-slate-200 left-1/2 -translate-x-1/2" />
      
      {/* Node 1: Start (Medellín) */}
      <div className="relative flex flex-col items-center gap-3">
         <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 z-10 shadow-sm">
            <Flag size={28} strokeWidth={2} />
         </div>
         <span className="font-tactical text-[12px] font-bold uppercase text-slate-400 tracking-[0.2em]">MEDELLÍN</span>
      </div>

      {/* Node 2: Terminal / Transition */}
      <div className="relative flex flex-col items-center gap-3">
         <div className="w-20 h-20 rounded-full bg-[#2D7A4C] text-white flex items-center justify-center z-10 shadow-[0_15px_35px_-5px_rgba(45,122,76,0.3)] ring-4 ring-white">
            <Bus size={36} strokeWidth={2.5} />
         </div>
         <span className="font-tactical text-[14px] font-black uppercase text-[#2D7A4C] tracking-[0.3em]">{region.toUpperCase()}</span>
      </div>

      {/* Node 3: Local Mobility */}
      <div className="relative flex flex-col items-center gap-3">
         <div className="w-16 h-16 rounded-full bg-white border-2 border-[#D4A574] flex items-center justify-center text-[#D4A574] z-10 shadow-md ring-4 ring-white">
            <Bike size={28} strokeWidth={2} />
         </div>
         <div className="max-w-[220px] text-center">
           <span className="font-tactical text-[10px] font-black uppercase text-[#D4A574] tracking-wider leading-tight">
              {localMobility?.type?.toUpperCase() || "BUSES CIRCULARES Y TAXIS DE MONTAÑA"}
           </span>
         </div>
      </div>

      {/* Node 4: Destination */}
      <div className="relative flex flex-col items-center gap-3">
         <div className="w-16 h-16 rounded-full bg-[#0f172a] text-white flex items-center justify-center z-10 shadow-xl ring-4 ring-white">
            <MapPin size={28} strokeWidth={2.5} />
         </div>
         <span className="font-tactical text-[12px] font-black uppercase text-slate-900 tracking-[0.2em]">DESTINO</span>
      </div>
    </div>
  );
};

export const PlaceCard: React.FC<PlaceCardProps> = ({ data, lang, i18n, isFavorite, onToggleFavorite, onRequestPayment }) => {
  const [activeTab, setActiveTab] = useState<TabType>('logistica');
  const [numPeople, setNumPeople] = useState(1);
  const [numMeals, setNumMeals] = useState(1);
  
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [itinerary, setItinerary] = useState<any[] | null>(null);
  const [loadingTours, setLoadingTours] = useState(false);
  const [tours, setTours] = useState<LocalTour[] | null>(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const ticketCost = data.budget?.busTicket || 35000;
  const mealCost = data.budget?.averageMeal || 25000;
  const stayCost = data.budget?.dailyStay || 80000;
  
  const totalTransport = ticketCost * numPeople * 2;
  const totalFood = mealCost * numPeople * numMeals;
  const totalStay = stayCost * numPeople;
  const totalBudget = totalTransport + totalFood + totalStay;

  const handleGetItinerary = async () => {
    setLoadingItinerary(true);
    const res = await generateSmartItinerary(data.titulo, lang);
    if (res) setItinerary(res.itinerary);
    setLoadingItinerary(false);
  };

  const handleGetTours = async () => {
    setLoadingTours(true);
    const res = await generateLocalTours(data.titulo, lang);
    if (res) setTours(res);
    setLoadingTours(false);
  };

  return (
    <motion.div layout className="w-full max-w-6xl mx-auto px-6 space-y-16">
      
      <div className="rounded-[64px] bg-[#ffffff] shadow-4xl border border-[#e2e8f0] overflow-hidden flex flex-col relative">
        <div className="relative h-[400px] md:h-[600px] w-full">
           <SafeImage src={data.imagen} alt={data.titulo} region={data.region} className="w-full h-full object-cover" />
           <div className="absolute inset-0 scrim-bottom opacity-80" />
           <div className="absolute top-10 right-10">
              <button onClick={() => onToggleFavorite(data.titulo)} className={`p-6 rounded-full border-4 transition-all shadow-2xl active:scale-90 ${isFavorite ? 'bg-[#ef4444] text-[#ffffff] border-[#ef4444]' : 'bg-[#ffffff] text-[#cbd5e1] border-[#ffffff] hover:border-[#2D7A4C] hover:text-[#2D7A4C]'}`}>
                <Heart size={32} fill={isFavorite ? "#ffffff" : "none"} strokeWidth={3} />
              </button>
           </div>
           <div className="absolute bottom-16 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-6">
                 <Badge color="gold" className="text-sm py-2 px-6 shadow-xl border-2 border-white/20">REGIÓN {data.region?.toUpperCase()}</Badge>
                 <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-[#ffffff] leading-[0.75] text-shadow-tactical drop-shadow-2xl">{data.titulo}</h1>
              </div>
              <div className="px-10 py-6 bg-[#0f172a] rounded-[32px] border-2 border-white/20 text-[#ffffff] text-center shadow-2xl">
                 <span className="font-tactical block text-[12px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">VIBE SCORE</span>
                 <span className="text-4xl font-black text-[#D4A574]">{data.vibeScore || 95}%</span>
              </div>
           </div>
        </div>
        <div className="p-12 md:p-24 bg-[#ffffff] space-y-12">
           <p className="text-4xl md:text-6xl font-serif italic text-[#1e293b] leading-[1.1] max-w-5xl">"{data.descripcion}"</p>
           
           {/* Tactical Support Pill integrated into place card content as shown in screenshot */}
           <button 
              onClick={onRequestPayment}
              className="w-fit py-5 px-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center gap-4 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95 shadow-lg group mx-auto md:mx-0"
            >
               <div className="flex gap-1.5 items-center opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                  <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
               </div>
               <span className="text-[14px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                 {t.mapLabels.impulsar}
               </span>
               <div className="flex gap-1.5 items-center opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                  <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
               </div>
            </button>
        </div>
      </div>

      <div className="sticky top-[100px] z-[40] p-4 bg-white/95 backdrop-blur-xl rounded-[48px] gap-4 shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-[#e2e8f0] flex max-w-4xl mx-auto w-full">
        {(['logistica', 'economia', 'aventura'] as TabType[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-8 md:py-12 rounded-[40px] flex flex-col items-center justify-center gap-4 transition-all duration-500 border-4 ${activeTab === tab ? 'bg-[#2D7A4C] text-[#ffffff] border-[#2D7A4C] shadow-2xl scale-[1.05]' : 'bg-[#ffffff] text-[#64748b] border-transparent hover:bg-[#f8fafc] hover:text-[#1e293b] shadow-sm'}`}>
            {tab === 'logistica' ? <Truck size={32} strokeWidth={3} /> : tab === 'economia' ? <Banknote size={32} strokeWidth={3} /> : <Compass size={32} strokeWidth={3} />}
            <span className="text-[13px] md:text-[15px] font-black uppercase tracking-[0.25em]">{i18n.tabs[tab]}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[700px] pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'logistica' && (
            <motion.div key="log" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-[#f0f9f4] p-14 rounded-[72px] border-4 border-[#2D7A4C]/10 space-y-14 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                     <h3 className="text-3xl font-black uppercase tracking-widest text-[#064e3b] flex items-center gap-5"><Bus size={36} strokeWidth={3} /> LOGÍSTICA</h3>
                     <Badge color="emerald" className="px-6 py-2 border-2 border-white">VERIFICADO</Badge>
                  </div>
                  
                  {/* Correct 4-node vertical graphic from screenshot */}
                  <RouteGraphic 
                    terminalInfo={data.terminalInfo || "Terminal del Norte"} 
                    localMobility={data.localMobility || { type: "Buses circulares y taxis de montaña (Willys para veredas)." }} 
                    region={data.region || "Antioquia"}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-[#ffffff] p-12 rounded-[48px] shadow-sm border-2 border-[#dcfce7] text-center space-y-4">
                        <span className="font-tactical text-[11px] font-black uppercase tracking-widest text-[#2D7A4C] block">{i18n.buses}</span>
                        <span className="text-3xl font-black text-[#0f172a] leading-none">{data.busFrequency}</span>
                     </div>
                     <div className="bg-[#ffffff] p-12 rounded-[48px] shadow-sm border-2 border-[#dcfce7] text-center space-y-4">
                        <span className="font-tactical text-[11px] font-black uppercase tracking-widest text-[#2D7A4C] block">{i18n.departure}</span>
                        <span className="text-3xl font-black text-[#0f172a] leading-none">{data.terminalInfo}</span>
                     </div>
                  </div>
               </div>
               <div className="bg-[#0f172a] p-14 rounded-[72px] text-[#ffffff] space-y-14 shadow-4xl relative overflow-hidden border-4 border-white/5">
                  <div className="absolute top-0 right-0 p-32 text-[#1e293b]/50 pointer-events-none">
                     <Briefcase size={240} strokeWidth={1} />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-widest text-[#D4A574] flex items-center gap-6 relative z-10"><Briefcase size={40} strokeWidth={3} /> {i18n.packingTitle}</h3>
                  <div className="grid grid-cols-1 gap-6 relative z-10">
                     {data.packingList.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-8 p-8 rounded-[36px] bg-[#1e293b] border-2 border-white/10 group hover:bg-[#2D7A4C] transition-all hover:border-[#2D7A4C]">
                          <CheckCircle2 size={32} className="text-[#D4A574] group-hover:text-white transition-colors" strokeWidth={3} />
                          <span className="text-2xl font-black uppercase tracking-[0.1em] text-[#f1f5f9]">{item}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'economia' && (
            <motion.div key="eco" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-16 p-8">
               {/* LADO IZQUIERDO: CONTROLES Y GASTRONOMÍA */}
               <div className="space-y-20">
                  {/* VIAJEROS */}
                  <div className="flex items-center justify-between">
                     <span className="text-lg font-black uppercase tracking-[0.3em] text-[#78350f] opacity-80">VIAJEROS</span>
                     <div className="flex items-center gap-12">
                        <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))} className="w-16 h-16 rounded-full border-2 border-[#D4A574] flex items-center justify-center text-[#78350f] hover:bg-[#D4A574]/10 transition-all"><Minus size={24} strokeWidth={3} /></button>
                        <span className="text-6xl font-black text-[#451a03] min-w-[60px] text-center">{numPeople}</span>
                        <button onClick={() => setNumPeople(numPeople + 1)} className="w-16 h-16 rounded-full border-2 border-[#D4A574] flex items-center justify-center text-[#78350f] hover:bg-[#D4A574]/10 transition-all"><Plus size={24} strokeWidth={3} /></button>
                     </div>
                  </div>

                  {/* COMIDAS/DÍA */}
                  <div className="flex items-center justify-between">
                     <span className="text-lg font-black uppercase tracking-[0.3em] text-[#78350f] opacity-80">COMIDAS/DÍA</span>
                     <div className="flex items-center gap-12">
                        <button onClick={() => setNumMeals(Math.max(1, numMeals - 1))} className="w-16 h-16 rounded-full border-2 border-[#D4A574] flex items-center justify-center text-[#78350f] hover:bg-[#D4A574]/10 transition-all"><Minus size={24} strokeWidth={3} /></button>
                        <span className="text-6xl font-black text-[#451a03] min-w-[60px] text-center">{numMeals}</span>
                        <button onClick={() => setNumMeals(numMeals + 1)} className="w-16 h-16 rounded-full border-2 border-[#D4A574] flex items-center justify-center text-[#78350f] hover:bg-[#D4A574]/10 transition-all"><Plus size={24} strokeWidth={3} /></button>
                     </div>
                  </div>

                  <div className="h-px bg-[#e2e8f0] w-full" />

                  {/* RECOMENDACIONES GASTRONÓMICAS */}
                  <div className="space-y-12">
                     <div className="flex items-center gap-5 text-[#78350f]">
                        <Utensils size={32} strokeWidth={3} />
                        <h3 className="text-2xl font-black uppercase tracking-widest">RECOMENDACIONES GASTRONÓMICAS</h3>
                     </div>

                     <div className="space-y-6">
                        {(data.gastronomia || []).map((plato, idx) => (
                          <div key={idx} className="p-10 rounded-[40px] border-2 border-[#fcd34d]/30 bg-white shadow-lg space-y-4">
                             <div className="flex justify-between items-start">
                                <h4 className="text-xl font-black uppercase tracking-tight text-[#451a03] flex-1">{plato.nombre}</h4>
                                <span className="text-2xl font-black text-[#78350f]">${plato.precio.toLocaleString()}</span>
                             </div>
                             <p className="text-sm font-medium text-[#78350f]/60 leading-relaxed uppercase tracking-widest">{plato.descripcion}</p>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* LADO DERECHO: CARD DE TOTAL Y DESGLOSE */}
               <div className="flex flex-col gap-10">
                  <div className="bg-[#5c2d11] p-16 rounded-[64px] text-white shadow-4xl space-y-14 border-4 border-white/5 relative overflow-hidden">
                     {/* Fondo decorativo sutil */}
                     <div className="absolute top-0 right-0 p-32 text-white/5 pointer-events-none">
                        <Calculator size={300} strokeWidth={1} />
                     </div>

                     <div className="space-y-4 relative z-10">
                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#D4A574]">TOTAL ESTIMADO COP</span>
                        <div className="text-8xl font-black tracking-tighter text-white drop-shadow-2xl">${totalBudget.toLocaleString()}</div>
                     </div>

                     <div className="h-px bg-white/10 w-full relative z-10" />

                     <div className="space-y-10 relative z-10">
                        <div className="flex justify-between items-center text-xl">
                           <span className="font-black uppercase tracking-widest text-white/60">TRANSPORTE</span>
                           <span className="font-black">${totalTransport.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl">
                           <span className="font-black uppercase tracking-widest text-white/60">ALIMENTACIÓN</span>
                           <span className="font-black">${totalFood.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl">
                           <span className="font-black uppercase tracking-widest text-white/60">ALOJAMIENTO</span>
                           <span className="font-black">${totalStay.toLocaleString()}</span>
                        </div>
                     </div>

                     <div className="pt-10 relative z-10">
                        <div className="bg-black/20 p-8 rounded-[36px] flex items-start gap-6 border border-white/10">
                           <div className="p-3 bg-white/10 rounded-2xl text-[#D4A574]">
                              <Info size={24} strokeWidth={3} />
                           </div>
                           <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed text-white/70">
                              LOS PRECIOS SON PROMEDIOS LOCALES ACTUALES. EL EFECTIVO ES CLAVE PARA NEGOCIAR.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'aventura' && (
            <motion.div key="ave" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-20">
               {/* Tours Recomendados */}
               {tours && (
                 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-white to-[#f8fafc] p-14 rounded-[80px] border-4 border-slate-200 space-y-16 shadow-4xl relative overflow-hidden">
                    <div className="flex items-center gap-6">
                       <div className="p-5 rounded-3xl bg-[#D4A574] text-white shadow-xl"><MapPinned size={40} strokeWidth={3} /></div>
                       <h4 className="text-4xl font-black uppercase tracking-tighter text-slate-900">TOURS IDEALES RECOMENDADOS</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                       {tours.map((tour, idx) => (
                         <div key={idx} className="p-12 rounded-[56px] bg-white border-4 border-slate-100 space-y-8 shadow-2xl hover:border-[#2D7A4C]/30 transition-all group relative">
                            <Badge color="emerald" className="px-6 py-2 border-2 border-white shadow-md">{tour.duracion}</Badge>
                            <h5 className="text-3xl font-black uppercase leading-[1.1] text-slate-900 group-hover:text-[#2D7A4C] transition-colors">{tour.nombre}</h5>
                            <p className="text-lg text-slate-600 italic font-medium leading-relaxed">"{tour.descripcion}"</p>
                            <div className="pt-8 border-t-2 border-slate-100 space-y-5">
                               <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">INCLUYE:</span>
                               {tour.incluye.map((inc, i) => (
                                 <div key={i} className="flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#2D7A4C]" />
                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{inc}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}

               {itinerary && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 p-16 rounded-[80px] border-4 border-white/10 space-y-14 shadow-4xl relative">
                   <button onClick={() => setItinerary(null)} className="absolute top-12 right-12 text-white/40 hover:text-white p-3 hover:bg-white/10 rounded-full transition-all">
                    <X size={40} strokeWidth={4} />
                   </button>
                   <h4 className="text-3xl font-black uppercase tracking-widest text-[#D4A574] flex items-center gap-5">
                    <Clock size={36} strokeWidth={3} /> ITINERARIO TÁCTICO
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {itinerary.map((stop, idx) => (
                        <div key={idx} className="p-10 bg-white/5 rounded-[48px] border-2 border-white/10 space-y-5 hover:bg-white/10 transition-all">
                           <span className="text-[#D4A574] font-black text-xl tracking-widest border-b-2 border-[#D4A574]/30 pb-2 inline-block">{stop.hora}</span>
                           <h5 className="text-2xl font-black text-white uppercase leading-tight">{stop.actividad}</h5>
                           <p className="text-[13px] italic text-[#D4A574]/80 leading-relaxed font-medium">"{stop.tip}"</p>
                        </div>
                      ))}
                   </div>
                 </motion.div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {(data.charcosTacticos || []).map((charco, idx) => (
                    <div key={idx} className="bg-[#ffffff] p-14 rounded-[64px] border-4 border-[#e2e8f0] shadow-2xl space-y-10 group relative overflow-hidden transition-all hover:border-[#2D7A4C]">
                       <div className="w-20 h-20 rounded-[28px] bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-[#ffffff] transition-all shadow-lg border-2 border-transparent group-hover:border-white">
                          <Waves size={40} strokeWidth={3} />
                       </div>
                       <div className="space-y-6">
                          <h4 className="text-4xl font-black uppercase text-[#0f172a] group-hover:text-[#2D7A4C] transition-colors">{charco.nombre}</h4>
                          <p className="text-xl font-serif italic text-slate-600 leading-relaxed">"{charco.descripcion}"</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="bg-[#1A4731] p-16 md:p-32 rounded-[100px] text-center space-y-20 shadow-4xl relative overflow-hidden border-8 border-white/5">
                  <div className="absolute inset-0 map-grid opacity-10" />
                  <div className="relative z-10 space-y-12">
                    <h3 className="text-[#ffffff] text-6xl md:text-9xl font-serif italic max-w-5xl mx-auto leading-[0.85] tracking-tight drop-shadow-2xl">"¿Listo para que la IA le arme el plan perfecto, mijo?"</h3>
                    <div className="flex flex-wrap items-center justify-center gap-10">
                       <button onClick={handleGetItinerary} disabled={loadingItinerary} className="px-14 py-8 rounded-[40px] bg-[#ffffff] text-[#2D7A4C] font-black uppercase text-[15px] tracking-[0.3em] shadow-4xl hover:scale-105 transition-all flex items-center gap-5 border-4 border-transparent hover:border-[#D4A574]">
                          {loadingItinerary ? <Loader2 className="animate-spin" size={24} /> : <><Sparkles size={24} strokeWidth={3} /> GENERAR ITINERARIO</>}
                       </button>
                       <button onClick={handleGetTours} disabled={loadingTours} className="px-14 py-8 rounded-[40px] bg-[#D4A574] text-slate-950 font-black uppercase text-[15px] tracking-[0.3em] shadow-4xl hover:scale-105 transition-all flex items-center gap-5 border-4 border-transparent hover:border-white">
                          {loadingTours ? <Loader2 className="animate-spin" size={24} /> : <><MapPinned size={24} strokeWidth={3} /> VER TOURS IDEALES</>}
                       </button>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
