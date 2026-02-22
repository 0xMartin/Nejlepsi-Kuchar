import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ingredience, GameMode } from '../types';
import { IngredientCard } from './IngredientCard';

// Mapování tagů na emoji pro seriózní mód
const SERIOUS_EMOJI_MAP: Record<string, string> = {
  kure: '🍗',
  hovezi: '🥩',
  veprove: '🥓',
  losos: '🐟',
  ryze: '🍚',
  testoviny: '🍝',
  kase: '🥔',
  hranolky: '🍟',
  brokolice: '🥦',
  paprika: '🫑',
  tofu: '🧈',
  smetana: '🥛',
  sojova: '🥢',
  cesnek: '🧄',
  syr: '🧀',
  vejce: '🥚',
  krevety: '🦐',
  tunak: '🐟',
  jehneci: '🐑',
  kachna: '🦆',
  rajcata: '🍅',
  spenat: '🥬',
  cuketa: '🥒',
  houby: '🍄',
  cocka: '🫘',
  cizrna: '🫛',
  brambory: '🥔',
  mozzarella: '🧀',
  feta: '🧀',
  kokos: '🥥',
  chilli: '🌶️',
  fazole: '🫘',
  cibule: '🧅',
};

const getSeriousEmoji = (tag: string): string => {
  return SERIOUS_EMOJI_MAP[tag] || '🍽️';
};

interface QuizProps {
  ingredience: Ingredience[];
  onComplete: (selectedTags: string[]) => void;
  onPickyEater?: () => void;
  gameMode: GameMode;
}

