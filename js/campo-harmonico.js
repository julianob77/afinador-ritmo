/* Escala + Campo Harmônico Maior e Menor Naturais — mapa completo do braço (não é
   um shape móvel: cada tonalidade mostra a posição real de cada nota da escala,
   com a grafia correta de sustenidos/bemóis daquela tonalidade). */

const SEMITONE = {
  C: 0, "B#": 0,
  "C#": 1, Db: 1,
  D: 2,
  "D#": 3, Eb: 3,
  E: 4, Fb: 4,
  F: 5, "E#": 5,
  "F#": 6, Gb: 6,
  G: 7,
  "G#": 8, Ab: 8,
  A: 9,
  "A#": 10, Bb: 10,
  B: 11, Cb: 11,
};

function buildKeys(rawKeys, degreeQuality) {
  return rawKeys.map((k) => {
    const chords = k.notes.map((n, i) => n + degreeQuality[i]);
    const semitoneToLabel = {};
    k.notes.forEach((n) => {
      semitoneToLabel[SEMITONE[n]] = n;
    });
    return {
      ...k,
      chords,
      rootSemitone: SEMITONE[k.notes[0]],
      thirdSemitone: SEMITONE[k.notes[2]],
      scaleSet: new Set(k.notes.map((n) => SEMITONE[n])),
      semitoneToLabel,
    };
  });
}

const MODES = {
  major: {
    label: "MAIOR",
    formula: "Fórmula: T – T – ST – T – T – T – ST",
    fieldFormula: "Campo harmônico: I – ii – iii – IV – V – vi – vii°",
    roman: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
    keys: buildKeys(
      [
        { root: "C", notes: ["C", "D", "E", "F", "G", "A", "B"] },
        { root: "G", notes: ["G", "A", "B", "C", "D", "E", "F#"] },
        { root: "D", notes: ["D", "E", "F#", "G", "A", "B", "C#"] },
        { root: "A", notes: ["A", "B", "C#", "D", "E", "F#", "G#"] },
        { root: "E", notes: ["E", "F#", "G#", "A", "B", "C#", "D#"] },
        { root: "B", notes: ["B", "C#", "D#", "E", "F#", "G#", "A#"] },
        { root: "F", notes: ["F", "G", "A", "Bb", "C", "D", "E"] },
      ],
      ["", "m", "m", "", "", "m", "°"] // I ii iii IV V vi vii°
    ),
  },
  minor: {
    label: "MENOR",
    formula: "Fórmula: T – ST – T – T – ST – T – T",
    fieldFormula: "Campo harmônico: i – ii° – III – iv – v – VI – VII",
    roman: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
    keys: buildKeys(
      [
        { root: "A", notes: ["A", "B", "C", "D", "E", "F", "G"] },
        { root: "E", notes: ["E", "F#", "G", "A", "B", "C", "D"] },
        { root: "B", notes: ["B", "C#", "D", "E", "F#", "G", "A"] },
        { root: "D", notes: ["D", "E", "F", "G", "A", "Bb", "C"] },
        { root: "G", notes: ["G", "A", "Bb", "C", "D", "Eb", "F"] },
        { root: "C", notes: ["C", "D", "Eb", "F", "G", "Ab", "Bb"] },
        { root: "F", notes: ["F", "G", "Ab", "Bb", "C", "Db", "Eb"] },
      ],
      ["m", "°", "", "m", "m", "", ""] // i ii° III iv v VI VII
    ),
  },
};

// Cordas do grave pro agudo: E A D G. No diagrama exibimos de cima (aguda) pra baixo (grave).
const STRINGS = [
  { label: "G", open: 7 },
  { label: "D", open: 2 },
  { label: "A", open: 9 },
  { label: "E", open: 4 },
];

const NUM_FRETS = 15;
const FRET_MARKERS = [3, 5, 7, 9, 12, 15];
const DOUBLE_MARKER = [12];

const GEOM = {
  marginLeft: 30,
  marginRight: 12,
  marginTop: 14,
  marginBottom: 22,
  fretWidth: 40,
  stringGap: 32,
};

