import { Ingredience, Jidlo, Hlaska, MatchResult } from './types';

/**
 * Parsuje CSV řetězec na pole řádků
 */
function parseCSV(csv: string): string[][] {
  const lines = csv.trim().split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ';' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    
    return result;
  });
}

/**
 * Parsuje ingredience.csv
 */
export function parseIngredience(csv: string): Ingredience[] {
  const rows = parseCSV(csv);
  // Přeskočíme hlavičku
  return rows.slice(1).map(row => ({
    id: parseInt(row[0], 10),
    volba: row[1],
    tag: row[2]
  }));
}

/**
 * Parsuje jidlo.csv
 */
export function parseJidla(csv: string): Jidlo[] {
  const rows = parseCSV(csv);
  // Přeskočíme hlavičku
  return rows.slice(1).map(row => ({
    id: parseInt(row[0], 10),
    nazev: row[1],
    tagy: row[2].split('|').map(t => t.trim()),
    obrazek: row[3],
    popis: row[4]
  }));
}

/**
 * Parsuje hlasky.csv
 */
export function parseHlasky(csv: string): Hlaska[] {
  const rows = parseCSV(csv);
  // Přeskočíme hlavičku
  return rows.slice(1).map(row => ({
    id: parseInt(row[0], 10),
    text: row[1]
  }));
}

/**
 * Najde nejlepší shodu jídla podle vybraných tagů
 */
export function findBestMatch(userTags: string[], jidla: Jidlo[]): MatchResult {
  let bestMatch: MatchResult | null = null;
  let bestScore = -1;
  
  for (const jidlo of jidla) {
    // Počítáme průnik tagů
    const matchedTags = jidlo.tagy.filter(tag => userTags.includes(tag));
    
    // Tagy jídla, které uživatel nevybral
    const missingTags = jidlo.tagy.filter(tag => !userTags.includes(tag));
    
    // Tagy uživatele, které jídlo nemá
    const extraTags = userTags.filter(tag => !jidlo.tagy.includes(tag));
    
    // Skóre je počet shodných tagů
    // Můžeme přidat bonus za perfektní shodu (0 missing a extra tagů)
    let score = matchedTags.length;
    
    // Bonus za menší počet chybějících/extra tagů
    score -= missingTags.length * 0.1;
    score -= extraTags.length * 0.1;
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = {
        jidlo,
        matchedTags,
        missingTags,
        extraTags,
        score
      };
    }
  }
  
  // Pokud se nic nenašlo (nemělo by nastat), vrátíme první jídlo
  if (!bestMatch) {
    return {
      jidlo: jidla[0],
      matchedTags: [],
      missingTags: jidla[0].tagy,
      extraTags: userTags,
      score: 0
    };
  }
  
  return bestMatch;
}

/**
 * Vybere náhodnou hlášku
 */
export function getRandomHlaska(hlasky: Hlaska[]): string {
  if (!hlasky || hlasky.length === 0) return 'Kuchař zrovna nemá co říct...';
  const index = Math.floor(Math.random() * hlasky.length);
  return hlasky[index]?.text || 'Kuchař zrovna nemá co říct...';
}

/**
 * Generuje cestu k obrázku jídla
 */
export function getJidloImagePath(obrazek: string): string {
  // Změníme příponu z .webp na .png
  const pngName = obrazek.replace('.webp', '.png');
  return `./data/jidlo-img/${pngName}`;
}
