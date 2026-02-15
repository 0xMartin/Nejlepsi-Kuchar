import { motion } from 'framer-motion';

interface IngredientCardProps {
  nazev: string;
  tag: string;
  onClick: () => void;
  isSelected?: boolean;
  delay?: number;
}

// Emoji pro každý tag
function getEmoji(tag: string): string {
  const emojiMap: Record<string, string> = {
    'ryze': '🍚',
    'testoviny': '🍝',
    'uhli': '⬛',
    'cukr': '🍬',
    'losos': '🐟',
    'sunka': '🥓',
    'kure': '🐔',
    'netopyr': '🦇',
    'delfin': '🐬',
    'motyl': '🦋',
    'zmrzlina': '🍦',
    'slehacka': '🍨',
    'hriby': '🍄',
    'nori': '🌊',
    'coko': '🍫',
    'tvaruzky': '🧀',
    'okurka': '🥒',
    'citron': '🍋',
    'chilli': '🌶️',
    'cesnek': '🧄',
    'postolka': '🦅',
    'kocka': '🐱',
    'sysel': '🐿️',
    'hranolky': '🍟'
  };
  return emojiMap[tag] || '🍽️';
}

export function IngredientCard({ nazev, tag, onClick, isSelected = false, delay = 0 }: IngredientCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.4, 
        delay,
        type: 'spring',
        stiffness: 200
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-5 w-full
        bg-white/80 backdrop-blur-sm
        border-2 sm:border-3 transition-colors duration-300
        ${isSelected 
          ? 'border-pink-400 bg-pink-50/90' 
          : 'border-transparent hover:border-pink-200'
        }
        shadow-lg cursor-pointer
        flex flex-col items-center justify-center gap-2 sm:gap-3
        min-h-[120px] sm:min-h-[160px]
      `}
    >
      {/* Dekorativní kruhy na pozadí */}
      <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-amber-200/30 to-pink-200/30 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full" />
      
      {/* Emoji ingredience */}
      <motion.div 
        className="relative z-10 text-4xl sm:text-5xl"
        animate={isSelected ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {getEmoji(tag)}
      </motion.div>
      
      {/* Název ingredience */}
      <h3 className="relative z-10 text-sm sm:text-lg font-semibold text-gray-800 text-center leading-tight">
        {nazev}
      </h3>
      
      {/* Indikátor výběru */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-pink-400 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-sm sm:text-lg">✓</span>
        </motion.div>
      )}
    </motion.button>
  );
}