// Diagramas de acordes (digitação): mostram só as 3 notas do acorde (1ª-3ª-5ª),
// numa janela compacta de trastes ao redor da posição da fundamental na corda E.
const CHORD_WINDOW = 5; // trastes relativos (0..5) exibidos no diagrama
const CHORD_GEOM = {
  marginLeft: 22,
  marginRight: 10,
  marginTop: 14,
  marginBottom: 18,
  fretWidth: 30,
  stringGap: 24,
};

function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function buildFullNeckSVG(key, modeLabel) {
  const w = GEOM.marginLeft + GEOM.marginRight + NUM_FRETS * GEOM.fretWidth;
  const h = GEOM.marginTop + GEOM.marginBottom + (STRINGS.length - 1) * GEOM.stringGap;
  const svg = svgEl("svg", {
    class: "fretboard-svg",
    viewBox: `0 0 ${w} ${h}`,
    role: "img",
    "aria-label": `Mapa da escala de ${key.root} ${modeLabel} no braço do contrabaixo`,
  });

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
    const label = svgEl("text", { x, y: h - 6, class: "fb-fret-label", "text-anchor": "middle" });
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
      x: GEOM.marginLeft - 9,
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
      const semitone = (s.open + f) % 12;
      if (!key.scaleSet.has(semitone)) continue;
      const x = GEOM.marginLeft + f * GEOM.fretWidth;
      let role = "other";
      if (semitone === key.rootSemitone) role = "root";
      else if (semitone === key.thirdSemitone) role = "third";
      svg.appendChild(svgEl("circle", { cx: x, cy: y, r: 9.5, class: "fb-dot fb-dot-" + role }));
      const label = svgEl("text", { x, y: y + 3.5, class: "fb-dot-label" });
      label.textContent = key.semitoneToLabel[semitone];
      svg.appendChild(label);
    }
  });

  return svg;
}

// Diagrama compacto de um único acorde: só desenha as notas fundamental/3ª/5ª
// daquele acorde específico, numa janela de trastes ao redor da fundamental.
function buildChordDiagramSVG(key, chordIndex, chordName) {
  const rootNote = key.notes[chordIndex];
  const thirdNote = key.notes[(chordIndex + 2) % 7];
  const fifthNote = key.notes[(chordIndex + 4) % 7];
  const rootSemi = SEMITONE[rootNote];
  const thirdSemi = SEMITONE[thirdNote];
  const fifthSemi = SEMITONE[fifthNote];

  const eOpen = STRINGS[STRINGS.length - 1].open; // corda E (grave)
  const start = (rootSemi - eOpen + 12) % 12; // menor traste onde a fundamental cai na corda E

  const w = CHORD_GEOM.marginLeft + CHORD_GEOM.marginRight + CHORD_WINDOW * CHORD_GEOM.fretWidth;
  const h = CHORD_GEOM.marginTop + CHORD_GEOM.marginBottom + (STRINGS.length - 1) * CHORD_GEOM.stringGap;
  const svg = svgEl("svg", {
    class: "chord-svg",
    viewBox: `0 0 ${w} ${h}`,
    role: "img",
    "aria-label": `Digitação do acorde ${chordName} no braço do contrabaixo`,
  });

  for (let f = 0; f <= CHORD_WINDOW; f++) {
    const x = CHORD_GEOM.marginLeft + f * CHORD_GEOM.fretWidth;
    svg.appendChild(
      svgEl("line", {
        x1: x,
        y1: CHORD_GEOM.marginTop,
        x2: x,
        y2: CHORD_GEOM.marginTop + (STRINGS.length - 1) * CHORD_GEOM.stringGap,
        class: f === 0 && start === 0 ? "fb-fret nut" : "fb-fret",
      })
    );
  }

  if (start > 0) {
    const label = svgEl("text", {
      x: CHORD_GEOM.marginLeft - 6,
      y: h - 4,
      class: "chord-start-label",
      "text-anchor": "start",
    });
    label.textContent = start + "ª";
    svg.appendChild(label);
  }

  STRINGS.forEach((s, i) => {
    const y = CHORD_GEOM.marginTop + i * CHORD_GEOM.stringGap;
    svg.appendChild(
      svgEl("line", {
        x1: CHORD_GEOM.marginLeft,
        y1: y,
        x2: CHORD_GEOM.marginLeft + CHORD_WINDOW * CHORD_GEOM.fretWidth,
        y2: y,
        class: "fb-string",
      })
    );
    const label = svgEl("text", {
      x: CHORD_GEOM.marginLeft - 8,
      y: y + 3.5,
      class: "fb-string-label",
      "text-anchor": "middle",
    });
    label.textContent = s.label;
    svg.appendChild(label);
  });

  STRINGS.forEach((s, i) => {
    const y = CHORD_GEOM.marginTop + i * CHORD_GEOM.stringGap;
    for (let rel = 0; rel <= CHORD_WINDOW; rel++) {
      const f = start + rel;
      const semitone = (s.open + f) % 12;
      let role = null;
      if (semitone === rootSemi) role = "root";
      else if (semitone === thirdSemi) role = "third";
      else if (semitone === fifthSemi) role = "other"; // 5ª do acorde
      if (!role) continue;
      const x = CHORD_GEOM.marginLeft + rel * CHORD_GEOM.fretWidth;
      svg.appendChild(svgEl("circle", { cx: x, cy: y, r: 8.5, class: "fb-dot fb-dot-" + role }));
      const label = svgEl("text", { x, y: y + 3.2, class: "fb-dot-label chord-dot-label" });
      label.textContent = key.semitoneToLabel[semitone];
      svg.appendChild(label);
    }
  });

  return svg;
}

