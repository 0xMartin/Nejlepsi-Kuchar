import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { GameMode } from '../types';

// Hlášky pro vybíravého uživatele - experimental
const PICKY_MESSAGES = [
  "Hele, ty jsi ale vybíravej/á! Ze tří surovin sis vybral/a jen {count}. To je jak chodit do restaurace a objednávat si jen sůl.",
  "Jen {count} surovina? To je jak chtít dort bez mouky, vajec a cukru. Ale dobře, něco uvařím...",
  "S {count} surovinou/surovinami se dělají zázraky těžko. Ale kuchař je kouzelník!",
  "Tak ty jsi jeden z těch, co v restauraci říkají 'já vlastně nic'. Ale dobře, {count} bude muset stačit.",
  "Vybíravý jako kocour! Jen {count} ingredience, ale neboj, kuchař je profesionál."
];

// Hlášky pro vybíravého uživatele - serious
const SERIOUS_PICKY_MESSAGES = [
  "Vybral/a jste pouze {count} ingredienci/e. Pro lepší doporučení doporučujeme vybrat alespoň 3 suroviny.",
  "S {count} surovinou/surovinami máme omezené možnosti, ale určitě najdeme něco chutného.",
  "Vaše preference jsou velmi specifické ({count} ingredience). Přesto jsme pro vás našli vhodnou variantu.",
];

interface ChefConfessionProps {
  extraTags: string[];
  hlapisky: { tag: string; hlaska: string }[];
  userTagsCount?: number;
  gameMode: GameMode;
}

