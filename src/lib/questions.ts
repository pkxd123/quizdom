import type { ABCDQuestion, NumericalQuestion, Question } from "./types";

export const ABCD_QUESTIONS: ABCDQuestion[] = [
  {
    id: "abcd_1",
    type: "abcd",
    text: "Které město je hlavním městem České republiky?",
    options: ["Brno", "Ostrava", "Praha", "Plzeň"],
    correctIndex: 2,
    difficulty: "easy",
  },
  {
    id: "abcd_2",
    type: "abcd",
    text: "Kolik krajů má Česká republika?",
    options: ["10", "12", "14", "16"],
    correctIndex: 2,
    difficulty: "easy",
  },
  {
    id: "abcd_3",
    type: "abcd",
    text: "Která řeka protéká centrem Prahy?",
    options: ["Labe", "Berounka", "Morava", "Vltava"],
    correctIndex: 3,
    difficulty: "easy",
  },
  {
    id: "abcd_4",
    type: "abcd",
    text: "Která hora je nejvyšší v České republice?",
    options: ["Praděd", "Lysá hora", "Sněžka", "Králický Sněžník"],
    correctIndex: 2,
    difficulty: "easy",
  },
  {
    id: "abcd_5",
    type: "abcd",
    text: "Ve kterém roce vstoupila Česká republika do Evropské unie?",
    options: ["2000", "2002", "2004", "2007"],
    correctIndex: 2,
    difficulty: "medium",
  },
  {
    id: "abcd_6",
    type: "abcd",
    text: "Kdo byl prvním prezidentem Československé republiky?",
    options: [
      "Edvard Beneš",
      "Tomáš Garrigue Masaryk",
      "Antonín Zápotocký",
      "Klement Gottwald",
    ],
    correctIndex: 1,
    difficulty: "medium",
  },
  {
    id: "abcd_7",
    type: "abcd",
    text: "Ve kterém kraji se nachází hora Sněžka?",
    options: [
      "Liberecký kraj",
      "Ústecký kraj",
      "Královéhradecký kraj",
      "Pardubický kraj",
    ],
    correctIndex: 2,
    difficulty: "medium",
  },
  {
    id: "abcd_8",
    type: "abcd",
    text: "Jak se jmenuje nejdelší řeka tekoucí výhradně po území ČR?",
    options: ["Labe", "Odra", "Vltava", "Ohře"],
    correctIndex: 2,
    difficulty: "medium",
  },
  {
    id: "abcd_9",
    type: "abcd",
    text: "Ve kterém roce vznikla samostatná Česká republika (oddělení od Slovenska)?",
    options: ["1989", "1991", "1993", "1995"],
    correctIndex: 2,
    difficulty: "easy",
  },
  {
    id: "abcd_10",
    type: "abcd",
    text: "Kde se nachází Pražský hrad?",
    options: ["Vinohrady", "Žižkov", "Hradčany", "Malá Strana"],
    correctIndex: 2,
    difficulty: "easy",
  },
  {
    id: "abcd_11",
    type: "abcd",
    text: "Které město je označováno jako moravská metropole?",
    options: ["Ostrava", "Olomouc", "Brno", "Zlín"],
    correctIndex: 2,
    difficulty: "easy",
  },
  {
    id: "abcd_12",
    type: "abcd",
    text: "Kdy byl postaven Karlův most v Praze?",
    options: ["v 11. století", "ve 14. století", "v 16. století", "v 18. století"],
    correctIndex: 1,
    difficulty: "medium",
  },
  {
    id: "abcd_13",
    type: "abcd",
    text: "Jak se jmenuje nejvyšší hora Moravy?",
    options: ["Lysá hora", "Praděd", "Sněžník", "Radegast"],
    correctIndex: 1,
    difficulty: "medium",
  },
  {
    id: "abcd_14",
    type: "abcd",
    text: "Která řeka protéká Brnem?",
    options: ["Dyje", "Jihlava", "Svratka", "Bečva"],
    correctIndex: 2,
    difficulty: "hard",
  },
  {
    id: "abcd_15",
    type: "abcd",
    text: "Ve kterém kraji se nachází město Liberec?",
    options: [
      "Ústecký kraj",
      "Liberecký kraj",
      "Středočeský kraj",
      "Královéhradecký kraj",
    ],
    correctIndex: 1,
    difficulty: "easy",
  },
  {
    id: "abcd_16",
    type: "abcd",
    text: "Kde sídlí Ústavní soud České republiky?",
    options: ["Praha", "Olomouc", "Brno", "Ostrava"],
    correctIndex: 2,
    difficulty: "hard",
  },
  {
    id: "abcd_17",
    type: "abcd",
    text: "Které pohoří tvoří přirozenou hranici ČR s Polskem na severovýchodě?",
    options: ["Krkonoše", "Jeseníky", "Beskydy", "Krušné hory"],
    correctIndex: 2,
    difficulty: "medium",
  },
  {
    id: "abcd_18",
    type: "abcd",
    text: "Jak se jmenuje největší přírodní jezero v ČR?",
    options: [
      "Máchovo jezero",
      "Čertovo jezero",
      "Černé jezero",
      "Plešné jezero",
    ],
    correctIndex: 2,
    difficulty: "hard",
  },
  {
    id: "abcd_19",
    type: "abcd",
    text: "Ve kterém roce vstoupilo Česko do NATO?",
    options: ["1993", "1997", "1999", "2004"],
    correctIndex: 2,
    difficulty: "medium",
  },
  {
    id: "abcd_20",
    type: "abcd",
    text: "Které město je sídlem Olomouckého arcibiskupství?",
    options: ["Brno", "Kroměříž", "Olomouc", "Znojmo"],
    correctIndex: 2,
    difficulty: "hard",
  },
  {
    id: "abcd_21",
    type: "abcd",
    text: "Jaká je měna České republiky?",
    options: ["Euro", "Koruna česká", "Forint", "Zlotý"],
    correctIndex: 1,
    difficulty: "easy",
  },
  {
    id: "abcd_22",
    type: "abcd",
    text: "Kde se nachází hrad Karlštejn?",
    options: [
      "Jihočeský kraj",
      "Ústecký kraj",
      "Středočeský kraj",
      "Plzeňský kraj",
    ],
    correctIndex: 2,
    difficulty: "medium",
  },
  {
    id: "abcd_23",
    type: "abcd",
    text: "Kdo napsal román Dobrý voják Švejk?",
    options: [
      "Karel Čapek",
      "Jaroslav Hašek",
      "Milan Kundera",
      "Franz Kafka",
    ],
    correctIndex: 1,
    difficulty: "medium",
  },
  {
    id: "abcd_24",
    type: "abcd",
    text: "Kde se nachází Škoda Auto, největší český automobilový výrobce?",
    options: ["Plzeň", "Mladá Boleslav", "Liberec", "Kladno"],
    correctIndex: 1,
    difficulty: "medium",
  },
  {
    id: "abcd_25",
    type: "abcd",
    text: "Jak se jmenuje historické centrum Prahy zapsané na seznamu UNESCO?",
    options: [
      "Malá Strana",
      "Staré Město",
      "Historické centrum Prahy",
      "Josefov",
    ],
    correctIndex: 2,
    difficulty: "easy",
  },
];

