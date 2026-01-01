
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MeasurementMode } from '../types';

interface CameraProps {
  onCapture: (base64Image: string) => void;
  isAnalyzing: boolean;
  mode: MeasurementMode;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, isAnalyzing, mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [startCamera]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-900/20 rounded-xl border border-red-500/50 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={startCamera} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-black aspect-[3/4]">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 ${isAnalyzing ? 'opacity-30' : 'opacity-100'}`}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Guide Overlays */}
      {!isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {mode === 'person' ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
               <div className="relative h-[80%] aspect-[1/2] flex items-center justify-center opacity-40">
                  <svg viewBox="0 0 100 200" className="w-full h-full text-red-500 fill-none stroke-current stroke-[0.5] stroke-dash-2">
                      <path d="M50 20 C40 20 35 25 35 35 C35 45 40 50 50 50 C60 50 65 45 65 35 C65 25 60 20 50 20 M35 55 L20 120 M65 55 L80 120 M50 55 L50 110 L30 185 M50 110 L70 185 M35 55 Q50 50 65 55" />
                  </svg>
                  
                  {/* Feet marking line - Red color for person mode */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-red-500 shadow-[0_0_8px_red] flex justify-center">
                    <span className="absolute top-2 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] bg-black/40 px-2 py-0.5 rounded whitespace-nowrap">
                      Posição dos Pés
                    </span>
                  </div>
               </div>
            </div>
          ) : (
            <div className="w-64 h-64 border-2 border-dashed border-cyan-400/50 rounded-2xl flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]" />
            </div>
          )}
          
          <div className="absolute top-4 left-4 right-4 text-center">
            <p className={`text-sm font-medium bg-black/60 backdrop-blur-md py-2 px-6 rounded-full inline-block border ${
              mode === 'person' 
                ? 'text-red-200/80 border-red-500/30' 
                : 'text-cyan-200/80 border-cyan-500/20'
            }`}>
              {mode === 'person' ? 'Alinhe os pés com a marcação inferior' : 'Enquadre o objeto no centro'}
            </p>
          </div>
        </div>
      )}

      {/* Capture Button - Positioned to the right side */}
      {!isAnalyzing && (
        <div className="absolute top-1/2 right-6 -translate-y-1/2 flex items-center justify-center z-10">
          <button
            onClick={captureFrame}
            className="group relative flex items-center justify-center w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all duration-300"
            aria-label="Tirar foto"
          >
            <div className="w-16 h-16 border-4 border-slate-900 rounded-full flex items-center justify-center transition-all group-hover:border-cyan-600">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
                   <div className="w-6 h-6 bg-white rounded-sm" />
                </div>
            </div>
            {/* Label for side button hint */}
            <div className="absolute -left-16 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded uppercase tracking-tighter">Capturar</span>
            </div>
          </button>
        </div>
      )}

      {/* Scanning Animation */}
      {isAnalyzing && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="h-1 bg-cyan-400 w-full absolute shadow-[0_0_15px_cyan] animate-[scan_2s_ease-in-out_infinite]" />
        </div>
      )}
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};