export function ChefConfession({ extraTags, hlapisky, userTagsCount = 3, gameMode }: ChefConfessionProps) {
  const isPicky = userTagsCount < 3;
  const isSerious = gameMode === 'serious';
  
  const pickyMessage = useMemo(() => {
    if (!isPicky) return '';
    const messages = isSerious ? SERIOUS_PICKY_MESSAGES : PICKY_MESSAGES;
    const msg = messages[Math.floor(Math.random() * messages.length)];
    return msg.replace(/{count}/g, String(userTagsCount));
  }, [isPicky, userTagsCount, isSerious]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <motion.div 
        className={`backdrop-blur-sm border-2 rounded-2xl p-5 shadow-lg ${
          isSerious 
            ? 'bg-blue-50/90 border-blue-200' 
            : 'bg-amber-50/90 border-amber-200'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Hlavička */}
        <div className="flex items-start gap-4 mb-4">
          <h3 className={`text-lg font-bold ${isSerious ? 'text-blue-800' : 'text-amber-800'}`}>
            {isSerious ? 'Informace k receptu' : 'Kuchařovo doznání'}
          </h3>
        </div>

        {/* Obsah s kucharem vlevo */}
        <div className="flex gap-4">
          {/* Kuchař vlevo */}
          <motion.div
            className="flex-shrink-0"
            animate={isSerious ? {} : { 
              rotate: [-3, 3, -3],
              y: [0, -4, 0]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              repeatType: 'reverse' 
            }}
          >
            <img 
              src={isSerious ? './kuchar-serious.png' : './kuchar.png'} 
              alt="Kuchař" 
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </motion.div>

          {/* Obsah vpravo */}
          <div className="flex-1 min-w-0">

        {/* Hláška pro vybíravého uživatele */}
        {isPicky && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className={`rounded-lg p-3 mb-4 border-l-4 ${
              isSerious 
                ? 'bg-blue-100 border-blue-400' 
                : 'bg-orange-100 border-orange-400'
            }`}
          >
            <p className={`text-sm ${isSerious ? 'text-blue-800' : 'text-orange-800'}`}>
              {isSerious ? 'ℹ️' : '🤨'} {pickyMessage}
            </p>
          </motion.div>
        )}

        {/* Hlášky pro ingredience, které uživatel chtěl, ale v jídle nejsou */}
        {extraTags.length > 0 && (
          <div className="space-y-3 mb-4">
            <h4 className={`text-sm font-semibold flex items-center gap-2 ${
              isSerious ? 'text-blue-700' : 'text-red-700'
            }`}>
              <span>{isSerious ? '📝' : '🤷‍♂️'}</span> 
              {isSerious 
                ? 'Ingredience, které nebyly zahrnuty:' 
                : 'Ingredience, které jsi chtěl/a, ale v jídle nejsou:'
              }
            </h4>
            {hlapisky.length > 0 ? hlapisky.map((item, index) => (
              <motion.div
                key={item.tag}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.2 }}
                className={`bg-white/70 rounded-lg p-3 shadow-inner border-l-4 ${
                  isSerious ? 'border-blue-300' : 'border-red-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isSerious ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    #{item.tag}
                  </span>
                  <span className={`text-sm ${isSerious ? 'text-blue-600' : 'text-red-600'}`}>
                    {isSerious ? '— není v receptu' : '← tohle jsi chtěl/a, ale kuchař to tam nedal'}
                  </span>
                </div>
                <p className="text-gray-700 italic leading-relaxed text-sm">
                  "{item.hlaska}"
                </p>
              </motion.div>
            )) : extraTags.map((tag) => (
              <div key={tag} className={`bg-white/70 rounded-lg p-3 shadow-inner border-l-4 ${
                isSerious ? 'border-blue-300' : 'border-red-300'
              }`}>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isSerious ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                }`}>
                  #{tag}
                </span>
                <span className={`text-sm ml-2 ${isSerious ? 'text-blue-600' : 'text-red-600'}`}>
                  {isSerious ? '— není v receptu' : '← tohle jsi chtěl/a, ale kuchař to tam nedal'}
                </span>
              </div>
            ))}
          </div>
        )}

            {/* Povzbudivá zpráva */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className={`mt-3 font-medium text-sm ${isSerious ? 'text-blue-700' : 'text-amber-700'}`}
            >
              {isSerious 
                ? 'Věříme, že vám toto jídlo bude chutnat!' 
                : 'Ale neboj, chuťově to bude 💯!'
              }
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Komponenta pro perfektní shodu
interface PerfectMatchProps {
  joke: string;
  gameMode: GameMode;
}

export function PerfectMatch({ joke, gameMode }: PerfectMatchProps) {
  const isSerious = gameMode === 'serious';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <motion.div 
        className={`backdrop-blur-sm border-2 rounded-2xl p-4 shadow-lg ${
          isSerious 
            ? 'bg-emerald-50/90 border-emerald-300' 
            : 'bg-green-50/90 border-green-300'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Hlavička */}
        <div className="mb-3">
          <h3 className={`text-lg font-bold ${isSerious ? 'text-emerald-800' : 'text-green-800'}`}>
            {isSerious ? '✓ Perfektní shoda!' : '🏆 Mistr kuchař je spokojený!'}
          </h3>
        </div>

        {/* Obsah s kuchařem vlevo */}
        <div className="flex gap-4">
          {/* Kuchař vlevo */}
          <motion.div
            className="flex-shrink-0"
            animate={isSerious ? {} : { 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: 'reverse' 
            }}
          >
            <img 
              src={isSerious ? './kuchar-serious.png' : './kuchar.png'} 
              alt="Kuchař" 
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </motion.div>

          {/* Obsah vpravo */}
          <div className="flex-1 min-w-0">
            <p className={`text-xs mb-2 ${isSerious ? 'text-emerald-600' : 'text-green-600'}`}>
              {isSerious ? 'Všechny vaše preferované ingredience jsou zahrnuty' : 'Perfektní shoda všech ingrediencí'}
            </p>

            {/* Vtipná hláška o perfektní práci */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="bg-white/70 rounded-xl p-3 shadow-inner"
            >
              <p className="text-gray-700 italic text-sm leading-relaxed">
                "{joke}"
              </p>
            </motion.div>

            {/* Celebrace */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-3"
            >
              <span className="text-3xl">{isSerious ? '⭐' : '🎉✨🌟'}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
