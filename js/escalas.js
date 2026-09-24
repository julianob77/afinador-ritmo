/* Diagramas de escalas para contrabaixo de 4 cordas, afinação padrão E-A-D-G.
   As posições são "movíveis": o mesmo desenho vale para qualquer tônica,
   bastando trocar o botão de tônica acima. */

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Cordas do grave pro agudo: E A D G. No diagrama exibimos de cima (aguda) pra baixo (grave).
const STRINGS = [
  { label: "G", open: 7 },
  { label: "D", open: 2 },
  { label: "A", open: 9 },
  { label: "E", open: 4 },
];

const NUM_FRETS = 12;
const FRET_MARKERS = [3, 5, 7, 9, 12];
const DOUBLE_MARKER = [12];

const SCALES = [
  // ===== Família da Escala Maior (Modos Gregos) =====
  {
    group: "Família da Escala Maior (Modos Gregos)",
    id: "ionio",
    name: "Maior (Jônio)",
    formula: "1  2  3  4  5  6  7",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    desc: "A escala mãe da harmonia tonal. Soa estável e resolutiva; combina com acordes maiores com 7ª maior (Maj7).",
  },
  {
    group: "Família da Escala Maior (Modos Gregos)",
    id: "dorico",
    name: "Dórico",
    formula: "1  2  b3  4  5  6  b7",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    desc: "Menor com 6ª maior. Muito usada em funk, jazz e fusion sobre acordes m7.",
  },
  {
    group: "Família da Escala Maior (Modos Gregos)",
    id: "frigio",
    name: "Frígio",
    formula: "1  b2  b3  4  5  b6  b7",
    intervals: [0, 1, 3, 5, 7, 8, 10],
    desc: "Menor com 2ª menor, clima espanhol/flamenco. Funciona sobre m7 e também sobre acordes dominantes com b9.",
  },
  {
    group: "Família da Escala Maior (Modos Gregos)",
    id: "lidio",
    name: "Lídio",
    formula: "1  2  3  #4  5  6  7",
    intervals: [0, 2, 4, 6, 7, 9, 11],
    desc: "Maior com 4ª aumentada. Som aberto/etéreo; combina com Maj7#11.",
  },
  {
    group: "Família da Escala Maior (Modos Gregos)",
    id: "mixolidio",
    name: "Mixolídio",
    formula: "1  2  3  4  5  6  b7",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    desc: "Maior com 7ª menor. A escala clássica para acordes dominantes (7), muito usada em blues, funk e rock.",
  },
  {
    group: "Família da Escala Maior (Modos Gregos)",
    id: "eolio",
    name: "Eólio (menor natural)",
    formula: "1  2  b3  4  5  b6  b7",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    desc: "A escala menor natural. Relativa menor da escala maior; base do rock e pop em tonalidade menor.",
  },
  {
    group: "Família da Escala Maior (Modos Gregos)",
    id: "locrio",
    name: "Lócrio",
    formula: "1  b2  b3  4  b5  b6  b7",
    intervals: [0, 1, 3, 5, 6, 8, 10],
    desc: "Único modo com 5ª diminuta. Usado sobre acordes m7b5 (semidiminutos), raro como centro tonal.",
  },

  // ===== Família da Escala Menor Melódica (Modos do Jazz) =====
  {
    group: "Família da Escala Menor Melódica (Modos do Jazz)",
    id: "menor-melodica",
    name: "Menor melódica",
    formula: "1  2  b3  4  5  6  7",
    intervals: [0, 2, 3, 5, 7, 9, 11],
    desc: "Menor com 6ª e 7ª maiores. Muito usada em jazz sobre acordes m/Maj7 e em linhas de aproximação.",
  },
  {
    group: "Família da Escala Menor Melódica (Modos do Jazz)",
    id: "dorico-b2",
    name: "Dórico b2 (Frígio #6)",
    formula: "1  b2  b3  4  5  6  b7",
    intervals: [0, 1, 3, 5, 7, 9, 10],
    desc: "2º modo da menor melódica. Frígio com a 6ª maior; usado sobre acordes m7 com b9.",
  },
  {
    group: "Família da Escala Menor Melódica (Modos do Jazz)",
    id: "lidio-aumentado",
    name: "Lídio aumentado",
    formula: "1  2  3  #4  #5  6  7",
    intervals: [0, 2, 4, 6, 8, 9, 11],
    desc: "3º modo da menor melódica. Lídio com a 5ª aumentada; soa flutuante, comum sobre acordes Maj7#5.",
  },
  {
    group: "Família da Escala Menor Melódica (Modos do Jazz)",
    id: "lidio-dominante",
    name: "Lídio dominante (Mixolídio #4 / Overtone)",
    formula: "1  2  3  #4  5  6  b7",
    intervals: [0, 2, 4, 6, 7, 9, 10],
    desc: "4º modo da menor melódica, também chamada escala Overtone. A escala mais usada sobre dominantes com #11 — mesmo conjunto de notas da escala Nordestina.",
  },
  {
    group: "Família da Escala Menor Melódica (Modos do Jazz)",
    id: "mixolidio-b6",
    name: "Mixolídio b6 (Hindu)",
    formula: "1  2  3  4  5  b6  b7",
    intervals: [0, 2, 4, 5, 7, 8, 10],
    desc: "5º modo da menor melódica. Mixolídio com a 6ª menor; usada sobre dominantes com b13.",
  },
  {
    group: "Família da Escala Menor Melódica (Modos do Jazz)",
    id: "locrio-2",
    name: "Lócrio #2 (meio-diminuto)",
    formula: "1  2  b3  4  b5  b6  b7",
    intervals: [0, 2, 3, 5, 6, 8, 10],
    desc: "6º modo da menor melódica. A escala clássica sobre acordes m7b5, muito comum em ii-V-i menores.",
  },
  {
    group: "Família da Escala Menor Melódica (Modos do Jazz)",
    id: "superlocrio",
    name: "Superlócrio (Escala Alterada)",
    formula: "1  b2  b3  3  b5  b6  b7",
    intervals: [0, 1, 3, 4, 6, 8, 10],
    desc: "7º modo da menor melódica, também chamada escala Alterada (ou Pomeroy). Usada sobre dominantes alterados (7alt), reúne as tensões b9, #9, #11 e b13.",
  },

  // ===== Família da Escala Menor Harmônica (Modos) =====
  {
    group: "Família da Escala Menor Harmônica (Modos)",
    id: "menor-harmonica",
    name: "Menor harmônica",
    formula: "1  2  b3  4  5  b6  7",
    intervals: [0, 2, 3, 5, 7, 8, 11],
    desc: "Menor natural com a 7ª elevada, criando tensão de dominante (V7) resolvendo pro tom menor. 2ª aumentada entre b6 e 7.",
  },
  {
    group: "Família da Escala Menor Harmônica (Modos)",
    id: "locrio-6",
    name: "Lócrio #6",
    formula: "1  b2  b3  4  b5  6  b7",
    intervals: [0, 1, 3, 5, 6, 9, 10],
    desc: "2º modo da menor harmônica. Lócrio com a 6ª maior, suaviza um pouco a tensão do Lócrio comum.",
  },
  {
    group: "Família da Escala Menor Harmônica (Modos)",
    id: "jonio-aumentado",
    name: "Jônio aumentado",
    formula: "1  2  3  4  #5  6  7",
    intervals: [0, 2, 4, 5, 8, 9, 11],
    desc: "3º modo da menor harmônica. Maior com a 5ª aumentada; usada sobre Maj7#5.",
  },
  {
    group: "Família da Escala Menor Harmônica (Modos)",
    id: "dorico-4",
    name: "Dórico #4 (Romena/Ucraniana)",
    formula: "1  2  b3  #4  5  6  b7",
    intervals: [0, 2, 3, 6, 7, 9, 10],
    desc: "4º modo da menor harmônica, também chamada escala Romena/Ucraniana. Comum na música do leste europeu e em jazz sobre m7 com #11.",
  },
  {
    group: "Família da Escala Menor Harmônica (Modos)",
    id: "frigio-dominante",
    name: "Frígio dominante (Ahava Raba)",
    formula: "1  b2  3  4  5  b6  b7",
    intervals: [0, 1, 4, 5, 7, 8, 10],
    desc: "5º modo da menor harmônica, também chamada Ahava Raba ou Mixolídia b2 b6. A escala árabe/flamenca/klezmer por excelência.",
  },
  {
    group: "Família da Escala Menor Harmônica (Modos)",
    id: "lidio-2",
    name: "Lídio #2",
    formula: "1  #2  3  #4  5  6  7",
    intervals: [0, 3, 4, 6, 7, 9, 11],
    desc: "6º modo da menor harmônica. Combina 3ª maior com 2ª aumentada; raramente usada como centro tonal.",
  },
  {
    group: "Família da Escala Menor Harmônica (Modos)",
    id: "ultralocrio",
    name: "Ultra-lócrio",
    formula: "1  b2  b3  3  b5  b6  bb7",
    intervals: [0, 1, 3, 4, 6, 8, 9],
    desc: "7º modo da menor harmônica, também chamada Superlócrio bb7. A mais dissonante de todas; uso quase exclusivamente teórico.",
  },

  // ===== Família das Pentatônicas e Blues =====
  {
    group: "Família das Pentatônicas e Blues",
    id: "penta-maior",
    name: "Pentatônica maior",
    formula: "1  2  3  5  6",
    intervals: [0, 2, 4, 7, 9],
    desc: "Escala maior sem a 4ª e a 7ª — evita as notas de maior tensão. Base de country, pop e improviso maior.",
  },
  {
    group: "Família das Pentatônicas e Blues",
    id: "penta-menor",
    name: "Pentatônica menor",
    formula: "1  b3  4  5  b7",
    intervals: [0, 3, 5, 7, 10],
    desc: "A escala mais usada em linhas de baixo de rock, funk e blues. Relativa menor da pentatônica maior.",
  },
  {
    group: "Família das Pentatônicas e Blues",
    id: "blues",
    name: "Blues (penta menor + blue note)",
    formula: "1  b3  4  b5  5  b7",
    intervals: [0, 3, 5, 6, 7, 10],
    desc: "Pentatônica menor + b5 ('blue note'), a nota de passagem clássica do blues, rock e funk.",
  },
  {
    group: "Família das Pentatônicas e Blues",
    id: "blues-maior",
    name: "Blues maior (penta maior + blue note)",
    formula: "1  2  b3  3  5  6",
    intervals: [0, 2, 3, 4, 7, 9],
    desc: "Pentatônica maior + blue note (b3), a versão 'maior' da escala blues — comum em country e blues alegre.",
  },
  {
    group: "Família das Pentatônicas e Blues",
    id: "penta-dorica",
    name: "Pentatônica dórica (menor com 6ª)",
    formula: "1  2  b3  5  6",
    intervals: [0, 2, 3, 7, 9],
    desc: "Pentatônica menor trocando a 4ª e a b7ª pela 2ª e a 6ª maior — colorido Dórico/jazzístico. Mesmo conjunto de notas da escala japonesa Kumoi.",
  },
  {
    group: "Família das Pentatônicas e Blues",
    id: "penta-frigia",
    name: "Pentatônica frígia",
    formula: "1  b2  4  5  b7",
    intervals: [0, 1, 5, 7, 10],
    desc: "Clima espanhol/flamenco em 5 notas. Mesmo conjunto de notas da escala japonesa In Sen.",
  },
  {
    group: "Família das Pentatônicas e Blues",
    id: "penta-mixolidia",
    name: "Pentatônica mixolídia (dominante)",
    formula: "1  2  3  5  b7",
    intervals: [0, 2, 4, 7, 10],
    desc: "Pentatônica maior com a 7ª menor no lugar da 6ª — a pentatônica clássica para tocar sobre acordes dominantes.",
  },
  {
    group: "Família das Pentatônicas e Blues",
    id: "penta-locria",
    name: "Pentatônica lócria",
    formula: "1  b3  4  b5  b7",
    intervals: [0, 3, 5, 6, 10],
    desc: "Redução em 5 notas do modo Lócrio, usada sobre acordes m7b5.",
  },
  {
    group: "Família das Pentatônicas e Blues",
    id: "penta-alterada",
    name: "Pentatônica alterada",
    formula: "1  b3  3  b5  b7",
    intervals: [0, 3, 4, 6, 10],
    desc: "Redução comum da escala Alterada/Superlócrio sobre dominantes alterados, reunindo a 3ª maior, a 3ª menor (como #9) e a 5ª diminuta.",
  },

  // ===== Escalas Simétricas e de Divisão Igual =====
  {
    group: "Escalas Simétricas e de Divisão Igual",
    id: "cromatica",
    name: "Cromática",
    formula: "1  b2  2  b3  3  4  #4  5  b6  6  b7  7",
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    desc: "Todas as 12 notas. Usada para notas de passagem e aproximações cromáticas entre acordes.",
  },
  {
    group: "Escalas Simétricas e de Divisão Igual",
    id: "tons-inteiros",
    name: "Tons inteiros (Escala de Debussy)",
    formula: "1  2  3  #4  #5  #6",
    intervals: [0, 2, 4, 6, 8, 10],
    desc: "Só tons inteiros, sem semitons — soa 'suspensa', sem sensação de tônica. Marca registrada de Debussy e do impressionismo.",
  },
  {
    group: "Escalas Simétricas e de Divisão Igual",
    id: "diminuta-tom-semitom",
    name: "Diminuta (tom/semitom)",
    formula: "1  2  b3  4  b5  b6  6  7",
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    desc: "8 notas alternando tom e semitom, começando pelo tom. Usada sobre acordes diminutos (dim7).",
  },
  {
    group: "Escalas Simétricas e de Divisão Igual",
    id: "dom-dim",
    name: "Dom-dim (semitom/tom)",
    formula: "1  b2  b3  3  #4  5  6  b7",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    desc: "A mesma escala diminuta começando pelo semitom. Usada sobre acordes dominantes com b9/#9/#11.",
  },
  {
    group: "Escalas Simétricas e de Divisão Igual",
    id: "blues-estendida",
    name: "Blues estendida (nonagrama)",
    formula: "1  2  b3  3  4  b5  5  6  b7",
    intervals: [0, 2, 3, 4, 5, 6, 7, 9, 10],
    desc: "União da escala blues maior com a blues menor em 9 notas — reúne praticamente todo o vocabulário do blues numa escala só.",
  },
  {
    group: "Escalas Simétricas e de Divisão Igual",
    id: "aumentada",
    name: "Aumentada (Symmetrical Augmented)",
    formula: "1  b3  3  5  #5  7",
    intervals: [0, 3, 4, 7, 8, 11],
    desc: "6 notas alternando 3ª menor e semitom, soa 'triádica aumentada'. Usada sobre acordes aumentados e Maj7#5.",
  },

  // ===== Escalas Bebop =====
  {
    group: "Escalas Bebop",
    id: "bebop-maior",
    name: "Bebop maior",
    formula: "1  2  3  4  5  b6  6  7",
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
    desc: "Escala maior + nota cromática de passagem entre a 5ª e a 6ª, pra que as notas do acorde caiam sempre nos tempos fortes.",
  },
  {
    group: "Escalas Bebop",
    id: "bebop-menor",
    name: "Bebop menor (Dórica)",
    formula: "1  2  b3  3  4  5  6  b7",
    intervals: [0, 2, 3, 4, 5, 7, 9, 10],
    desc: "Dórico + nota de passagem entre a 3ª menor e a 4ª. Muito usada sobre acordes m7.",
  },
  {
    group: "Escalas Bebop",
    id: "bebop-dominante",
    name: "Bebop dominante",
    formula: "1  2  3  4  5  6  b7  7",
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    desc: "Mixolídio + nota de passagem entre a b7ª e a tônica. A escala bebop mais usada, tocada sobre acordes dominantes.",
  },
  {
    group: "Escalas Bebop",
    id: "bebop-melodica-menor",
    name: "Bebop melódica menor",
    formula: "1  2  b3  4  5  b6  6  7",
    intervals: [0, 2, 3, 5, 7, 8, 9, 11],
    desc: "Menor melódica + nota de passagem entre a 5ª e a 6ª. Usada sobre acordes m/Maj7 e m6.",
  },

  // ===== Escalas Exóticas, Étnicas e Regionais =====
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "nordestina",
    name: "Nordestina",
    formula: "1  2  3  #4  5  6  b7",
    intervals: [0, 2, 4, 6, 7, 9, 10],
    desc: "Mesmo conjunto de notas do Lídio dominante (4º modo da menor melódica), associada ao forró/baião — a base de riffs como 'Asa Branca'.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "cigana-maior",
    name: "Cigana maior (Gypsy Major)",
    formula: "1  b2  3  4  5  b6  7",
    intervals: [0, 1, 4, 5, 7, 8, 11],
    desc: "Idêntica à escala Bizantina/Dupla Harmônica — mesmo conjunto de notas, usado em contextos ciganos e do leste europeu.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "cigana-menor",
    name: "Cigana menor (Menor Húngara)",
    formula: "1  2  b3  #4  5  b6  7",
    intervals: [0, 2, 3, 6, 7, 8, 11],
    desc: "Menor harmônica com a 4ª aumentada. O som característico da música cigana húngara/romena.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "bizantina",
    name: "Bizantina (Dupla Harmônica)",
    formula: "1  b2  3  4  5  b6  7",
    intervals: [0, 1, 4, 5, 7, 8, 11],
    desc: "Também chamada escala árabe ou Cigana Maior. Dois intervalos de 3ª aumentada (entre b2-3 e b6-7), som bem característico do oriente médio.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "persa",
    name: "Persa",
    formula: "1  b2  3  4  b5  b6  7",
    intervals: [0, 1, 4, 5, 6, 8, 11],
    desc: "3ª e 7ª maiores com 2ª, 5ª e 6ª rebaixadas — grande tensão, usada em música do oriente médio.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "napolitana-maior",
    name: "Napolitana maior",
    formula: "1  b2  b3  4  5  6  7",
    intervals: [0, 1, 3, 5, 7, 9, 11],
    desc: "Tetracorde frígio (com b2 e b3) seguido de um tetracorde maior.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "napolitana-menor",
    name: "Napolitana menor",
    formula: "1  b2  b3  4  5  b6  7",
    intervals: [0, 1, 3, 5, 7, 8, 11],
    desc: "Como a menor harmônica, mas com a 2ª também rebaixada.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "enigmatica",
    name: "Enigmática (de Verdi)",
    formula: "1  b2  3  #4  #5  #6  7",
    intervals: [0, 1, 4, 6, 8, 10, 11],
    desc: "Criada em 1888 e harmonizada por Verdi em sua Ave Maria. Uma das escalas mais dissonantes da tradição ocidental.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "hirajoshi",
    name: "Hirajoshi (Japão)",
    formula: "1  2  b3  5  b6",
    intervals: [0, 2, 3, 7, 8],
    desc: "Pentatônica japonesa clássica, usada no koto; soa melancólica.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "iwato",
    name: "Iwato (Japão)",
    formula: "1  b2  4  b5  b7",
    intervals: [0, 1, 5, 6, 10],
    desc: "Pentatônica japonesa de sonoridade tensa e escura.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "kumoi",
    name: "Kumoi (Japão)",
    formula: "1  2  b3  5  6",
    intervals: [0, 2, 3, 7, 9],
    desc: "Pentatônica japonesa usada na música para koto; mesmo conjunto de notas da pentatônica dórica ocidental.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "in-sen",
    name: "In Sen (Japão)",
    formula: "1  b2  4  5  b7",
    intervals: [0, 1, 5, 7, 10],
    desc: "Pentatônica japonesa tradicional; mesmo conjunto de notas da pentatônica frígia ocidental.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "pelog",
    name: "Pelog (Indonésia)",
    formula: "1  b2  b3  5  b6",
    intervals: [0, 1, 3, 7, 8],
    desc: "Aproximação ocidental (12 notas temperadas) da afinação pelog do gamelão javanês/balinês, que na prática usa uma afinação própria, fora do temperamento ocidental.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "slendro",
    name: "Slendro (Indonésia)",
    formula: "1  2  4  5  6",
    intervals: [0, 2, 5, 7, 9],
    desc: "Aproximação ocidental da afinação slendro do gamelão, cujas 5 notas são, na prática, quase igualmente espaçadas na oitava.",
  },
  {
    group: "Escalas Exóticas, Étnicas e Regionais",
    id: "pentatonica-chinesa",
    name: "Pentatônica chinesa",
    formula: "1  2  3  5  6",
    intervals: [0, 2, 4, 7, 9],
    desc: "As 5 notas Gong-Shang-Jue-Zhi-Yu da música tradicional chinesa. O modo Gong (mostrado aqui) tem as mesmas notas da pentatônica maior ocidental.",
  },
];

