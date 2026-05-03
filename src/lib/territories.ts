import type { Territory } from "./types";

// 14 Czech regions (kraje) with their IDs and display names
export const CZECH_TERRITORIES: Territory[] = [
  { id: "karlovarsky", name: "Karlovarský", ownerId: null },
  { id: "ustecky", name: "Ústecký", ownerId: null },
  { id: "liberecky", name: "Liberecký", ownerId: null },
  { id: "kralovehradecky", name: "Královéhradecký", ownerId: null },
  { id: "pardubicky", name: "Pardubický", ownerId: null },
  { id: "stredocesky", name: "Středočeský", ownerId: null },
  { id: "praha", name: "Praha", ownerId: null },
  { id: "plzensky", name: "Plzeňský", ownerId: null },
  { id: "jihocesky", name: "Jihočeský", ownerId: null },
  { id: "vysocina", name: "Kraj Vysočina", ownerId: null },
  { id: "jihomoravsky", name: "Jihomoravský", ownerId: null },
  { id: "olomoucky", name: "Olomoucký", ownerId: null },
  { id: "zlinsky", name: "Zlínský", ownerId: null },
  { id: "moravskoslezsky", name: "Moravskoslezský", ownerId: null },
];

export function getInitialTerritories(): Record<string, Territory> {
  return Object.fromEntries(
    CZECH_TERRITORIES.map((t) => [t.id, { ...t, ownerId: null }])
  );
}

// SVG polygon points for each region on an 800×500 viewBox
// Approximate geographic positions of Czech Republic's 14 kraje
export const TERRITORY_PATHS: Record<string, string> = {
  karlovarsky:
    "50,95 100,70 175,62 205,82 202,108 185,160 128,172 52,148",
  ustecky:
    "185,50 210,35 345,28 382,55 378,95 362,130 290,148 200,130 185,95",
  liberecky:
    "362,28 445,22 478,52 468,102 402,115 365,88",
  kralovehradecky:
    "448,68 548,58 578,88 568,148 548,158 462,148 442,108",
  pardubicky:
    "458,138 552,128 575,158 558,232 492,255 462,228 452,178",
  stredocesky:
    "128,168 202,130 292,102 368,128 462,118 492,162 482,218 462,258 378,278 292,288 212,272 162,242 132,198",
  praha:
    "292,190 318,182 330,200 318,222 292,222 278,208",
  plzensky:
    "28,158 118,138 168,162 172,248 148,312 88,338 32,312 25,258",
  jihocesky:
    "140,258 212,268 292,282 378,272 418,298 408,390 358,432 228,442 108,402 88,328",
  vysocina:
    "378,272 462,252 498,282 492,378 448,398 392,388 368,355 362,298",
  jihomoravsky:
    "448,295 528,275 628,302 648,362 612,418 498,428 448,392 440,342",
  olomoucky:
    "548,162 638,172 668,212 662,292 598,308 548,262",
  zlinsky:
    "598,272 658,252 702,278 698,328 648,358 602,348 582,308",
  moravskoslezsky:
    "628,138 722,138 768,178 758,272 718,308 662,295 638,248 598,212 615,172",
};

// Label positions for each region (center points for text display)
export const TERRITORY_LABELS: Record<string, { x: number; y: number }> = {
  karlovarsky:   { x: 128, y: 118 },
  ustecky:       { x: 285, y: 92 },
  liberecky:     { x: 418, y: 72 },
  kralovehradecky: { x: 508, y: 112 },
  pardubicky:    { x: 512, y: 192 },
  stredocesky:   { x: 308, y: 192 },
  praha:         { x: 305, y: 208 },
  plzensky:      { x: 98,  y: 235 },
  jihocesky:     { x: 258, y: 362 },
  vysocina:      { x: 432, y: 332 },
  jihomoravsky:  { x: 545, y: 358 },
  olomoucky:     { x: 605, y: 238 },
  zlinsky:       { x: 640, y: 308 },
  moravskoslezsky: { x: 682, y: 225 },
};
