import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Hlášky pro vybíravého uživatele
const PICKY_MESSAGES = [
  "Hele, ty jsi ale vybíravej/á! Ze tří surovin sis vybral/a jen {count}. To je jak chodit do restaurace a objednávat si jen sůl.",
  "Jen {count} surovina? To je jak chtít dort bez mouky, vajec a cukru. Ale dobře, něco uvařím...",
  "S {count} surovinou/surovinami se dělají zázraky těžko. Ale kuchař je kouzelník!",
  "Tak ty jsi jeden z těch, co v restauraci říkají 'já vlastně nic'. Ale dobře, {count} bude muset stačit.",
  "Vybíravý jako kocour! Jen {count} ingredience, ale neboj, kuchař je profesionál."
];

interface ChefConfessionProps {
  missingTags: string[];
  extraTags: string[];
  hlapisky: { tag: string; hlaska: string }[];
  userTagsCount?: number;
}

export function ChefConfession({ missingTags, extraTags, hlapisky, userTagsCount = 3 }: ChefConfessionProps) {
  const isPicky = userTagsCount < 3;
  
  const pickyMessage = useMemo(() => {
    if (!isPicky) return '';
    const msg = PICKY_MESSAGES[Math.floor(Math.random() * PICKY_MESSAGES.length)];
    return msg.replace(/{count}/g, String(userTagsCount));
  }, [isPicky, userTagsCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <motion.div 
        className="bg-amber-50/90 backdrop-blur-sm border-2 border-amber-200 rounded-2xl p-5 shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Hlavička */}
        <div className="flex items-start gap-4 mb-4">
          <h3 className="text-lg font-bold text-amber-800">
            Kuchařovo doznání
          </h3>
        </div>

        {/* Obsah s kucharem vlevo */}
        <div className="flex gap-4">
          {/* Kuchař vlevo */}
          <motion.div
            className="flex-shrink-0"
            animate={{ 
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
              src="/kuchar.png" 
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
            className="bg-orange-100 rounded-lg p-3 mb-4 border-l-4 border-orange-400"
          >
            <p className="text-orange-800 text-sm">
              🤨 {pickyMessage}
            </p>
          </motion.div>
        )}

        {/* Hlášky pro ingredience, které uživatel chtěl, ale v jídle nejsou */}
        {extraTags.length > 0 && (
          <div className="space-y-3 mb-4">
            <h4 className="text-sm font-semibold text-red-700 flex items-center gap-2">
              <span>🤷‍♂️</span> Ingredience, které jsi chtěl/a, ale v jídle nejsou:
            </h4>
            {hlapisky.length > 0 ? hlapisky.map((item, index) => (
              <motion.div
                key={item.tag}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.2 }}
                className="bg-white/70 rounded-lg p-3 shadow-inner border-l-4 border-red-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                    #{item.tag}
                  </span>
                  <span className="text-red-600 text-sm">← tohle jsi chtěl/a, ale kuchař to tam nedal</span>
                </div>
                <p className="text-gray-700 italic leading-relaxed text-sm">
                  "{item.hlaska}"
                </p>
              </motion.div>
            )) : extraTags.map((tag) => (
              <div key={tag} className="bg-white/70 rounded-lg p-3 shadow-inner border-l-4 border-red-300">
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                  #{tag}
                </span>
                <span className="text-red-600 text-sm ml-2">← tohle jsi chtěl/a, ale kuchař to tam nedal</span>
              </div>
            ))}
          </div>
        )}

            {/* Povzbudivá zpráva */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-amber-700 mt-3 font-medium text-sm"
            >
              Ale neboj, chuťově to bude 💯!
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
}

export function PerfectMatch({ joke }: PerfectMatchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <motion.div 
        className="bg-green-50/90 backdrop-blur-sm border-2 border-green-300 rounded-2xl p-4 shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Hlavička */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-green-800">
            🏆 Mistr kuchař je spokojený!
          </h3>
        </div>

        {/* Obsah s kuchařem vlevo */}
        <div className="flex gap-4">
          {/* Kuchař vlevo */}
          <motion.div
            className="flex-shrink-0"
            animate={{ 
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
              src="/kuchar.png" 
              alt="Kuchař" 
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </motion.div>

          {/* Obsah vpravo */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-green-600 mb-2">
              Perfektní shoda všech ingrediencí
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
              <span className="text-3xl">🎉✨🌟</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
