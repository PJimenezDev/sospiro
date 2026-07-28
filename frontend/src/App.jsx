import { useState, useRef, useEffect } from 'react';

function App() {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('cuadrado'); // 'cuadrado' o 'triangulo'
  const [showSettings, setShowSettings] = useState(false);
  const [optInLog, setOptInLog] = useState(false);
  
  const audioRef = useRef(null);

  // Inicializar audio en memoria al cargar (requiere archivo en /public/852hz.mp3)
  useEffect(() => {
    audioRef.current = new Audio('/852hz.mp3');
    audioRef.current.loop = true;
  }, []);

  const toggleEmergency = async () => {
    if (!isActive) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.warn('El navegador bloqueó el audio o el archivo no existe aún:', error);
      }

      // Si el usuario aceptó, enviamos un log anónimo al backend
      if (optInLog) {
        // Generar o recuperar UUID anónimo del localStorage
        let userId = localStorage.getItem('sospiro_uuid');
        if (!userId) {
          userId = crypto.randomUUID();
          localStorage.setItem('sospiro_uuid', userId);
        }

        fetch(`${import.meta.env.VITE_API_URL}/logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_id: userId,
            timestamp: new Date().toISOString() 
          })
        }).catch(() => console.log('Modo offline: Log no enviado'));
      }
    } else {
      audioRef.current.pause();
    }
    
    setIsActive(!isActive);
  };

  // Determinar la clase de animación basada en el modo y si está activa
  const circleAnimationClass = isActive 
    ? (mode === 'cuadrado' ? 'animate-square' : 'animate-triangle') 
    : (mode === 'cuadrado' ? 'animate-square animate-paused' : 'animate-triangle animate-paused');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500">
      
      {/* Botón discreto de configuración en la esquina superior */}
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-6 right-6 opacity-50 hover:opacity-100 p-2 text-sm z-50 transition-opacity"
      >
        {showSettings ? 'Cerrar' : 'Ajustes'}
      </button>

      {/* Menú de Ajustes Opt-in */}
      {showSettings && (
        <div className="absolute top-16 right-6 bg-gray-800 p-4 rounded-lg shadow-lg z-50 w-64 border border-gray-700">
          <h3 className="text-lg font-bold mb-4">Configuración</h3>
          
          <div className="mb-4">
            <label className="text-sm block mb-2 font-semibold">Técnica de respiración</label>
            <select 
              className="w-full bg-gray-700 rounded p-2 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="cuadrado">Cuadrada (4-4-4-4)</option>
              <option value="triangulo">Triángulo (4-4-4)</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm">Registro Anónimo</span>
            <input 
              type="checkbox" 
              checked={optInLog} 
              onChange={(e) => setOptInLog(e.target.checked)}
              className="w-5 h-5 rounded bg-gray-700 accent-blue-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Solo guarda fecha y hora de forma anónima para ayudar a identificar patrones.
          </p>
        </div>
      )}

      {/* Círculo Central animado */}
      <div className="relative flex items-center justify-center w-64 h-64 mb-12 z-10 pointer-events-none">
        {/* El círculo que se expande */}
        <div className={`absolute w-32 h-32 bg-blue-500 rounded-full blur-xl opacity-20 transition-all ${circleAnimationClass}`}></div>
        <div className={`absolute w-24 h-24 bg-blue-400 rounded-full shadow-[0_0_40px_rgba(96,165,250,0.5)] transition-all ${circleAnimationClass}`}></div>
      </div>

      {/* Botón Principal (Inicia/Detiene) */}
      <button
        onClick={toggleEmergency}
        className="z-20 bg-gray-800 border border-gray-700 hover:bg-gray-700 px-8 py-4 rounded-full text-xl font-medium tracking-wide shadow-lg transition-all active:scale-95"
      >
        {isActive ? 'Detener' : 'Iniciar SOSpiro'}
      </button>

      {/* Instrucción visual sutil */}
      <div className="absolute bottom-10 opacity-30 text-sm tracking-widest uppercase">
        {mode === 'cuadrado' ? 'Inhala - Sostén - Exhala - Espera' : 'Inhala - Sostén - Exhala'}
      </div>
    </div>
  );
}

export default App;