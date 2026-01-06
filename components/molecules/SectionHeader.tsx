
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon?: LucideIcon;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon: Icon }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-8">
    <div className="space-y-4">
      <div className="flex items-center gap-6 text-paisa-emerald">
        {Icon && <Icon size={32} strokeWidth={2.5} />}
        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">{title}</h3>
      </div>
      <p className="text-xl md:text-2xl opacity-40 italic font-medium">{subtitle}</p>
    </div>
    <div className="h-px flex-1 bg-slate-200 mx-12 hidden lg:block opacity-30"></div>
  </div>
);
