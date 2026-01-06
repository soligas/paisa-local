
import React from 'react';
import { ShieldCheck, Heart, MapPin, Instagram, Twitter, Mail } from 'lucide-react';
import { PaisaLogo } from '../atoms/PaisaLogo';

export const Footer = ({ isDark }: { isDark?: boolean }) => {
  return (
    <footer className={`mt-32 border-t py-24 px-12 transition-colors duration-1000 ${isDark ? 'bg-[#0A0E12] border-white/5 text-white/40' : 'bg-white border-slate-100 text-slate-400'}`}>
      <div className="layout-container flex flex-col items-center text-center space-y-12">
        <PaisaLogo isDark={isDark} className="scale-125 mb-4" />
        
        <p className="text-xl font-serif italic max-w-xl mx-auto leading-relaxed">
          "Transformando el turismo en una herramienta de regeneración social y económica para las montañas de Antioquia."
        </p>

        <div className="flex gap-8">
           <a href="#" className="p-4 rounded-full bg-slate-50 hover:bg-paisa-emerald hover:text-white transition-all duration-300">
             <Instagram size={22} />
           </a>
           <a href="#" className="p-4 rounded-full bg-slate-50 hover:bg-paisa-emerald hover:text-white transition-all duration-300">
             <Twitter size={22} />
           </a>
           <a href="#" className="p-4 rounded-full bg-slate-50 hover:bg-paisa-emerald hover:text-white transition-all duration-300">
             <Mail size={22} />
           </a>
        </div>

        <div className="pt-12 border-t w-full flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
          <p className="text-[10px] font-black uppercase tracking-widest">© 2024 Paisa Local Pro. Medellín, Antioquia.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <span className="cursor-pointer hover:text-paisa-emerald">Términos</span>
            <span className="cursor-pointer hover:text-paisa-emerald">Seguridad</span>
            <span className="cursor-pointer hover:text-paisa-emerald">Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
