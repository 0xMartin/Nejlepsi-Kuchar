import { motion, AnimatePresence } from 'framer-motion';
import { GameMode } from '../types';
import { useState, useEffect } from 'react';

interface IntroProps {
  onStart: () => void;
  onHistory: () => void;
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function Intro({ onStart, onHistory, gameMode, onModeChange }: IntroProps) {
  const isSerious = gameMode === 'serious';
  const [showHurtDialog, setShowHurtDialog] = useState(false);
  const [hurtMessage, setHurtMessage] = useState('');
  const [hurtMessages, setHurtMessages] = useState<string[]>([]);
  
  // Načtení ublížených hlášek při mountu
  useEffect(() => {
    fetch('./data/experimental/hlasky-ublizene.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').slice(1).filter(l => l.trim());
        const messages = lines.map(line => line.replace(/^"|"$/g, '').trim());
        setHurtMessages(messages);
      })
      .catch(console.error);
  }, []);
  
  const handleModeSwitch = () => {
    if (!isSerious && hurtMessages.length > 0) {
      // Přepnutí z experimental na serious - ukážeme dialog
      const randomMessage = hurtMessages[Math.floor(Math.random() * hurtMessages.length)];
      setHurtMessage(randomMessage);
      setShowHurtDialog(true);
    } else {
      // Přepnutí ze serious na experimental - přímo
      onModeChange('experimental');
    }
  };
  
  const confirmModeSwitch = () => {
    setShowHurtDialog(false);
    onModeChange('serious');
  };
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 relative overflow-hidden transition-colors duration-500 ${isSerious ? 'bg-gradient-to-br from-slate-50 to-blue-50' : ''}`}>
      {/* Přepínač módu */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 z-20"
      >
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-md backdrop-blur-sm ${isSerious ? 'bg-white/90' : 'bg-white/70'}`}>
          <span className={`text-xs sm:text-sm font-medium ${!isSerious ? 'text-pink-600' : 'text-gray-400'}`}>
            Chci experimentovat
          </span>
          <button
            onClick={handleModeSwitch}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isSerious ? 'bg-blue-500' : 'bg-pink-400'}`}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              animate={{ left: isSerious ? '1.75rem' : '0.25rem' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-xs sm:text-sm font-medium ${isSerious ? 'text-blue-600' : 'text-gray-400'}`}>
            Seriózní vaření
          </span>
        </div>
      </motion.div>

      {/* Animované pozadí */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Plovoucí emoji - různé pro každý mód */}
        {(isSerious ? [
          // Elegantní emoji pro seriózní mód
          { emoji: '🍽️', x: '10%', y: '20%', delay: 0 },
          { emoji: '🥄', x: '85%', y: '15%', delay: 0.8 },
          { emoji: '🍴', x: '15%', y: '75%', delay: 1.5 },
          { emoji: '👨‍🍳', x: '88%', y: '70%', delay: 2 },
          { emoji: '🧂', x: '50%', y: '8%', delay: 2.5 },
          { emoji: '🌿', x: '75%', y: '82%', delay: 0.3 },
          { emoji: '🫒', x: '22%', y: '55%', delay: 1.2 },
          { emoji: '🍷', x: '78%', y: '40%', delay: 1.8 },
        ] : [
          // Vtipné emoji pro experimental mód
          { emoji: '🍔', x: '10%', y: '20%', delay: 0 },
          { emoji: '🍕', x: '85%', y: '15%', delay: 0.5 },
          { emoji: '🍣', x: '15%', y: '80%', delay: 1 },
          { emoji: '🌮', x: '90%', y: '75%', delay: 1.5 },
          { emoji: '🥗', x: '50%', y: '10%', delay: 2 },
          { emoji: '🍦', x: '75%', y: '85%', delay: 2.5 },
          { emoji: '🥐', x: '25%', y: '60%', delay: 0.3 },
          { emoji: '🍩', x: '80%', y: '45%', delay: 1.2 },
        ]).map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${isSerious ? 'text-2xl sm:text-3xl md:text-4xl opacity-20' : 'text-3xl sm:text-4xl md:text-5xl opacity-30'}`}
            style={{ left: item.x, top: item.y }}
            animate={isSerious ? {
              // Jemnější animace pro seriózní mód
              y: [0, -10, 0],
              rotate: [0, 3, -3, 0],
            } : {
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: isSerious ? 6 : 4,
              delay: item.delay,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Hlavní obsah */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10 py-4 sm:py-8"
      >
        {/* Logo / Ikona */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="mb-4 sm:mb-6"
        >
          <motion.img 
            key={gameMode}
            src={isSerious ? './kuchar-serious.png' : './kuchar.png'}
            alt="Kuchař"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 mx-auto"
            animate={isSerious ? {} : { 
              rotate: [0, -5, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: 'reverse' 
            }}
          />
        </motion.div>

        {/* Název */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-3 sm:mb-4"
        >
          <span className={`bg-clip-text text-transparent ${isSerious ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500' : 'bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500'}`}>
            {isSerious ? 'Kuchyně Pro' : 'Nejlepší kuchař'}
          </span>
        </motion.h1>

        {/* Podtitulek */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 mb-3 sm:mb-4 max-w-lg mx-auto px-2"
        >
          {isSerious 
            ? 'Nevíte, co dnes uvařit? Pomohu vám s výběrem!' 
            : 'Nemáš originální nápady? Nevíš, co k večeři?'
          }
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto font-semibold"
        >
          {isSerious 
            ? '🍽️ Vyberte ingredience a najdeme vám recept' 
            : '🧠 Kuchař přemýšlí za tebe!'
          }
        </motion.p>

        {/* Popis procesu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8"
        >
          {(isSerious ? [
            { icon: '🥘', text: 'Vyberte suroviny' },
            { icon: '🔍', text: 'Najdeme recept' },
            { icon: '🍽️', text: 'Dobrou chuť!' },
          ] : [
            { icon: '🤔', text: 'Odpověz na otázky' },
            { icon: '👨‍🍳', text: 'Kuchař přemýšlí' },
            { icon: '✨', text: 'Zázrak na talíři!' },
          ]).map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1, y: -5 }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm rounded-full shadow-md ${isSerious ? 'bg-white/90' : 'bg-white/70'}`}
            >
              <span className="text-xl sm:text-2xl">{item.icon}</span>
              <span className="text-gray-700 font-semibold text-xs sm:text-sm md:text-base">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Tlačítka */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
          {/* Tlačítko Start */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: isSerious ? '0 20px 40px rgba(59, 130, 246, 0.4)' : '0 20px 40px rgba(236, 72, 153, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className={`
              px-8 py-4 
              ${isSerious 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 shadow-blue-500/30' 
                : 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-pink-500/30'
              }
              text-white text-xl font-bold 
              rounded-full 
              shadow-lg
              cursor-pointer
              relative
              overflow-hidden
            `}
          >
            {/* Shimmer efekt */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10">{isSerious ? '🍽️ Začít vybírat' : '👨‍🍳 Chci inspiraci!'}</span>
          </motion.button>

          {/* Tlačítko Historie */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHistory}
            className={`
              px-6 py-3 
              bg-white/80 backdrop-blur-sm
              ${isSerious ? 'text-blue-600 border-blue-200 hover:border-blue-400' : 'text-purple-600 border-purple-200 hover:border-purple-400'}
              text-base font-semibold 
              rounded-full 
              shadow-md
              cursor-pointer
              border-2
              transition-colors
            `}
          >
            📜 Moje jídla
          </motion.button>
        </div>

        {/* Info text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-sm text-gray-500 px-4"
        >
          {isSerious 
            ? 'Vyberte až 3 oblíbené ingredience a doporučíme vám recept' 
            : 'Vyber 3 ingredience a mistr kuchař ti sestaví dokonalý pokrm'
          }
        </motion.p>
      </motion.div>

      {/* Vlnka na spodku */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <motion.path
            initial={{ d: 'M0,100 C360,150 720,50 1080,100 C1260,125 1440,80 1440,80 L1440,120 L0,120 Z' }}
            animate={{ 
              d: [
                'M0,100 C360,150 720,50 1080,100 C1260,125 1440,80 1440,80 L1440,120 L0,120 Z',
                'M0,80 C360,50 720,150 1080,80 C1260,60 1440,100 1440,100 L1440,120 L0,120 Z',
                'M0,100 C360,150 720,50 1080,100 C1260,125 1440,80 1440,80 L1440,120 L0,120 Z'
              ]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
      </div>

      {/* Dialog - Ublížený kuchař */}
      <AnimatePresence>
        {showHurtDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowHurtDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, rotate: -5 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Pozadí s emocí */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-50" />
              
              {/* Slzy animace */}
              <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    style={{ left: `${15 + i * 18}%` }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 80, opacity: [0, 1, 0] }}
                    transition={{ 
                      duration: 2, 
                      delay: i * 0.3, 
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    💧
                  </motion.div>
                ))}
              </div>
              
              <div className="relative z-10">
                {/* Kuchař */}
                <motion.div
                  className="flex justify-center mb-4"
                  animate={{ 
                    rotate: [-3, 3, -3],
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="relative">
                    <img 
                      src="./kuchar.png" 
                      alt="Ublížený kuchař" 
                      className="w-28 h-28 object-contain"
                    />
                    {/* Slzy na kuchaři */}
                    <motion.span
                      className="absolute top-8 left-6 text-xl"
                      animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      😢
                    </motion.span>
                  </div>
                </motion.div>
                
                {/* Nadpis */}
                <motion.h2
                  className="text-2xl font-bold text-center text-pink-600 mb-4"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Počkej! 😭
                </motion.h2>
                
                {/* Hláška */}
                <motion.div
                  className="bg-white/80 rounded-xl p-4 mb-6 border-2 border-pink-200"
                  initial={{ x: -10 }}
                  animate={{ x: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <p className="text-gray-700 text-center text-lg leading-relaxed">
                    {hurtMessage}
                  </p>
                </motion.div>
                
                {/* Tlačítka */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowHurtDialog(false)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-lg"
                  >
                    😊 Zůstanu s tebou!
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmModeSwitch}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-600 font-semibold rounded-full hover:bg-gray-300 transition-colors"
                  >
                    Přesto odejít...
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
