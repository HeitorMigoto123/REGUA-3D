
import React from 'react';
import { Dimensions } from '../types';

// Fix: Create an interface for IconWrapper to explicitly define the children prop, satisfying TypeScript requirements in React 18+.
interface IconWrapperProps {
  children: React.ReactNode;
}

// Fix: Use React.FC with IconWrapperProps to ensure the component is recognized as accepting children in JSX.
const IconWrapper: React.FC<IconWrapperProps> = ({ children }) => (
  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
    {children}
  </div>
);

interface ResultDisplayProps {
  dimensions: Dimensions;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ dimensions, onReset }) => {
  const isPerson = dimensions.mode === 'person';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isPerson ? 'Medição de Estatura' : 'Resultados da Medição'}
          </h2>
          <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">IA Estimada</span>
        </div>

        <div className="text-slate-400 text-sm">
          {isPerson ? 'Pessoa Identificada' : `Objeto detectado: `}
          <span className="text-white font-semibold">{isPerson ? 'Humano' : dimensions.object_name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center group hover:border-cyan-500/50 transition-colors">
            {/* Fix: IconWrapper now properly types the children passed between its tags. */}
            <IconWrapper>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/><path d="M3 16.2V21m0 0h4.8M3 21l6-6"/><path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"/><path d="M3 7.8V3m0 0h4.8M3 3l6 6"/></svg>
            </IconWrapper>
            <span className="text-xs text-slate-500 uppercase font-bold mt-4 mb-1">
              {isPerson ? 'Envergadura' : 'Largura'}
            </span>
            <span className="text-3xl font-black text-white">{dimensions.width_cm} <span className="text-sm font-normal text-slate-400">cm</span></span>
          </div>

          <div className="bg-cyan-500/10 p-6 rounded-2xl border border-cyan-500/30 flex flex-col items-center text-center scale-105 shadow-lg shadow-cyan-900/10">
             <IconWrapper>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="m11 12 4-4 4 4"/><path d="M15 8v12"/></svg>
            </IconWrapper>
            <span className="text-xs text-cyan-500 uppercase font-bold mt-4 mb-1">
              {isPerson ? 'Altura Total' : 'Altura'}
            </span>
            <span className="text-4xl font-black text-white">{dimensions.height_cm} <span className="text-sm font-normal text-slate-400">cm</span></span>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center group hover:border-cyan-500/50 transition-colors">
             <IconWrapper>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </IconWrapper>
            <span className="text-xs text-slate-500 uppercase font-bold mt-4 mb-1">
              {isPerson ? 'Perfil' : 'Profundidade'}
            </span>
            <span className="text-3xl font-black text-white">{dimensions.depth_cm} <span className="text-sm font-normal text-slate-400">cm</span></span>
          </div>
        </div>

        <div className="bg-cyan-500/5 p-4 rounded-xl border border-cyan-500/10">
          <p className="text-cyan-200/70 text-sm leading-relaxed italic text-center">
            &quot;{dimensions.explanation}&quot;
          </p>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-4 px-6 rounded-2xl text-white font-bold shadow-lg shadow-cyan-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          Nova Medição
        </button>
      </div>
    </div>
  );
};
