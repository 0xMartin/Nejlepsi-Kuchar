import { motion, AnimatePresence } from 'framer-motion';
import { MatchResult, GameMode } from '../types';
import { getJidloImagePath } from '../utils';
import { ChefConfession, PerfectMatch } from './ChefConfession';
import { useMemo, useState } from 'react';

// Vtipné hlášky pro perfektní shodu
const PERFECT_MATCH_JOKES = [
  "Tak tohle je důkaz, že jsem génius! Pochvalte mě, nebo vařím příště sám sobě.",
  "Vidíš? Přesně takhle to má vypadat, když nechá člověk profíka pracovat. Očekávám potlesk.",
  "Tři ze tří! Jsem tak dobrý, že se sám sobě divím. Kde mám tu korunu?",
  "Perfektní práce si žádá perfektní uznání. Přijímám komplimenty i v hotovosti.",
  "Někdo řekl 'nemožné'? Já řekl 'hotovo'. Takhle se vaří, dámy a pánové!",
  "Moje babička by byla pyšná. Vlastně ne, ona nikdy nevařila takhle dobře.",
  "Tohle je kulinarní umění v jeho nejčistší formě. Můžete mi teď zatleskat.",
  "Když je kuchař tak dobrý jako já, jídlo se skoro vaří samo. Skoro.",
];

// Seriózní hlášky pro perfektní shodu
const SERIOUS_PERFECT_MATCH = [
  "Výborná volba! Toto jídlo perfektně odpovídá vašim preferencím.",
  "Skvělé! Našli jsme recept, který přesně odpovídá vašemu výběru.",
  "Perfektní shoda! Tento recept je pro vás jako stvořený.",
  "Gratulujeme! Vaše ingredience se perfektně hodí k tomuto jídlu.",
];

interface ResultProps {
  result: MatchResult;
  userTags: string[];
  generatedHlasky: { tag: string; hlaska: string }[];
  onClose: () => void;
  gameMode: GameMode;
  totalMatches: number;
  currentMatchIndex: number;
  onNextMatch: () => void;
}

