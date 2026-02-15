import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Hlaska } from '../types';
import { getRandomHlaska } from '../utils';

interface PickyEaterProps {
  hlasky: Hlaska[];
  onClose: () => void;
}

export function PickyEater({ hlasky, onClose }: PickyEaterProps) {
  const joke = useMemo(() => {
    return getRandomHlaska(hlasky);
  }, [hlasky]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-4 relative">
      {/* Padající emoji */}
      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{
              top: '-10%',
              left: `${Math.random() * 100}%`,
              rotate: 0
            }}
            animate={{
              top: '110%',
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3
            }}
          >
            {['😤', '🙄', '😒', '🤨', '😑', '💨', '🚫'][Math.floor(Math.random() * 7)]}
          </motion.div>
        ))}
      </motion.div>

      {/* Hlavní nadpis */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🍽️ Prázdný talíř
        </motion.h1>
        <p className="text-gray-600 text-lg">
          Na všechno jsi řekl/a NE...
        </p>
      </motion.div>

      {/* Prázdný talíř */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 100,
          delay: 0.3 
        }}
        className="mb-6"
      >
        <div className="relative">
          <motion.div
            className="w-48 h-48 bg-gradient-to-b from-gray-100 to-gray-200 rounded-full shadow-2xl border-6 border-gray-300 flex items-center justify-center"
            animate={{ 
              boxShadow: [
                '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span
              className="text-6xl opacity-30"
              animate={{ 
                scale: [1, 0.9, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🍴
            </motion.span>
          </motion.div>
          
          {/* Páry/kouř z prázdnoty */}
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💨
          </motion.div>
        </div>
      </motion.div>

      {/* Kuchařova hláška */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-lg mb-6"
      >
        <div className="bg-red-50/90 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ 
                rotate: [-5, 5, -5],
                y: [0, -3, 0]
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity,
                repeatType: 'reverse' 
              }}
              className="text-4xl"
            >
              👨‍🍳
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-red-800">
                Kuchař má zprávu:
              </h3>
              <p className="text-xs text-red-600">
                A není to nic hezkýho
              </p>
            </div>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-gray-700 italic leading-relaxed text-base"
          >
            "{joke}"
          </motion.p>
        </div>
      </motion.div>

      {/* Tlačítko zpět */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold text-base shadow-lg"
      >
        Zkusím to znovu (snad míň vybíravě) 🙏
      </motion.button>
    </div>
  );
}
