import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Intro, Quiz, Result, History, PickyEater } from './components';
import { 
  parseIngredience, 
  parseJidla, 
  parseHlasky,
  findBestMatch,
  getRandomHlaska
} from './utils';
import { AppState, Ingredience, Jidlo, Hlaska, MatchResult, HistoryEntry } from './types';

const HISTORY_KEY = 'nejlepsi-kuchar-history';

function App() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [ingredience, setIngredience] = useState<Ingredience[]>([]);
  const [jidla, setJidla] = useState<Jidlo[]>([]);
  const [hlasky, setHlasky] = useState<Hlaska[]>([]);
  const [pickyHlasky, setPickyHlasky] = useState<Hlaska[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [result, setResult] = useState<MatchResult | null>(null);
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

  // Načtení CSV dat při startu
  useEffect(() => {
    async function loadData() {
      try {
        const [ingredienceRes, jidlaRes, hlaskyRes, pickyRes] = await Promise.all([
          fetch('./data/ingredience.csv'),
          fetch('./data/jidlo.csv'),
          fetch('./data/hlasky-vymluvy.csv'),
          fetch('./data/hlasky-vybirave.csv')
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
  }, []);

  // Uložení do historie
  const saveToHistory = (matchResult: MatchResult, tags: string[], hlaska: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      jidlo: matchResult.jidlo,
      userTags: tags,
      matchedTags: matchResult.matchedTags,
      missingTags: matchResult.missingTags,
      extraTags: matchResult.extraTags,
      hlaska
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
    const matchResult = findBestMatch(tags, jidla);
    setResult(matchResult);
    
    // Uložit do historie
    const hlaska = getRandomHlaska(hlasky);
    saveToHistory(matchResult, tags, hlaska);
    
    setAppState('result');
  };

  // Zavření výsledku
  const handleClose = () => {
    setAppState('intro');
    setSelectedTags([]);
    setResult(null);
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
          <Intro onStart={handleStart} onHistory={handleHistory} />
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
            hlasky={hlasky}
            onClose={handleClose}
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
