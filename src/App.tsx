import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Intro, Quiz, Result, History, PickyEater } from './components';
import { 
  parseIngredience, 
  parseJidla, 
  parseHlasky,
  findAllBestMatches,
  getRandomHlaska
} from './utils';
import { AppState, Ingredience, Jidlo, Hlaska, MatchResult, HistoryEntry, GameMode } from './types';

const HISTORY_KEY = 'nejlepsi-kuchar-history';
const MODE_KEY = 'nejlepsi-kuchar-mode';

function App() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    const saved = localStorage.getItem(MODE_KEY);
    return (saved as GameMode) || 'experimental';
  });
  const [ingredience, setIngredience] = useState<Ingredience[]>([]);
  const [jidla, setJidla] = useState<Jidlo[]>([]);
  const [hlasky, setHlasky] = useState<Hlaska[]>([]);
  const [pickyHlasky, setPickyHlasky] = useState<Hlaska[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [allMatches, setAllMatches] = useState<MatchResult[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [generatedHlasky, setGeneratedHlasky] = useState<{ tag: string; hlaska: string }[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Načtení historie z localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Chyba při načítání historie:', e);
    }
  }, []);

  // Načtení CSV dat při startu nebo změně módu
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const dataPath = `./data/${gameMode}`;
        const [ingredienceRes, jidlaRes, hlaskyRes, pickyRes] = await Promise.all([
          fetch(`${dataPath}/ingredience.csv`),
          fetch(`${dataPath}/jidlo.csv`),
          fetch(`${dataPath}/hlasky-vymluvy.csv`),
          fetch(`${dataPath}/hlasky-vybirave.csv`)
        ]);

        if (!ingredienceRes.ok || !jidlaRes.ok || !hlaskyRes.ok || !pickyRes.ok) {
          throw new Error('Nepodařilo se načíst data');
        }

        const [ingredienceText, jidlaText, hlaskyText, pickyText] = await Promise.all([
          ingredienceRes.text(),
          jidlaRes.text(),
          hlaskyRes.text(),
          pickyRes.text()
        ]);

        setIngredience(parseIngredience(ingredienceText));
        setJidla(parseJidla(jidlaText));
        setHlasky(parseHlasky(hlaskyText));
        setPickyHlasky(parseHlasky(pickyText));
        setIsLoading(false);
      } catch (err) {
        console.error('Chyba při načítání dat:', err);
        setError('Nepodařilo se načíst data. Zkus obnovit stránku.');
        setIsLoading(false);
      }
    }

    loadData();
  }, [gameMode]);

  // Změna herního módu
  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    localStorage.setItem(MODE_KEY, mode);
  };

  // Uložení do historie
  const saveToHistory = (matchResult: MatchResult, tags: string[], hlaskyProIngredienc: { tag: string; hlaska: string }[]) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      jidlo: matchResult.jidlo,
      userTags: tags,
      matchedTags: matchResult.matchedTags,
      missingTags: matchResult.missingTags,
      extraTags: matchResult.extraTags,
      hlasky: hlaskyProIngredienc,
      hlaska: hlaskyProIngredienc[0]?.hlaska || '', // Fallback pro zpětnou kompatibilitu
      gameMode: gameMode
    };

    const newHistory = [entry, ...history].slice(0, 50); // Max 50 záznamů
    setHistory(newHistory);
    
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Chyba při ukládání historie:', e);
    }
  };

  // Smazání historie
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  // Spuštění kvízu
  const handleStart = () => {
    setSelectedTags([]);
    setResult(null);
    setAppState('quiz');
  };

  // Zobrazení historie
  const handleHistory = () => {
    setAppState('history');
  };

  // Dokončení kvízu
  const handleQuizComplete = (tags: string[]) => {
    setSelectedTags(tags);
    const matches = findAllBestMatches(tags, jidla);
    setAllMatches(matches);
    setCurrentMatchIndex(0);
    
    const matchResult = matches[0];
    setResult(matchResult);
    
    // Vygenerovat hlášky JEDNOU a použít pro zobrazení
    const hlaskyProIngredienc = matchResult.extraTags.map(tag => ({
      tag,
      hlaska: getRandomHlaska(hlasky)
    }));
    setGeneratedHlasky(hlaskyProIngredienc);
    
    // Neukládáme do historie hned - uložíme až při zavření
    
    setAppState('result');
  };

  // Přepnutí na další podobné jídlo
  const handleNextMatch = () => {
    if (allMatches.length <= 1) return;
    
    const nextIndex = (currentMatchIndex + 1) % allMatches.length;
    setCurrentMatchIndex(nextIndex);
    
    const nextMatch = allMatches[nextIndex];
    setResult(nextMatch);
    
    // Vygenerovat nové hlášky pro nové extra tagy
    const hlaskyProIngredienc = nextMatch.extraTags.map(tag => ({
      tag,
      hlaska: getRandomHlaska(hlasky)
    }));
    setGeneratedHlasky(hlaskyProIngredienc);
  };

  // Zavření výsledku
  const handleClose = () => {
    // Uložit do historie pouze aktuálně zobrazené jídlo
    if (result) {
      saveToHistory(result, selectedTags, generatedHlasky);
    }
    
    setAppState('intro');
    setSelectedTags([]);
    setResult(null);
    setAllMatches([]);
    setCurrentMatchIndex(0);
  };

  // Zpět z historie
  const handleBackFromHistory = () => {
    setAppState('intro');
  };

  // Vybíravý jedlík
  const handlePickyEater = () => {
    setAppState('picky');
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4"
          >
            👨‍🍳
          </motion.div>
          <p className="text-xl text-gray-600">Kuchař se připravuje...</p>
        </motion.div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-md">
          <span className="text-6xl mb-4 block">😵</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ups!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors"
          >
            Zkusit znovu
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {appState === 'intro' && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
        >
        <Intro 
            onStart={handleStart} 
            onHistory={handleHistory} 
            gameMode={gameMode}
            onModeChange={handleModeChange}
          />
        </motion.div>
      )}

      {appState === 'quiz' && (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
        >
        <Quiz 
            ingredience={ingredience} 
            onComplete={handleQuizComplete}
            onPickyEater={handlePickyEater}
            gameMode={gameMode}
          />
        </motion.div>
      )}

      {appState === 'picky' && (
        <motion.div
          key="picky"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
        >
          <PickyEater hlasky={pickyHlasky} onClose={handleClose} />
        </motion.div>
      )}

      {appState === 'result' && result && (
        <motion.div
          key="result"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Result
            result={result}
            userTags={selectedTags}
            generatedHlasky={generatedHlasky}
            onClose={handleClose}
            gameMode={gameMode}
            totalMatches={allMatches.length}
            currentMatchIndex={currentMatchIndex}
            onNextMatch={handleNextMatch}
          />
        </motion.div>
      )}

      {appState === 'history' && (
        <motion.div
          key="history"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
        >
          <History 
            entries={history} 
            onBack={handleBackFromHistory}
            onClear={clearHistory}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
