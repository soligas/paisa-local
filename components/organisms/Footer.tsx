
import React from 'react';
import { ShieldCheck, Heart, MapPin, Instagram, Mail, ExternalLink, CheckCircle } from 'lucide-react';
import { PaisaLogo } from '../atoms/PaisaLogo';

export const Footer = ({ isDark }: { isDark?: boolean }) => {
  return (
    <footer className={`mt-16 border-t py-16 px-6 md:px-12 transition-colors duration-1000 ${isDark ? 'bg-[#0A0E12] border-white/5 text-white/40' : 'bg-white border-slate-100 text-slate-400'}`}>
      <div className="layout-container flex flex-col items-center text-center space-y-16">
        <div className="space-y-6">
          <PaisaLogo isDark={isDark} className="scale-125 mb-4 justify-center" />
          <p className="text-xl md:text-2xl font-serif italic max-w-2xl mx-auto leading-relaxed">
            "Transformando el turismo en una herramienta de regeneración social y económica para las montañas de Antioquia."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl pt-10 border-t border-slate-100/50">
           <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-paisa-emerald">Nuestra Red</h5>
              <a 
                href="https://instagram.com/paisalocal.pro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-4 px-6 py-4 rounded-3xl bg-slate-950 text-white hover:bg-paisa-gold hover:text-slate-950 transition-all shadow-xl mx-auto md:mx-0"
              >
                <Instagram size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">@paisalocal.pro</span>
                <ExternalLink size={12} className="opacity-30 group-hover:opacity-100" />
              </a>
           </div>

           <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-paisa-emerald">Verificación</h5>
              <div className="flex flex-col gap-3">
                 <div className="flex items-center justify-center md:justify-start gap-3 text-[10px] font-bold uppercase text-slate-400">
                    <CheckCircle size={14} className="text-paisa-emerald" /> Datos Logísticos 2024
                 </div>
                 <div className="flex items-center justify-center md:justify-start gap-3 text-[10px] font-bold uppercase text-slate-400">
                    <ShieldCheck size={14} className="text-paisa-emerald" /> Seguridad Vial Reportada
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-paisa-emerald">Contacto</h5>
              <a href="mailto:hola@paisalocal.pro" className="flex items-center justify-center md:justify-start gap-3 text-[10px] font-black uppercase text-slate-400 hover:text-paisa-emerald transition-colors">
                 <Mail size={16} /> hola@paisalocal.pro
              </a>
              <div className="flex items-center justify-center md:justify-start gap-3 text-[10px] font-black uppercase text-slate-400">
                 <MapPin size={16} /> Medellín, Antioquia
              </div>
           </div>
        </div>

        <div className="pt-12 w-full flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 border-t border-slate-50">
          <p className="text-[9px] font-black uppercase tracking-[0.2em]">© 2024 Paisa Local Pro. Hecho con berraca voluntad.</p>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-paisa-emerald transition-colors">Términos</a>
            <a href="#" className="hover:text-paisa-emerald transition-colors">Privacidad</a>
            <a href="#" className="hover:text-paisa-emerald transition-colors">Pueblos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