export const NUMERICAL_QUESTIONS: NumericalQuestion[] = [
  {
    id: "num_1",
    type: "numerical",
    text: "Ve kterém roce byl postaven Karlův most v Praze?",
    unit: "rok",
    correctValue: 1357,
    tolerance: 10,
    difficulty: "medium",
  },
  {
    id: "num_2",
    type: "numerical",
    text: "Jak vysoká je Sněžka, nejvyšší hora České republiky?",
    unit: "metrů",
    correctValue: 1603,
    tolerance: 30,
    difficulty: "medium",
  },
  {
    id: "num_3",
    type: "numerical",
    text: "Ve kterém roce vznikla samostatná Česká republika?",
    unit: "rok",
    correctValue: 1993,
    tolerance: 2,
    difficulty: "easy",
  },
  {
    id: "num_4",
    type: "numerical",
    text: "Jak dlouhá je řeka Vltava (v km)?",
    unit: "km",
    correctValue: 430,
    tolerance: 30,
    difficulty: "hard",
  },
  {
    id: "num_5",
    type: "numerical",
    text: "Kolik obyvatel má Praha přibližně (v tisících)?",
    unit: "tisíc obyvatel",
    correctValue: 1300,
    tolerance: 150,
    difficulty: "medium",
  },
  {
    id: "num_6",
    type: "numerical",
    text: "Ve kterém roce byl postaven Pražský orloj?",
    unit: "rok",
    correctValue: 1410,
    tolerance: 10,
    difficulty: "hard",
  },
  {
    id: "num_7",
    type: "numerical",
    text: "Ve kterém roce vstoupila ČR do NATO?",
    unit: "rok",
    correctValue: 1999,
    tolerance: 2,
    difficulty: "medium",
  },
  {
    id: "num_8",
    type: "numerical",
    text: "Jak vysoký je Praděd, nejvyšší hora Moravy (v metrech)?",
    unit: "metrů",
    correctValue: 1491,
    tolerance: 30,
    difficulty: "hard",
  },
  {
    id: "num_9",
    type: "numerical",
    text: "V jakém roce bylo Česko přijato do Evropské unie?",
    unit: "rok",
    correctValue: 2004,
    tolerance: 1,
    difficulty: "easy",
  },
  {
    id: "num_10",
    type: "numerical",
    text: "Přibližně kolik km² má rozloha Jihočeského kraje (největší kraj ČR)?",
    unit: "km²",
    correctValue: 10057,
    tolerance: 1500,
    difficulty: "hard",
  },
];

export function getRandomQuestion(preferNumerical = false): Question {
  const useNumerical = preferNumerical && Math.random() < 0.35;
  if (useNumerical) {
    const idx = Math.floor(Math.random() * NUMERICAL_QUESTIONS.length);
    return NUMERICAL_QUESTIONS[idx];
  }
  const idx = Math.floor(Math.random() * ABCD_QUESTIONS.length);
  return ABCD_QUESTIONS[idx];
}

export function getAttackQuestion(): Question {
  // Attacks get a mix of ABCD and numerical (slightly harder)
  if (Math.random() < 0.25) {
    const hardNumerical = NUMERICAL_QUESTIONS.filter(
      (q) => q.difficulty === "hard" || q.difficulty === "medium"
    );
    const pool = hardNumerical.length > 0 ? hardNumerical : NUMERICAL_QUESTIONS;
    return pool[Math.floor(Math.random() * pool.length)];
  }
  return ABCD_QUESTIONS[Math.floor(Math.random() * ABCD_QUESTIONS.length)];
}

export function evaluateAnswer(question: Question, answer: string | number): boolean {
  if (question.type === "abcd") {
    const idx = typeof answer === "number" ? answer : parseInt(answer as string, 10);
    return idx === question.correctIndex;
  } else {
    const val = typeof answer === "number" ? answer : parseFloat(answer as string);
    if (isNaN(val)) return false;
    return Math.abs(val - question.correctValue) <= question.tolerance;
  }
}
