import { motion } from 'framer-motion';
import { HistoryEntry } from '../types';
import { getJidloImagePath } from '../utils';
import { useState } from 'react';

interface HistoryProps {
  entries: HistoryEntry[];
  onBack: () => void;
  onClear: () => void;
}

export function History({ entries, onBack, onClear }: HistoryProps) {
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-4 py-2 bg-white/70 rounded-full text-gray-600 font-semibold shadow-md hover:bg-white transition-colors"
          >
            ← Zpět
          </motion.button>
          
          {entries.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className="px-4 py-2 bg-red-100 rounded-full text-red-600 font-semibold shadow-md hover:bg-red-200 transition-colors"
            >
              🗑️ Smazat historii
            </motion.button>
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
          📜 Moje jídla
        </h1>
        <p className="text-center text-gray-600">
          Historie tvých kulinářských dobrodružství
        </p>
      </motion.div>

      {/* Seznam jídel */}
      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <span className="text-6xl block mb-4">🍽️</span>
          <h2 className="text-2xl font-bold text-gray-700 mb-3">Zatím prázdno</h2>
          <p className="text-gray-500">Ještě jsi nenechal/a kuchaře vařit!</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-3xl space-y-3"
        >
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedEntry(entry)}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getJidloImagePath(entry.jidlo.obrazek)}
                  alt={entry.jidlo.nazev}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=🍽️';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{entry.jidlo.nazev}</h3>
                  <p className="text-sm text-gray-500">{formatDate(entry.timestamp)}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.userTags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detail modal */}
      {selectedEntry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedEntry(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Obrázek */}
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
              <img
                src={getJidloImagePath(selectedEntry.jidlo.obrazek)}
                alt={selectedEntry.jidlo.nazev}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Yummy';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                {selectedEntry.jidlo.nazev}
              </h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800 font-bold hover:bg-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Obsah */}
            <div className="p-8">
              <p className="text-sm text-gray-500 mb-6">
                {formatDate(selectedEntry.timestamp)}
              </p>
              
              <p className="text-gray-700 italic mb-6">
                "{selectedEntry.jidlo.popis}"
              </p>

              {/* Tvé ingredience */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  🏷️ Tvé ingredience
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.userTags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Kuchařova hláška */}
              {selectedEntry.missingTags.length === 0 && selectedEntry.extraTags.length === 0 ? (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🏆</span>
                    <h4 className="font-semibold text-green-800">Perfektní shoda!</h4>
                  </div>
                  <p className="text-green-700 italic">Kuchař odvedl přesně to, co jsi chtěl/a!</p>
                </div>
              ) : selectedEntry.hlaska && (
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">👨‍🍳</span>
                    <h4 className="font-semibold text-amber-800">Kuchařovo doznání</h4>
                  </div>
                  {selectedEntry.missingTags.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs text-red-600">Chybějící ingredience: </span>
                      {selectedEntry.missingTags.map(tag => (
                        <span key={tag} className="text-xs text-red-700 font-medium">#{tag} </span>
                      ))}
                    </div>
                  )}
                  <p className="text-amber-700 italic">"{selectedEntry.hlaska}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
