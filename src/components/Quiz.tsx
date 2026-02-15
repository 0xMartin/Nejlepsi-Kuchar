import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ingredience } from '../types';
import { IngredientCard } from './IngredientCard';

interface QuizProps {
  ingredience: Ingredience[];
  onComplete: (selectedTags: string[]) => void;
  onPickyEater?: () => void;
}

export function Quiz({ ingredience, onComplete, onPickyEater }: QuizProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [usedIngredientIds, setUsedIngredientIds] = useState<Set<number>>(new Set());
  const [selectedOption, setSelectedOption] = useState<'a' | 'b' | 'none' | null>(null);
  const [questionKey, setQuestionKey] = useState(0);

  const REQUIRED_TAGS = 3;

  // Vyber 2 náhodné ingredience, které jsme ještě nepoužili
  const currentPair = useMemo(() => {
    const available = ingredience.filter(ing => !usedIngredientIds.has(ing.id));
    if (available.length < 2) {
      return null; // Nedostatek ingrediencí
    }
    // Zamícháme a vezmeme první dvě
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return {
      ingredience_a: shuffled[0],
      ingredience_b: shuffled[1]
    };
  }, [ingredience, usedIngredientIds, questionKey]);

  const progress = (selectedTags.length / REQUIRED_TAGS) * 100;

  const handleSelect = (option: 'a' | 'b' | 'none') => {
    setSelectedOption(option);
    
    setTimeout(() => {
      // Přidáme tag pouze pokud uživatel vybral ingredienci (ne "ani jedno")
      let newTags = selectedTags;
      if (option !== 'none' && currentPair) {
        const selectedIng = option === 'a' ? currentPair.ingredience_a : currentPair.ingredience_b;
        newTags = [...selectedTags, selectedIng.tag];
        setSelectedTags(newTags);
      }
      
      // Označíme obě ingredience jako použité
      if (currentPair) {
        setUsedIngredientIds(prev => new Set([
          ...prev, 
          currentPair.ingredience_a.id, 
          currentPair.ingredience_b.id
        ]));
      }
      
      // Zkontrolujeme jestli máme dost tagů
      if (newTags.length >= REQUIRED_TAGS) {
        onComplete(newTags);
      } else {
        // Zkontrolujeme jestli jsou ještě nějaké ingredience k dispozici (potřebujeme min. 2)
        const currentIds = currentPair 
          ? [currentPair.ingredience_a.id, currentPair.ingredience_b.id] 
          : [];
        const remainingCount = ingredience.filter(
          ing => !usedIngredientIds.has(ing.id) && !currentIds.includes(ing.id)
        ).length;
        
        if (remainingCount < 2 && newTags.length === 0) {
          // Nedostatek ingrediencí a uživatel nevybral nic - vybíravý jedlík!
          onPickyEater?.();
        } else if (remainingCount < 2 && newTags.length > 0) {
          // Máme nějaké tagy ale ne dost ingrediencí - použijeme co máme
          onComplete(newTags);
        } else {
          // Další otázka
          setSelectedOption(null);
          setQuestionKey(prev => prev + 1);
        }
      }
    }, 400);
  };

  // Pokud nejsou žádné ingredience, zavoláme picky eater
  useEffect(() => {
    if (!currentPair && selectedTags.length === 0 && onPickyEater) {
      onPickyEater();
    }
  }, [currentPair, selectedTags.length, onPickyEater]);

  // Pokud není žádná dvojice, zobrazíme loading
  if (!currentPair) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          👨‍🍳
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-6">
      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className="text-pink-600 font-semibold text-sm sm:text-base">
            Vybráno {selectedTags.length} z {REQUIRED_TAGS} ingrediencí
          </span>
          <span className="text-gray-500 text-xs sm:text-sm">
            {REQUIRED_TAGS - selectedTags.length} zbývá
          </span>
        </div>
        <div className="h-2 sm:h-3 bg-white/50 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Otázka */}
      <motion.h2
        key={questionKey + '-title'}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center"
      >
        Co ti více chutná?
      </motion.h2>

      {/* Karty ingrediencí */}
      <AnimatePresence mode="wait">
        <motion.div
          key={questionKey}
          className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-3xl mb-3 sm:mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <IngredientCard
            nazev={currentPair.ingredience_a.volba}
            tag={currentPair.ingredience_a.tag}
            onClick={() => handleSelect('a')}
            isSelected={selectedOption === 'a'}
            delay={0}
          />
          <IngredientCard
            nazev={currentPair.ingredience_b.volba}
            tag={currentPair.ingredience_b.tag}
            onClick={() => handleSelect('b')}
            isSelected={selectedOption === 'b'}
            delay={0.1}
          />
        </motion.div>
      </AnimatePresence>

      {/* Tlačítko "Ani jedno" */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSelect('none')}
        disabled={selectedOption !== null}
        className={`
          px-4 py-2 sm:px-8 sm:py-4 rounded-full font-semibold text-sm sm:text-lg
          transition-all duration-300
          ${selectedOption === 'none' 
            ? 'bg-gray-400 text-white' 
            : 'bg-white/70 text-gray-600 hover:bg-white hover:text-gray-800 shadow-md'
          }
          ${selectedOption !== null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        🚫 Ani jedno mi nechutná
      </motion.button>

      {/* Vybrané tagy */}
      <motion.div 
        className="mt-6 sm:mt-10 flex flex-wrap gap-2 sm:gap-3 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {selectedTags.map((tag, index) => (
          <motion.span
            key={tag + index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm font-medium"
          >
            #{tag}
          </motion.span>
        ))}
      </motion.div>

      {/* Dekorativní prvky */}
      <motion.div
        className="fixed top-20 left-4 sm:left-10 text-4xl sm:text-6xl opacity-20 pointer-events-none hidden sm:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        🍳
      </motion.div>
      <motion.div
        className="fixed bottom-20 right-4 sm:right-10 text-4xl sm:text-6xl opacity-20 pointer-events-none hidden sm:block"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🥄
      </motion.div>
    </div>
  );
}
