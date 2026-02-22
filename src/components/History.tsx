import { motion } from 'framer-motion';
import { HistoryEntry, GameMode } from '../types';
import { getJidloImagePath } from '../utils';
import { useState, useEffect } from 'react';

type FilterMode = 'all' | GameMode;

interface HistoryProps {
  entries: HistoryEntry[];
  onBack: () => void;
  onClear: () => void;
}

export function History({ entries, onBack, onClear }: HistoryProps) {
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  
  const ITEMS_PER_PAGE = 8;
  
  // Filtrované záznamy podle módu
  const filteredEntries = filterMode === 'all' 
    ? entries 
    : entries.filter(e => (e.gameMode || 'experimental') === filterMode);
  
  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset stránky pokud je aktuální stránka mimo rozsah
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (filteredEntries.length === 0) {
      setCurrentPage(1);
    }
  }, [filteredEntries.length, totalPages, currentPage]);
  
  // Reset stránky při změně filtru
  useEffect(() => {
    setCurrentPage(1);
  }, [filterMode]);

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
        <p className="text-center text-gray-600 mb-4">
          Historie tvých kulinářských dobrodružství
        </p>
        
        {/* Filtr módu */}
        {entries.length > 0 && (
          <div className="flex justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                filterMode === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                  : 'bg-white/70 text-gray-600 hover:bg-white'
              }`}
            >
              Vše ({entries.length})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterMode('experimental')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                filterMode === 'experimental'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                  : 'bg-white/70 text-gray-600 hover:bg-white'
              }`}
            >
              🧪 Experiment ({entries.filter(e => (e.gameMode || 'experimental') === 'experimental').length})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterMode('serious')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                filterMode === 'serious'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                  : 'bg-white/70 text-gray-600 hover:bg-white'
              }`}
            >
              👨‍🍳 Seriózní ({entries.filter(e => e.gameMode === 'serious').length})
            </motion.button>
          </div>
        )}
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
      ) : filteredEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <span className="text-6xl block mb-4">{filterMode === 'serious' ? '👨‍🍳' : '🧪'}</span>
          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            Žádná {filterMode === 'serious' ? 'seriózní' : 'experimentální'} jídla
          </h2>
          <p className="text-gray-500">
            V tomto módu jsi ještě nic neuvařil/a!
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-3xl space-y-3"
        >
          {paginatedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedEntry(entry)}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getJidloImagePath(entry.jidlo.obrazek, entry.gameMode || 'experimental')}
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
                      <span key={tag} className={`px-2 py-0.5 rounded-full text-xs ${
                        entry.gameMode === 'serious' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-pink-100 text-pink-600'
                      }`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </div>
            </motion.div>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-200"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full font-semibold shadow-md transition-colors ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
              >
                ← Předchozí
              </motion.button>
              
              <div className="flex items-center gap-1 px-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full font-semibold text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                        : 'bg-white/50 text-gray-600 hover:bg-white'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full font-semibold shadow-md transition-colors ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
              >
                Další →
              </motion.button>
            </motion.div>
          )}
          
          {/* Info o stránkování */}
          <p className="text-center text-sm text-gray-500 mt-3">
            Zobrazeno {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredEntries.length)} z {filteredEntries.length} jídel
            {filterMode !== 'all' && ` (filtr: ${filterMode === 'serious' ? 'seriózní' : 'experimentální'})`}
          </p>
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
                src={getJidloImagePath(selectedEntry.jidlo.obrazek, selectedEntry.gameMode || 'experimental')}
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
                  {selectedEntry.gameMode === 'serious' ? '🧂 Vybrané ingredience' : '🏷️ Tvé ingredience'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.userTags.map(tag => (
                    <span key={tag} className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedEntry.gameMode === 'serious' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Kuchařova hláška */}
              {selectedEntry.missingTags.length === 0 && selectedEntry.extraTags.length === 0 ? (
                <div className={`rounded-xl p-4 border ${
                  selectedEntry.gameMode === 'serious' 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex gap-3">
                    <img 
                      src={selectedEntry.gameMode === 'serious' ? './kuchar-serious.png' : './kuchar.png'} 
                      alt="Kuchař" 
                      className="w-16 h-16 object-contain flex-shrink-0" 
                    />
                    <div>
                      <h4 className={`font-semibold flex items-center gap-2 mb-2 ${
                        selectedEntry.gameMode === 'serious' ? 'text-emerald-800' : 'text-green-800'
                      }`}>
                        {selectedEntry.gameMode === 'serious' ? '⭐ Výborná shoda!' : '🏆 Perfektní shoda!'}
                      </h4>
                      <p className={`italic text-sm ${
                        selectedEntry.gameMode === 'serious' ? 'text-emerald-700' : 'text-green-700'
                      }`}>
                        {selectedEntry.gameMode === 'serious' 
                          ? 'Všechny vaše ingredience jsou zahrnuty v receptu.' 
                          : 'Kuchař odvedl přesně to, co jsi chtěl/a!'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (selectedEntry.hlasky?.length > 0 || selectedEntry.hlaska) && (
                <div className={`rounded-xl p-4 border ${
                  selectedEntry.gameMode === 'serious' 
                    ? 'bg-slate-50 border-slate-200' 
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex gap-3">
                    <img 
                      src={selectedEntry.gameMode === 'serious' ? './kuchar-serious.png' : './kuchar.png'} 
                      alt="Kuchař" 
                      className="w-16 h-16 object-contain flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold mb-3 ${
                        selectedEntry.gameMode === 'serious' ? 'text-slate-800' : 'text-amber-800'
                      }`}>
                        {selectedEntry.gameMode === 'serious' ? 'Informace k receptu' : 'Kuchařovo doznání'}
                      </h4>
                      {selectedEntry.hlasky?.length > 0 ? (
                        <div className="space-y-2">
                          {selectedEntry.hlasky.map((h, idx) => (
                            <div key={idx} className={`rounded-lg p-2 ${
                              selectedEntry.gameMode === 'serious' ? 'bg-slate-100/50' : 'bg-amber-100/50'
                            }`}>
                              <span className={`text-xs font-medium ${
                                selectedEntry.gameMode === 'serious' ? 'text-blue-600' : 'text-red-600'
                              }`}>#{h.tag}: </span>
                              <span className={`italic text-sm ${
                                selectedEntry.gameMode === 'serious' ? 'text-slate-700' : 'text-amber-700'
                              }`}>"{h.hlaska}"</span>
                            </div>
                          ))}
                        </div>
                      ) : selectedEntry.hlaska && (
                        <div>
                          {selectedEntry.extraTags.length > 0 && (
                            <div className="mb-2">
                              <span className={`text-xs ${
                                selectedEntry.gameMode === 'serious' ? 'text-blue-600' : 'text-red-600'
                              }`}>
                                {selectedEntry.gameMode === 'serious' ? 'Další ingredience: ' : 'Chybějící ingredience: '}
                              </span>
                              {selectedEntry.extraTags.map(tag => (
                                <span key={tag} className={`text-xs font-medium ${
                                  selectedEntry.gameMode === 'serious' ? 'text-blue-700' : 'text-red-700'
                                }`}>#{tag} </span>
                              ))}
                            </div>
                          )}
                          <p className={`italic text-sm ${
                            selectedEntry.gameMode === 'serious' ? 'text-slate-700' : 'text-amber-700'
                          }`}>"{selectedEntry.hlaska}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