const GEOM = {
  marginLeft: 34,
  marginRight: 14,
  marginTop: 14,
  marginBottom: 22,
  fretWidth: 46,
  stringGap: 32,
};

function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildFretboardSVG(intervals, rootSemitone) {
  const w = GEOM.marginLeft + GEOM.marginRight + NUM_FRETS * GEOM.fretWidth;
  const h = GEOM.marginTop + GEOM.marginBottom + (STRINGS.length - 1) * GEOM.stringGap;
  const svg = svgEl("svg", {
    class: "fretboard-svg",
    viewBox: `0 0 ${w} ${h}`,
    role: "img",
    "aria-label": "Diagrama de escala no braço do contrabaixo",
  });

  const intervalSet = new Set(intervals);

  FRET_MARKERS.forEach((f) => {
    const x = GEOM.marginLeft + f * GEOM.fretWidth;
    const midY = GEOM.marginTop + ((STRINGS.length - 1) * GEOM.stringGap) / 2;
    if (DOUBLE_MARKER.includes(f)) {
      svg.appendChild(svgEl("circle", { cx: x, cy: midY - 8, r: 3, class: "fb-marker" }));
      svg.appendChild(svgEl("circle", { cx: x, cy: midY + 8, r: 3, class: "fb-marker" }));
    } else {
      svg.appendChild(svgEl("circle", { cx: x, cy: midY, r: 3, class: "fb-marker" }));
    }
  });

  for (let f = 0; f <= NUM_FRETS; f++) {
    const x = GEOM.marginLeft + f * GEOM.fretWidth;
    svg.appendChild(
      svgEl("line", {
        x1: x,
        y1: GEOM.marginTop,
        x2: x,
        y2: GEOM.marginTop + (STRINGS.length - 1) * GEOM.stringGap,
        class: f === 0 ? "fb-fret nut" : "fb-fret",
      })
    );
  }

  FRET_MARKERS.forEach((f) => {
    const x = GEOM.marginLeft + f * GEOM.fretWidth;
    const label = svgEl("text", {
      x,
      y: h - 6,
      class: "fb-fret-label",
      "text-anchor": "middle",
    });
    label.textContent = String(f);
    svg.appendChild(label);
  });

  STRINGS.forEach((s, i) => {
    const y = GEOM.marginTop + i * GEOM.stringGap;
    svg.appendChild(
      svgEl("line", {
        x1: GEOM.marginLeft,
        y1: y,
        x2: GEOM.marginLeft + NUM_FRETS * GEOM.fretWidth,
        y2: y,
        class: "fb-string",
      })
    );
    const label = svgEl("text", {
      x: GEOM.marginLeft - 10,
      y: y + 4,
      class: "fb-string-label",
      "text-anchor": "middle",
    });
    label.textContent = s.label;
    svg.appendChild(label);
  });

  STRINGS.forEach((s, i) => {
    const y = GEOM.marginTop + i * GEOM.stringGap;
    for (let f = 0; f <= NUM_FRETS; f++) {
      const note = (s.open + f) % 12;
      const interval = (note - rootSemitone + 12) % 12;
      if (!intervalSet.has(interval)) continue;
      const x = GEOM.marginLeft + f * GEOM.fretWidth;
      const isRoot = interval === 0;
      svg.appendChild(
        svgEl("circle", { cx: x, cy: y, r: 10, class: "fb-dot" + (isRoot ? " is-root" : "") })
      );
      const label = svgEl("text", { x, y: y + 3.5, class: "fb-dot-label" });
      label.textContent = NOTE_NAMES[note];
      svg.appendChild(label);
    }
  });

  return svg;
}