function render(modeKey) {
  const mode = MODES[modeKey];
  const container = document.getElementById("keys-container");
  container.innerHTML = "";

  mode.keys.forEach((key) => {
    const card = document.createElement("section");
    card.className = "card key-card";

    const row = document.createElement("div");
    row.className = "key-row";

    const badge = document.createElement("div");
    badge.className = "key-badge";
    badge.textContent = key.root + " " + mode.label;
    row.appendChild(badge);

    const wrap = document.createElement("div");
    wrap.className = "fretboard-wrap";
    wrap.appendChild(buildFullNeckSVG(key, mode.label.toLowerCase()));
    row.appendChild(wrap);

    card.appendChild(row);

    const field = document.createElement("div");
    field.className = "harmonic-field";
    key.chords.forEach((chord, i) => {
      const chip = document.createElement("span");
      chip.className = "chord-chip" + (i === 0 ? " is-root" : "");
      chip.innerHTML = `<span class="chord-roman">${mode.roman[i]}</span>${chord}`;
      field.appendChild(chip);
    });
    card.appendChild(field);

    const chordDiagramsTitle = document.createElement("p");
    chordDiagramsTitle.className = "chord-diagrams-title";
    chordDiagramsTitle.textContent = "Digitações dos acordes (tônica · 3ª · 5ª):";
    card.appendChild(chordDiagramsTitle);

    const chordDiagrams = document.createElement("div");
    chordDiagrams.className = "chord-diagrams";
    key.chords.forEach((chord, i) => {
      const item = document.createElement("div");
      item.className = "chord-diagram-item";

      const label = document.createElement("div");
      label.className = "chord-diagram-label";
      label.innerHTML = `<span class="chord-roman">${mode.roman[i]}</span>${chord}`;
      item.appendChild(label);

      item.appendChild(buildChordDiagramSVG(key, i, chord));
      chordDiagrams.appendChild(item);
    });
    card.appendChild(chordDiagrams);

    container.appendChild(card);
  });
}

function setMode(modeKey) {
  const mode = MODES[modeKey];
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.mode === modeKey);
  });
  const formulaEl = document.getElementById("formula-text");
  const fieldFormulaEl = document.getElementById("field-formula-text");
  const modeNameEl = document.getElementById("mode-name-text");
  if (formulaEl) formulaEl.textContent = mode.formula;
  if (fieldFormulaEl) fieldFormulaEl.textContent = mode.fieldFormula;
  if (modeNameEl) modeNameEl.textContent = mode.label.toLowerCase();
  render(modeKey);
}

document.addEventListener("DOMContentLoaded", () => {
  setMode("major");

  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });

  const printBtn = document.getElementById("btn-print");
  if (printBtn) printBtn.addEventListener("click", () => window.print());
});
