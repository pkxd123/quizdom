# 🗺️ Quizdom – Dobyvatelská kvízová hra

Multiplayerová tahová hra inspirovaná stylem „Dobyvatel". Obsaď všechny kraje České republiky správnými odpověďmi na otázky!

---

## 🚀 Rychlý start

### Požadavky
- [Node.js 18+](https://nodejs.org/) (doporučeno 20 LTS)
- npm (součást Node.js)

### Instalace a spuštění lokálně

```bash
# 1. Klonuj repozitář
git clone https://github.com/pkxd123/quizdom.git
cd quizdom

# 2. Nainstaluj závislosti
npm install

# 3. Spusť vývojový server
npm run dev
```

Otevři prohlížeč na **http://localhost:3000** – hra je připravena!

---

## 🖥️ Spuštění ve VS Code

1. Otevři složku s projektem ve VS Code:
   **File → Open Folder → vyber složku `quizdom`**
2. Otevři integrovaný terminál:
   **Terminal → New Terminal** (nebo `Ctrl+backtick`)
3. Spusť příkazy:
   ```bash
   npm install
   npm run dev
   ```
4. Klikni na odkaz `http://localhost:3000` v terminálu

**Doporučené VS Code extensions:**
- [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.tailwind-css-intellisense)
- [Prettier – Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

## 🎮 Jak hrát

### Vytvoření hry
1. Klikni na **Vytvořit novou hru**
2. Zadej své jméno a počet kol (výchozí: 10)
3. Sdílej **kód hry** (6 písmen) se spoluhráči

### Připojení ke hře
1. Klikni na **Připojit se ke hře**
2. Zadej jméno a **kód hry** od hostitele

### Průběh hry
- Hostitel spustí hru tlačítkem **Spustit hru**
- Hráči se střídají v tazích
- Na svém tahu klikni na kraj na mapě:
  - **Volné území** → zobrazí se ABCD nebo číselná otázka → při správné odpovědi kraj obsadíš
  - **Cizí území** → útok! Správná odpověď = kraj přebereš
  - **Vlastní území** → nelze vybrat
- Každý hráč má **10 tahů** (konfigurovatelné při vytváření hry)
- Po vyčerpání tahů všech hráčů se zobrazí **výsledková tabulka**

### Typy otázek
| Typ | Popis |
|-----|-------|
| **ABCD** | Vyber jednu ze 4 možností |
| **Číselná** | Zadej číslo – vyhrává odpověď nejblíže správné hodnotě (v rámci tolerance) |

---

## 📤 Nahrání přes GitHub Desktop

1. Otevři **GitHub Desktop**
2. Vyber **File → Add local repository** a vyber složku `quizdom`
3. Proveď změny v kódu
4. V GitHub Desktop zadej **Summary** (název commitu) a klikni **Commit to main**
5. Klikni **Push origin**

---

## ☁️ Nasazení na Vercel

### Jednoduchý postup
1. Přihlas se na [vercel.com](https://vercel.com)
2. Klikni **Add New → Project**
3. Importuj repozitář `pkxd123/quizdom` z GitHubu
4. Vercel automaticky detekuje Next.js – klikni **Deploy**
5. Hra bude dostupná na `https://quizdom-xxx.vercel.app`

### ⚠️ Omezení realtime multiplayeru na Vercelu

**Aktuální MVP** používá **in-memory state** (RAM serveru) s **API pollingem** každé 2 sekundy. Toto funguje skvěle lokálně, ale na Vercelu (serverless) má jedno omezení:

> **Serverless funkce jsou stateless** – každý API request může běžet na jiné instanci, takže in-memory stav se mezi požadavky **nesdílí**.

**Dopad:** Na Vercelu nebude multiplayer fungovat správně (hra nebude synchronizovaná mezi hráči).

### Řešení pro produkční nasazení

| Řešení | Složitost | Cena |
|--------|-----------|------|
| [Vercel KV](https://vercel.com/storage/kv) (Redis) | Nízká | Zdarma (limit) |
| [PlanetScale](https://planetscale.com) (MySQL) | Střední | Zdarma (limit) |
| [Supabase](https://supabase.com) (PostgreSQL) | Střední | Zdarma (limit) |
| [Pusher](https://pusher.com) (WebSockets) | Střední | Zdarma (limit) |
| Self-hosted VPS + Socket.io | Vyšší | ~5 USD/měs |

**Pro rychlé řešení:** Nahraď `src/lib/gameStore.ts` verzí s Vercel KV – změna je minimální.

---

## 📁 Struktura projektu

```
quizdom/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Hlavní menu / lobby
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Globální styly
│   │   ├── game/[gameId]/
│   │   │   └── page.tsx          # Herní stránka
│   │   └── api/game/
│   │       ├── route.ts          # POST /api/game (vytvoření hry)
│   │       └── [gameId]/
│   │           ├── route.ts      # GET (stav), POST (připojení/start)
│   │           ├── attack/
│   │           │   └── route.ts  # POST (výběr území)
│   │           └── answer/
│   │               └── route.ts  # POST (odpověď na otázku)
│   ├── components/
│   │   ├── CzechMap.tsx          # SVG mapa ČR
│   │   ├── QuestionModal.tsx     # Modal s otázkou
│   │   ├── PlayerPanel.tsx       # Panel hráčů
│   │   └── GameEndModal.tsx      # Konec hry
│   └── lib/
│       ├── types.ts              # TypeScript typy
│       ├── gameStore.ts          # In-memory herní stav
│       ├── questions.ts          # Banka otázek (ABCD + číselné)
│       └── territories.ts        # Data krajů + SVG cesty
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔧 Vývoj

```bash
npm run dev    # Vývojový server (hot reload)
npm run build  # Produkční build
npm run start  # Produkční server
npm run lint   # ESLint
```

---

## 🗺️ Regiony (kraje ČR)

Hra obsahuje všech **14 krajů** České republiky:

| # | Kraj | # | Kraj |
|---|------|---|------|
| 1 | Karlovarský | 8 | Plzeňský |
| 2 | Ústecký | 9 | Jihočeský |
| 3 | Liberecký | 10 | Kraj Vysočina |
| 4 | Královéhradecký | 11 | Jihomoravský |
| 5 | Pardubický | 12 | Olomoucký |
| 6 | Středočeský | 13 | Zlínský |
| 7 | Praha | 14 | Moravskoslezský |

---

## ❓ Banka otázek

- **25 ABCD otázek** (česká geografie, historie, kultura)
- **10 číselných otázek** (roky, výšky, vzdálenosti)

Otázky lze snadno rozšiřovat v souboru `src/lib/questions.ts`.

---

## 📝 Licence

MIT – volně použitelné pro osobní i komerční projekty.