export function Quiz({ ingredience, onComplete, onPickyEater, gameMode }: QuizProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [usedIngredientIds, setUsedIngredientIds] = useState<Set<number>>(new Set());
  const [selectedOption, setSelectedOption] = useState<'a' | 'b' | 'none' | null>(null);
  const [questionKey, setQuestionKey] = useState(0);
  // Pro serious mód - vícenásobný výběr
  const [seriousSelection, setSeriousSelection] = useState<Set<number>>(new Set());

  const MAX_TAGS = 5;
  const isSerious = gameMode === 'serious';

  // Vyber ingredience podle módu
  const currentIngredients = useMemo(() => {
    const available = ingredience.filter(ing => !usedIngredientIds.has(ing.id));
    if (isSerious) {
      // Serious mód - zobraz 3 ingredience
      if (available.length < 1) return null;
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(3, available.length));
    } else {
      // Experimental mód - zobraz 2 ingredience
      if (available.length < 2) return null;
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      return [shuffled[0], shuffled[1]];
    }
  }, [ingredience, usedIngredientIds, questionKey, isSerious]);

  const progress = (selectedTags.length / MAX_TAGS) * 100;
  const remainingSlots = MAX_TAGS - selectedTags.length;

  // Pro serious mód - toggle výběru ingredience
  const handleSeriousToggle = (ing: Ingredience) => {
    const newSelection = new Set(seriousSelection);
    if (newSelection.has(ing.id)) {
      newSelection.delete(ing.id);
    } else {
      // Zkontroluj, jestli můžeme přidat další
      if (selectedTags.length + newSelection.size < MAX_TAGS) {
        newSelection.add(ing.id);
      }
    }
    setSeriousSelection(newSelection);
  };

  // Pro serious mód - potvrzení výběru a přechod na další
  const handleSeriousContinue = () => {
    if (!currentIngredients) return;
    
    // Přidáme vybrané tagy
    const newSelectedTags = currentIngredients
      .filter(ing => seriousSelection.has(ing.id))
      .map(ing => ing.tag);
    
    const allTags = [...selectedTags, ...newSelectedTags];
    setSelectedTags(allTags);
    
    // Označíme všechny zobrazené ingredience jako použité
    setUsedIngredientIds(prev => new Set([
      ...prev,
      ...currentIngredients.map(ing => ing.id)
    ]));
    
    // Reset výběru pro další kolo
    setSeriousSelection(new Set());
    
    // Zkontrolujeme jestli máme dost tagů nebo chce uživatel ukončit
    if (allTags.length >= MAX_TAGS) {
      onComplete(allTags);
    } else {
      // Zkontrolujeme dostupné ingredience
      const currentIds = currentIngredients.map(ing => ing.id);
      const remainingCount = ingredience.filter(
        ing => !usedIngredientIds.has(ing.id) && !currentIds.includes(ing.id)
      ).length;
      
      if (remainingCount < 1) {
        // Už nejsou další ingredience - dokončíme s tím co máme
        onComplete(allTags);
      } else {
        setQuestionKey(prev => prev + 1);
      }
    }
  };
  
  // Pro serious mód - předčasné ukončení
  const handleSeriousFinish = () => {
    const newSelectedTags = currentIngredients
      ? currentIngredients
          .filter(ing => seriousSelection.has(ing.id))
          .map(ing => ing.tag)
      : [];
    
    const allTags = [...selectedTags, ...newSelectedTags];
    onComplete(allTags);
  };

  // Pro experimental mód - výběr jedné ingredience
  const handleSelect = (option: 'a' | 'b' | 'none') => {
    setSelectedOption(option);
    
    setTimeout(() => {
      let newTags = selectedTags;
      if (option !== 'none' && currentIngredients && currentIngredients.length >= 2) {
        const selectedIng = option === 'a' ? currentIngredients[0] : currentIngredients[1];
        newTags = [...selectedTags, selectedIng.tag];
        setSelectedTags(newTags);
      }
      
      // Označíme obě ingredience jako použité
      if (currentIngredients && currentIngredients.length >= 2) {
        setUsedIngredientIds(prev => new Set([
          ...prev, 
          currentIngredients[0].id, 
          currentIngredients[1].id
        ]));
      }
      
      // Zkontrolujeme jestli máme dost tagů
      if (newTags.length >= MAX_TAGS) {
        onComplete(newTags);
      } else {
        const currentIds = currentIngredients 
          ? currentIngredients.map(ing => ing.id) 
          : [];
        const remainingCount = ingredience.filter(
          ing => !usedIngredientIds.has(ing.id) && !currentIds.includes(ing.id)
        ).length;
        
        if (remainingCount < 2 && newTags.length === 0) {
          onPickyEater?.();
        } else if (remainingCount < 2 && newTags.length > 0) {
          onComplete(newTags);
        } else {
          setSelectedOption(null);
          setQuestionKey(prev => prev + 1);
        }
      }
    }, 400);
  };

  // Pokud nejsou žádné ingredience, zavoláme picky eater
  useEffect(() => {
    if (!currentIngredients && selectedTags.length === 0 && onPickyEater) {
      onPickyEater();
    }
  }, [currentIngredients, selectedTags.length, onPickyEater]);

  // Pokud nejsou žádné ingredience, zobrazíme loading
  if (!currentIngredients) {
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
    <div className={`min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-6 ${isSerious ? 'bg-gradient-to-br from-slate-50 to-blue-50' : ''}`}>
      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className={`font-semibold text-sm sm:text-base ${isSerious ? 'text-blue-600' : 'text-pink-600'}`}>
            Vybráno {selectedTags.length} z {MAX_TAGS} ingrediencí
          </span>
          <span className="text-gray-500 text-xs sm:text-sm">
            {MAX_TAGS - selectedTags.length} zbývá
          </span>
        </div>
        <div className="h-2 sm:h-3 bg-white/50 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className={`h-full ${isSerious ? 'bg-gradient-to-r from-blue-400 to-cyan-500' : 'bg-gradient-to-r from-pink-400 to-purple-500'}`}
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
        {isSerious 
          ? `Vyberte ingredience, které máte rádi (max. ${remainingSlots})`
          : 'Co ti více chutná?'
        }
      </motion.h2>

      {/* Karty ingrediencí */}
      <AnimatePresence mode="wait">
        {isSerious ? (
          // SERIOUS MÓD - 3 ingredience s multi-select
          <motion.div
            key={questionKey}
            className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-4xl mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {currentIngredients.map((ing, i) => (
              <motion.div
                key={ing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSeriousToggle(ing)}
                className={`
                  relative p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300
                  ${seriousSelection.has(ing.id) 
                    ? 'bg-blue-100 border-2 border-blue-500 shadow-lg' 
                    : 'bg-white/90 border-2 border-transparent shadow-md hover:shadow-lg'
                  }
                  ${selectedTags.length + seriousSelection.size >= MAX_TAGS && !seriousSelection.has(ing.id)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                  }
                `}
              >
                {/* Checkbox indicator */}
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${seriousSelection.has(ing.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
                >
                  {seriousSelection.has(ing.id) && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
                <div className="text-3xl sm:text-4xl mb-2 text-center">{getSeriousEmoji(ing.tag)}</div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 text-center">
                  {ing.volba}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // EXPERIMENTAL MÓD - 2 ingredience s výběrem jedné
          <motion.div
            key={questionKey}
            className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-3xl mb-3 sm:mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <IngredientCard
              nazev={currentIngredients[0].volba}
              tag={currentIngredients[0].tag}
              onClick={() => handleSelect('a')}
              isSelected={selectedOption === 'a'}
              delay={0}
            />
            <IngredientCard
              nazev={currentIngredients[1].volba}
              tag={currentIngredients[1].tag}
              onClick={() => handleSelect('b')}
              isSelected={selectedOption === 'b'}
              delay={0.1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tlačítka akce */}
      {isSerious ? (
        // SERIOUS MÓD - tlačítka Pokračovat a Dokončit
        <motion.div 
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSeriousContinue}
            className="px-6 py-3 sm:px-10 sm:py-4 rounded-full font-semibold text-sm sm:text-lg
              bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg
              hover:shadow-xl transition-all cursor-pointer"
          >
            {seriousSelection.size > 0 
              ? `Potvrdit výběr (${seriousSelection.size})` 
              : 'Přeskočit'
            }
          </motion.button>
          
          {/* Tlačítko pro předčasné dokončení */}
          {(selectedTags.length > 0 || seriousSelection.size > 0) && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSeriousFinish}
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-sm sm:text-lg
                bg-white/80 text-blue-600 border-2 border-blue-200 shadow-md
                hover:bg-white hover:border-blue-400 transition-all cursor-pointer"
            >
              ✓ Hledat recept ({selectedTags.length + seriousSelection.size})
            </motion.button>
          )}
        </motion.div>
      ) : (
        // EXPERIMENTAL MÓD - tlačítko Ani jedno
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
      )}

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
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium
              ${isSerious ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}
          >
            #{tag}
          </motion.span>
        ))}
      </motion.div>

      {/* Dekorativní prvky - jen pro experimental mód */}
      {!isSerious && (
        <>
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
        </>
      )}
    </div>
  );
}
