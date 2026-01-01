
import React, { useState } from 'react';
import { Camera } from './components/Camera.tsx';
import { ResultDisplay } from './components/ResultDisplay.tsx';
import { analyzeDimensions } from './services/geminiService.ts';
import { AppStatus, Dimensions, MeasurementMode } from './types.ts';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [mode, setMode] = useState<MeasurementMode>('object');
  const [results, setResults] = useState<Dimensions | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCapture = async (base64Image: string) => {
    setStatus('analyzing');
    setErrorMessage(null);
    try {
      const data = await analyzeDimensions(base64Image, mode);
      setResults(data);
      setStatus('result');
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao processar imagem. Verifique sua conexão e tente novamente.");
      setStatus('error');
    }
  };

  const resetApp = () => {
    setStatus('idle');
    setResults(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8 font-sans">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20 mb-4">
           <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
           <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Gemini Vision AI</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Régua IA 3D
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Meça objetos ou a altura de pessoas instantaneamente usando inteligência artificial avançada.
        </p>
      </header>

      <main className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        {status === 'idle' && (
          <div className="w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-full max-w-xs mx-auto shadow-inner">
               <button 
                onClick={() => setMode('object')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${mode === 'object' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 📦 Objetos
               </button>
               <button 
                onClick={() => setMode('person')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${mode === 'person' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 👤 Pessoas
               </button>
            </div>

            <div className="bg-slate-900/50 p-12 rounded-[2.5rem] border border-slate-800 flex flex-col items-center max-w-md mx-auto shadow-2xl">
               <div className={`w-24 h-24 bg-gradient-to-br rounded-3xl flex items-center justify-center mb-6 shadow-2xl transition-transform hover:rotate-6 ${
                 mode === 'object' ? 'from-cyan-500 to-blue-600' : 'from-red-500 to-orange-600'
               }`}>
                  {mode === 'object' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                  )}
               </div>
               <h3 className="text-xl font-bold mb-3">
                 {mode === 'object' ? 'Medir um Objeto' : 'Medir Estatura'}
               </h3>
               <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                 {mode === 'object' 
                   ? 'Aponte a câmera para o objeto. Tente incluir algum objeto comum próximo para maior precisão.'
                   : 'Posicione a pessoa a cerca de 2-3 metros. Garanta que os pés e a cabeça estejam visíveis.'}
               </p>
               <button
                onClick={() => setStatus('camera')}
                className={`w-full text-slate-950 font-bold py-4 px-8 rounded-2xl transition-colors shadow-lg active:scale-95 ${
                  mode === 'object' ? 'bg-white hover:bg-cyan-50' : 'bg-white hover:bg-red-50'
                }`}
              >
                Ativar Câmera
              </button>
            </div>
          </div>
        )}

        {(status === 'camera' || status === 'analyzing') && (
          <div className="w-full space-y-6">
            <Camera onCapture={handleCapture} isAnalyzing={status === 'analyzing'} mode={mode} />
            
            {status === 'analyzing' && (
              <div className="text-center space-y-4 animate-pulse">
                <div className={`inline-flex items-center gap-3 px-6 py-3 bg-slate-900 border rounded-full ${
                  mode === 'person' ? 'border-red-500/30' : 'border-cyan-500/30'
                }`}>
                  <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                    mode === 'person' ? 'border-red-400' : 'border-cyan-400'
                  }`} />
                  <span className={mode === 'person' ? 'text-red-400 font-semibold' : 'text-cyan-400 font-semibold'}>
                    {mode === 'person' ? 'Calculando estatura...' : 'Analisando proporções espaciais...'}
                  </span>
                </div>
              </div>
            )}
            
            {status === 'camera' && (
              <button 
                onClick={() => setStatus('idle')}
                className="mx-auto block text-slate-500 hover:text-white transition-colors text-sm font-medium"
              >
                Cancelar e mudar modo
              </button>
            )}
          </div>
        )}

        {status === 'result' && results && (
          <div className="w-full animate-in zoom-in-95 fade-in duration-500">
            <ResultDisplay dimensions={results} onReset={resetApp} />
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-500/30">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">{errorMessage}</p>
            <button onClick={resetApp} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl">
              Tentar Novamente
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-12 pt-8 border-t border-slate-900 text-center text-slate-600 text-xs">
        <p>© 2024 Gemini Ruler AI - Medição Inteligente de Objetos e Pessoas</p>
      </footer>
    </div>
  );
};

export default App;