function scaleNoteNames(intervals, rootSemitone) {
  return intervals.map((iv) => ({
    name: NOTE_NAMES[(rootSemitone + iv) % 12],
    isRoot: iv === 0,
  }));
}

function render(rootSemitone) {
  const container = document.getElementById("scales-container");
  container.innerHTML = "";

  let lastGroup = null;
  SCALES.forEach((scale) => {
    if (scale.group !== lastGroup) {
      lastGroup = scale.group;
      const h = document.createElement("h2");
      h.className = "section-title";
      h.id = slugify(scale.group);
      h.textContent = scale.group;
      container.appendChild(h);
    }

    const card = document.createElement("section");
    card.className = "card scale-card";

    const head = document.createElement("div");
    head.className = "scale-card-head";
    head.innerHTML = `<span class="scale-name">${scale.name}</span><span class="scale-formula">${scale.formula}</span>`;
    card.appendChild(head);

    const desc = document.createElement("p");
    desc.className = "scale-desc";
    desc.textContent = scale.desc;
    card.appendChild(desc);

    const wrap = document.createElement("div");
    wrap.className = "fretboard-wrap";
    wrap.appendChild(buildFretboardSVG(scale.intervals, rootSemitone));
    card.appendChild(wrap);

    const notesWrap = document.createElement("div");
    notesWrap.className = "scale-notes";
    scaleNoteNames(scale.intervals, rootSemitone).forEach((n) => {
      const chip = document.createElement("span");
      chip.className = "note-chip" + (n.isRoot ? " is-root" : "");
      chip.textContent = n.name;
      notesWrap.appendChild(chip);
    });
    card.appendChild(notesWrap);

    container.appendChild(card);
  });
}

function buildFamilyNav() {
  const nav = document.getElementById("family-nav");
  if (!nav) return;
  const seen = new Set();
  SCALES.forEach((scale) => {
    if (seen.has(scale.group)) return;
    seen.add(scale.group);
    const a = document.createElement("a");
    a.className = "family-link";
    a.href = "#" + slugify(scale.group);
    a.textContent = scale.group;
    nav.appendChild(a);
  });
}

function initRootSelector() {
  const wrap = document.getElementById("root-select");
  let currentRoot = 4; // E, tônica padrão da 4ª corda solta

  NOTE_NAMES.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "root-btn" + (i === currentRoot ? " active" : "");
    btn.textContent = name;
    btn.addEventListener("click", () => {
      currentRoot = i;
      wrap.querySelectorAll(".root-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render(currentRoot);
    });
    wrap.appendChild(btn);
  });

  render(currentRoot);
}

document.addEventListener("DOMContentLoaded", () => {
  buildFamilyNav();
  initRootSelector();
  const printBtn = document.getElementById("btn-print");
  if (printBtn) printBtn.addEventListener("click", () => window.print());
});
