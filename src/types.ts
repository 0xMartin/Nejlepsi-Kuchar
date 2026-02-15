// Typy pro parsovaná data z CSV souborů

export interface Ingredience {
  id: number;
  volba: string;
  tag: string;
}

export interface Jidlo {
  id: number;
  nazev: string;
  tagy: string[];
  obrazek: string;
  popis: string;
}

export interface Hlaska {
  id: number;
  text: string;
}

// Typ pro výsledek matchování
export interface MatchResult {
  jidlo: Jidlo;
  matchedTags: string[];
  missingTags: string[]; // Tagy jídla, které uživatel nevybral
  extraTags: string[]; // Tagy uživatele, které jídlo nemá
  score: number;
}

// Stav aplikace
export type AppState = 'intro' | 'quiz' | 'result' | 'history' | 'picky';

// Záznam v historii
export interface HistoryEntry {
  id: string;
  timestamp: number;
  jidlo: Jidlo;
  userTags: string[];
  matchedTags: string[];
  missingTags: string[];
  extraTags: string[];
  hlasky: { tag: string; hlaska: string }[]; // Hlášky pro každý extra tag
  hlaska?: string; // Fallback pro staré záznamy
}