export function Result({ result, userTags, generatedHlasky, onClose, gameMode, totalMatches, currentMatchIndex, onNextMatch }: ResultProps) {
  const { jidlo, matchedTags, missingTags, extraTags } = result;
  const isPerfectMatch = missingTags.length === 0 && extraTags.length === 0;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isSerious = gameMode === 'serious';

  // Vtip/text pro perfektní shodu
  const perfectJoke = useMemo(() => {
    const jokes = isSerious ? SERIOUS_PERFECT_MATCH : PERFECT_MATCH_JOKES;
    return jokes[Math.floor(Math.random() * jokes.length)];
  }, [isSerious]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-4 relative ${
      isSerious ? 'bg-gradient-to-br from-slate-50 to-blue-50' : ''
    }`}>
      {/* Konfety animace pro úspěch - omezený počet a trvání */}
      {isPerfectMatch && (
        <motion.div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl sm:text-3xl"
              initial={{
                top: '-10%',
                left: `${(i * 8) + 4}%`,
                rotate: 0
              }}
              animate={{
                top: '110%',
                rotate: 360 * (i % 2 === 0 ? 1 : -1)
              }}
              transition={{
                duration: 4,
                delay: i * 0.3,
                repeat: 2,
                repeatDelay: 1
              }}
            >
              {isSerious 
                ? ['⭐', '✨', '✔️', '🍽️', '👨‍🍳', '🌟'][i % 6]
                : ['🎉', '✨', '🌟', '🎊', '💫', '🏆'][i % 6]
              }
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Hlavní nadpis */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <motion.h1 
          className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent mb-2 ${
            isSerious 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500' 
              : 'bg-gradient-to-r from-pink-500 to-purple-600'
          }`}
          animate={isPerfectMatch ? { scale: [1, 1.05, 1] } : { scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isPerfectMatch 
            ? (isSerious ? '✔️ Perfektní shoda!' : '🎯 DOKONALÁ SHODA!') 
            : (isSerious ? '🍽️ Váš recept je připraven' : '✨ Tvůj pokrm je připraven!')
          }
        </motion.h1>
        <p className="text-gray-600 text-lg">
          {isPerfectMatch 
            ? (isSerious 
                ? 'Všechny vaše preferované ingredience jsou zahrnuty v tomto receptu.' 
                : 'Kuchař trefil všechny tvé preference na první pokus!') 
            : (isSerious 
                ? 'Na základě vašich preferencí jsme vybrali tento recept.' 
                : 'Na základě tvých preferencí jsme našli toto úžasné jídlo')
          }
        </p>
      </motion.div>

      {/* Karta jídla */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mb-4 sm:mb-6"
      >
        {/* Obrázek jídla */}
        <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden">
          <motion.img
            src={getJidloImagePath(jidlo.obrazek, gameMode)}
            alt={jidlo.nazev}
            className="w-full h-full object-cover cursor-pointer"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            onClick={() => setIsFullscreen(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Yummy';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          
          {/* Fullscreen tlačítko */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </motion.button>
          
          <motion.h2 
            className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 text-xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {jidlo.nazev}
          </motion.h2>
        </div>

        {/* Popis jídla */}
        <motion.div 
          className="p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-base text-gray-700 leading-relaxed mb-4 italic">
            "{jidlo.popis}"
          </p>

          {/* Shodné tagy */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              ✅ {isSerious ? 'Zahrnuté ingredience' : 'Shodné ingredience'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {matchedTags.length > 0 ? matchedTags.map(tag => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + matchedTags.indexOf(tag) * 0.1 }}
                  className={`px-3 py-1 rounded-full font-medium text-sm ${
                    isSerious ? 'bg-emerald-100 text-emerald-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  #{tag}
                </motion.span>
              )) : (
                <span className="text-gray-400 italic text-sm">
                  {isSerious ? 'Žádné přímé shody' : 'Žádné přímé shody'}
                </span>
              )}
            </div>
          </div>

          {/* Neshodné tagy - ingredience v jídle, které uživatel nevybral */}
          {missingTags.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                {isSerious ? '📝 Další ingredience v receptu' : '🤷‍♂️ Navíc v jídle'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingTags.map(tag => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + missingTags.indexOf(tag) * 0.1 }}
                    className={`px-3 py-1 rounded-full font-medium text-sm ${
                      isSerious ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Statistiky */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{isSerious ? '✅' : '🎯'}</span>
              <div>
                <p className="text-sm text-gray-500">{isSerious ? 'Přesnost' : 'Shoda'}</p>
                <p className={`font-bold text-lg ${isSerious ? 'text-blue-600' : 'text-pink-600'}`}>
                  {jidlo.tagy.length > 0 ? Math.round((matchedTags.length / jidlo.tagy.length) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{isSerious ? '🧂' : '🏷️'}</span>
              <div>
                <p className="text-sm text-gray-500">{isSerious ? 'Vybrané' : 'Tvé tagy'}</p>
                <p className={`font-bold text-lg ${isSerious ? 'text-cyan-600' : 'text-purple-600'}`}>{userTags.length}</p>
              </div>
            </div>
            {isPerfectMatch && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-2xl">{isSerious ? '⭐' : '🏆'}</span>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-bold text-lg ${isSerious ? 'text-emerald-600' : 'text-green-600'}`}>
                    {isSerious ? 'Výborné!' : 'Perfektní!'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Kuchařovo doznání nebo oslava perfektní shody */}
      {isPerfectMatch && userTags.length >= 3 ? (
        <PerfectMatch joke={perfectJoke} gameMode={gameMode} />
      ) : (
        <ChefConfession
          extraTags={extraTags}
          hlapisky={generatedHlasky}
          userTagsCount={userTags.length}
          gameMode={gameMode}
        />
      )}

      {/* Tlačítko pro zobrazení jiného podobného jídla */}
      {totalMatches > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-4 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextMatch}
            className={`px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-lg transition-shadow ${
              isSerious 
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            🔄 Jiné podobné jídlo ({currentMatchIndex + 1}/{totalMatches})
          </motion.button>
        </motion.div>
      )}

      {/* Tlačítko pro zavření */}
      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className={`mt-4 sm:mt-8 px-6 py-3 sm:px-8 sm:py-4 text-white text-lg sm:text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow ${
          isSerious 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
            : 'bg-gradient-to-r from-pink-500 to-purple-600'
        }`}
      >
        {isSerious ? '✓ Hotovo' : '✓ Super, díky!'}
      </motion.button>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500"
      >
        {isSerious ? 'Zpět na výběr ingrediencí' : 'Klikni pro návrat na hlavní stránku'}
      </motion.p>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={getJidloImagePath(jidlo.obrazek, gameMode)}
              alt={jidlo.nazev}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Yummy';
              }}
            />
            
            {/* Zavřít tlačítko */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
              onClick={() => setIsFullscreen(false)}
            >
              ✕
            </motion.button>
            
            {/* Název jídla */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                {jidlo.nazev}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
