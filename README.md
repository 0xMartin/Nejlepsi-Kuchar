# 👨‍🍳 Nejlepší Kuchař

> *Osobní kulinářský génius, který vám doporučí jídla na základě vašich (pochybných) preferencí.*

**Nejlepší Kuchař** je interaktivní webová aplikace, kde si vybíráte své oblíbené ingredience a na základě toho vám kuchař doporučí bizarní pokrm z jeho tajné kuchařky. A pokud některou ingredienci nemá? Nebojte, vymluví se jako pravý profesionál!

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

---

## 🎮 Jak to funguje

1. **Odpověz na otázky** - Z náhodně vybraných dvojic ingrediencí vyber tu, která ti více chutná
2. **Vyber 3 ingredience** - Nebo klidně přeskoč, pokud ti nic nechutná
3. **Získej doporučení** - Kuchař ti najde nejvhodnější jídlo z jeho... zajímavé kolekce
4. **Užij si výmluvy** - Když něco chybí, kuchař má vždy po ruce kreativní vysvětlení

---

## 🍽️ Ukázka jídel

<table>
  <tr>
    <td align="center"><img src="public/data/jidlo-img/res_bat_sushi.png" width="150"><br><b>Sushidrink z Netopýra</b><br><i>Křupavá křídla v rýžovém objetí</i></td>
    <td align="center"><img src="public/data/jidlo-img/res_coal_dessert.png" width="150"><br><b>Uhelný dezert Popelka</b><br><i>Sladké jako polibek v dole Hlubina</i></td>
    <td align="center"><img src="public/data/jidlo-img/res_dolphin_pasta.png" width="150"><br><b>Delfíní sen na špagetách</b><br><i>Elegance mořských hlubin</i></td>
  </tr>
  <tr>
    <td align="center"><img src="public/data/jidlo-img/res_mushroom_choco.png" width="150"><br><b>Hřibový šok v čokoládě</b><br><i>Les vs čokoládovna v temné uličce</i></td>
    <td align="center"><img src="public/data/jidlo-img/res_chicken_ice.png" width="150"><br><b>Kuřecí zmrzlina Pařát</b><br><i>Mražené osvěžení s pařátem</i></td>
    <td align="center"><img src="public/data/jidlo-img/res_cheese_butterfly.png" width="150"><br><b>Tvarůžkový donut s motýly</b><br><i>Vůně, co probudí i sousedy</i></td>
  </tr>
  <tr>
    <td align="center"><img src="public/data/jidlo-img/res_bat_stew.png" width="150"><br><b>Netopýří guláš v řase</b><br><i>Upíři nemají šanci</i></td>
    <td align="center"><img src="public/data/jidlo-img/res_coal_pasta.png" width="150"><br><b>Uhelné špagety Ostravsko</b><br><i>Energie z hloubky 800 metrů</i></td>
    <td align="center"><img src="public/data/jidlo-img/res_cheese_ice_chilli.png" width="150"><br><b>Tvarůžková zmrzlina s chilli</b><br><i>Pálí a voní jako ponožky</i></td>
  </tr>
</table>

---

## 🛠️ Technologie

- **React 18** + **TypeScript** - moderní frontend
- **Vite** - rychlý build tool
- **Tailwind CSS v4** - utility-first styling
- **Framer Motion** - plynulé animace
- **CSV data** - snadná editace obsahu

---

## 🚀 Instalace a spuštění

```bash
# Klonování repozitáře
git clone https://github.com/0xMartin/Nejlepsi-Kuchar.git
cd Nejlepsi-Kuchar

# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev

# Build pro produkci
npm run build
```

---

## 📁 Struktura projektu

```
nejlepsi-kuchar/
├── public/
│   ├── data/
│   │   ├── ingredience.csv      # Seznam ingrediencí
│   │   ├── jidlo.csv            # Databáze jídel
│   │   ├── hlasky.csv           # Hlášky kuchaře
│   │   ├── hlasky-vymluvy.csv   # Výmluvy pro chybějící ingredience
│   │   ├── jidlo-img/           # Obrázky jídel
│   │   └── ingredience-img/     # Obrázky ingrediencí
│   └── kuchar.png               # Maskot aplikace
├── src/
│   ├── components/              # React komponenty
│   ├── types.ts                 # TypeScript typy
│   ├── utils.ts                 # Pomocné funkce
│   └── App.tsx                  # Hlavní komponenta
└── index.html
```

---

## 📝 Licence

MIT

---

*Vytvořeno s láskou a pochybným vkusem. Bon appétit! 🍴*
