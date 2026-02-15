import { motion } from 'framer-motion';

interface IntroProps {
  onStart: () => void;
  onHistory: () => void;
}

export function Intro({ onStart, onHistory }: IntroProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 relative overflow-hidden">
      {/* Animované pozadí */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Plovoucí emoji */}
        {[
          { emoji: '🍔', x: '10%', y: '20%', delay: 0 },
          { emoji: '🍕', x: '85%', y: '15%', delay: 0.5 },
          { emoji: '🍣', x: '15%', y: '80%', delay: 1 },
          { emoji: '🌮', x: '90%', y: '75%', delay: 1.5 },
          { emoji: '🥗', x: '50%', y: '10%', delay: 2 },
          { emoji: '🍦', x: '75%', y: '85%', delay: 2.5 },
          { emoji: '🥐', x: '25%', y: '60%', delay: 0.3 },
          { emoji: '🍩', x: '80%', y: '45%', delay: 1.2 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl sm:text-4xl md:text-5xl opacity-30"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
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
            src="./kuchar.png"
            alt="Kuchař"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 mx-auto"
            animate={{ 
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
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
            Nejlepší kuchař
          </span>
        </motion.h1>

        {/* Podtitulek */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 mb-3 sm:mb-4 max-w-lg mx-auto px-2"
        >
          Nemáš originální nápady? Nevíš, co k večeři?
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto font-semibold"
        >
          🧠 Kuchař přemýšlí za tebe!
        </motion.p>

        {/* Popis procesu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8"
        >
          {[
            { icon: '🤔', text: 'Odpověz na otázky' },
            { icon: '👨‍🍳', text: 'Kuchař přemýšlí' },
            { icon: '✨', text: 'Zázrak na talíři!' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-md"
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
              boxShadow: '0 20px 40px rgba(236, 72, 153, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="
              px-8 py-4 
              bg-gradient-to-r from-pink-500 to-purple-600 
              text-white text-xl font-bold 
              rounded-full 
              shadow-lg shadow-pink-500/30
              cursor-pointer
              relative
              overflow-hidden
            "
          >
            {/* Shimmer efekt */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10">👨‍🍳 Chci inspiraci!</span>
          </motion.button>

          {/* Tlačítko Historie */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHistory}
            className="
              px-6 py-3 
              bg-white/80 backdrop-blur-sm
              text-purple-600 text-base font-semibold 
              rounded-full 
              shadow-md
              cursor-pointer
              border-2 border-purple-200
              hover:border-purple-400
              transition-colors
            "
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
          Vyber 3 ingredience a mistr kuchař ti sestaví dokonalý pokrm
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
    </div>
  );
}
