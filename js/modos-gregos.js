/* Guia de estudo: os 7 Modos Gregos para contrabaixo de 4 cordas, afinação padrão E-A-D-G.
   Referência fixa em Lá (A) — para transpor, desloque todas as casas igualmente
   (ver instruções na página). Cada modo mostra 7 posições móveis, uma a partir
   de cada grau da escala, no sistema "um dedo por casa" (+ eventual alongamento
   marcado com *), no mesmo espírito do guia de pentatônicas/blues impresso. */

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_PT = {
  "C": "Dó", "C#": "Dó#", "D": "Ré", "D#": "Ré#", "E": "Mi", "F": "Fá",
  "F#": "Fá#", "G": "Sol", "G#": "Sol#", "A": "Lá", "A#": "Lá#", "B": "Si",
};

// Exibição de cima (aguda) pra baixo (grave): G, D, A, E.
const STRINGS = [
  { label: "G", open: 7 },
  { label: "D", open: 2 },
  { label: "A", open: 9 },
  { label: "E", open: 4 },
];

const ROOT = 9; // Lá (A) — referência fixa do guia

const MODES = [
  {
    id: "jonio",
    name: "Jônio (Maior)",
    tokens: ["1", "2", "3", "4", "5", "6", "7"],
    intervals: [0, 2, 4, 5, 7, 9, 11],
    desc: "A escala mãe da harmonia tonal. Soa estável e resolutiva; combina com acordes maiores com 7ª maior (Maj7).",
  },
  {
    id: "dorico",
    name: "Dórico",
    tokens: ["1", "2", "b3", "4", "5", "6", "b7"],
    intervals: [0, 2, 3, 5, 7, 9, 10],
    desc: "Menor com 6ª maior. Muito usado em funk, jazz e fusion sobre acordes m7.",
  },
  {
    id: "frigio",
    name: "Frígio",
    tokens: ["1", "b2", "b3", "4", "5", "b6", "b7"],
    intervals: [0, 1, 3, 5, 7, 8, 10],
    desc: "Menor com 2ª menor, clima espanhol/flamenco. Funciona sobre m7 e também sobre acordes dominantes com b9.",
  },
  {
    id: "lidio",
    name: "Lídio",
    tokens: ["1", "2", "3", "#4", "5", "6", "7"],
    intervals: [0, 2, 4, 6, 7, 9, 11],
    desc: "Maior com 4ª aumentada. Som aberto/etéreo; combina com Maj7#11.",
  },
  {
    id: "mixolidio",
    name: "Mixolídio",
    tokens: ["1", "2", "3", "4", "5", "6", "b7"],
    intervals: [0, 2, 4, 5, 7, 9, 10],
    desc: "Maior com 7ª menor. A escala clássica para acordes dominantes (7), muito usada em blues, funk e rock.",
  },
  {
    id: "eolio",
    name: "Eólio (menor natural)",
    tokens: ["1", "2", "b3", "4", "5", "b6", "b7"],
    intervals: [0, 2, 3, 5, 7, 8, 10],
    desc: "A escala menor natural. Relativa menor da escala maior; base do rock e pop em tonalidade menor.",
  },
  {
    id: "locrio",
    name: "Lócrio",
    tokens: ["1", "b2", "b3", "4", "b5", "b6", "b7"],
    intervals: [0, 1, 3, 5, 6, 8, 10],
    desc: "Único modo com 5ª diminuta. Usado sobre acordes m7b5 (semidiminutos), raro como centro tonal.",
  },
];

function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function noteNameAt(semitone) {
  return NOTE_NAMES[((semitone % 12) + 12) % 12];
}

/* Uma "âncora" por grau da escala: a casa em que aquele grau aparece na corda
   Mi (E), em ordem crescente pelo braço — mesma lógica do guia original, em
   que cada posição começa numa nota diferente da escala na corda mais grave. */
function computeAnchors(mode) {
  const eOpen = STRINGS.find((s) => s.label === "E").open;
  const anchors = mode.intervals.map((iv, idx) => {
    const pc = (ROOT + iv) % 12;
    const fret = (((pc - eOpen) % 12) + 12) % 12;
    return { interval: iv, token: mode.tokens[idx], pc, fret, isRoot: iv === 0 };
  });
  anchors.sort((a, b) => a.fret - b.fret);
  return anchors;
}

/* Monta os dados de uma posição (caixa móvel) a partir da casa-âncora na corda Mi. */
function buildPosition(anchor, mode) {
  const intervalMap = new Map();
  mode.intervals.forEach((iv, idx) => intervalMap.set(iv, mode.tokens[idx]));

  const baseFret = anchor.fret;
  const fingerBase = baseFret === 0 ? 1 : baseFret;
  const cells = [];
  let usesStretch = false;
  let usesOpen = false;

  STRINGS.forEach((s) => {
    for (let c = 0; c <= 4; c++) {
      const fretAbs = baseFret + c;
      const note = (s.open + fretAbs) % 12;
      const iv = ((note - ROOT) % 12 + 12) % 12;
      if (!intervalMap.has(iv)) continue;

      let finger, isOpen = false, stretch = false;
      if (fretAbs === 0) {
        finger = 0;
        isOpen = true;
        usesOpen = true;
      } else {
        const offset = fretAbs - fingerBase;
        finger = offset <= 3 ? offset + 1 : 4;
        stretch = offset === 4;
        if (stretch) usesStretch = true;
      }

      cells.push({
        string: s.label,
        col: c,
        fretAbs,
        finger,
        isOpen,
        stretch,
        isRoot: iv === 0,
        noteName: noteNameAt(note),
        token: intervalMap.get(iv),
      });
    }
  });

  return { baseFret, fingerBase, cells, usesStretch, usesOpen };
}

const GEOM = {
  marginLeft: 32,
  marginRight: 22,
  marginTop: 26,
  marginBottom: 24,
  fretWidth: 68,
  stringGap: 38,
};

function buildPositionSVG(pos) {
  const cols = 5;
  const w = GEOM.marginLeft + GEOM.marginRight + (cols - 1) * GEOM.fretWidth;
  const h = GEOM.marginTop + GEOM.marginBottom + (STRINGS.length - 1) * GEOM.stringGap;
  const svg = svgEl("svg", {
    class: "pos-svg",
    viewBox: `0 0 ${w} ${h}`,
    role: "img",
    "aria-label": "Diagrama de posição no braço do contrabaixo",
  });

  // linhas de trastes (verticais)
  for (let c = 0; c < cols; c++) {
    const x = GEOM.marginLeft + c * GEOM.fretWidth;
    const isNut = pos.baseFret === 0 && c === 0;
    svg.appendChild(
      svgEl("line", {
        x1: x, y1: GEOM.marginTop, x2: x,
        y2: GEOM.marginTop + (STRINGS.length - 1) * GEOM.stringGap,
        class: isNut ? "fb-fret nut" : "fb-fret",
      })
    );
    const label = svgEl("text", { x, y: h - 6, class: "fb-fret-label", "text-anchor": "middle" });
    label.textContent = String(pos.baseFret + c);
    svg.appendChild(label);
  }

  // cordas (horizontais)
  STRINGS.forEach((s, i) => {
    const y = GEOM.marginTop + i * GEOM.stringGap;
    svg.appendChild(
      svgEl("line", {
        x1: GEOM.marginLeft, y1: y,
        x2: GEOM.marginLeft + (cols - 1) * GEOM.fretWidth, y2: y,
        class: "fb-string",
      })
    );
    const label = svgEl("text", { x: GEOM.marginLeft - 12, y: y + 4, class: "fb-string-label", "text-anchor": "middle" });
    label.textContent = s.label;
    svg.appendChild(label);
  });

  // notas marcadas
  pos.cells.forEach((cell) => {
    const stringIdx = STRINGS.findIndex((s) => s.label === cell.string);
    const x = GEOM.marginLeft + cell.col * GEOM.fretWidth;
    const y = GEOM.marginTop + stringIdx * GEOM.stringGap;

    svg.appendChild(
      svgEl("circle", { cx: x, cy: y, r: 11, class: "fb-dot" + (cell.isRoot ? " is-root" : "") + (cell.isOpen ? " is-open" : "") })
    );
    const noteLabel = svgEl("text", { x, y: y + 3.5, class: "fb-dot-label" });
    noteLabel.textContent = cell.noteName;
    svg.appendChild(noteLabel);

    // dedo (badge acima-direita do ponto)
    const fx = x + 13, fy = y - 13;
    svg.appendChild(svgEl("circle", { cx: fx, cy: fy, r: 8, class: "finger-badge" }));
    const fingerLabel = svgEl("text", { x: fx, y: fy + 3, class: "finger-badge-label" });
    fingerLabel.textContent = cell.isOpen ? "0" : String(cell.finger) + (cell.stretch ? "*" : "");
    svg.appendChild(fingerLabel);

    // grau (abaixo do ponto)
    const degreeLabel = svgEl("text", { x, y: y + 22, class: "degree-label" });
    degreeLabel.textContent = cell.isRoot ? "T" : cell.token;
    svg.appendChild(degreeLabel);
  });

  return svg;
}

function slugify(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildOverviewTable() {
  const table = document.createElement("table");
  table.className = "overview-table";
  table.innerHTML = "<thead><tr><th>Modo</th><th>Graus</th><th>Notas em Lá</th></tr></thead>";
  const tbody = document.createElement("tbody");
  MODES.forEach((mode) => {
    const notes = mode.intervals.map((iv) => noteNameAt(ROOT + iv)).join(" ");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><a href="#${slugify(mode.name)}">${mode.name}</a></td><td class="mono">${mode.tokens.join(" ")}</td><td class="mono">${notes}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

function buildModeSection(mode) {
  const section = document.createElement("section");
  section.className = "mode-section";
  section.id = slugify(mode.name);

  const head = document.createElement("div");
  head.className = "mode-head";
  const notes = mode.intervals.map((iv) => noteNameAt(ROOT + iv)).join(" · ");
  head.innerHTML = `
    <h2>${mode.name}</h2>
    <p class="mode-formula mono">Graus: ${mode.tokens.join(" · ")} &nbsp;|&nbsp; Notas: ${notes}</p>
    <p class="mode-desc">${mode.desc}</p>
  `;
  section.appendChild(head);

  const grid = document.createElement("div");
  grid.className = "positions-grid";

  const anchors = computeAnchors(mode);
  anchors.forEach((anchor, idx) => {
    const pos = buildPosition(anchor, mode);
    const card = document.createElement("div");
    card.className = "card position-card";

    const title = document.createElement("div");
    title.className = "position-title";
    const rootTag = anchor.isRoot ? " · tônica" : "";
    title.innerHTML = `<span>Posição ${idx + 1}</span><span class="position-anchor">1ª nota na Mi: ${noteNameAt(anchor.pc)}${rootTag}</span>`;
    card.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "position-meta";
    if (pos.baseFret === 0) {
      meta.textContent = `Casas usadas: solta a 4 · Base: corda solta + dedo 1 na casa 1`;
    } else {
      meta.textContent = `Casas usadas: ${pos.baseFret} a ${pos.baseFret + 3} · Base: dedo 1 na casa ${pos.fingerBase}`;
    }
    card.appendChild(meta);

    if (pos.usesStretch) {
      const stretchNote = document.createElement("p");
      stretchNote.className = "position-stretch";
      stretchNote.textContent = `4*: avance uma casa até a ${pos.baseFret + 4} com o dedo 4; retorne à base ao mudar de corda.`;
      card.appendChild(stretchNote);
    }

    const wrap = document.createElement("div");
    wrap.className = "pos-wrap";
    wrap.appendChild(buildPositionSVG(pos));
    card.appendChild(wrap);

    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

function render() {
  const overviewSlot = document.getElementById("overview-table-slot");
  if (overviewSlot) overviewSlot.appendChild(buildOverviewTable());

  const nav = document.getElementById("mode-nav");
  const container = document.getElementById("modes-container");
  MODES.forEach((mode) => {
    if (nav) {
      const a = document.createElement("a");
      a.className = "family-link";
      a.href = "#" + slugify(mode.name);
      a.textContent = mode.name;
      nav.appendChild(a);
    }
    container.appendChild(buildModeSection(mode));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  const printBtn = document.getElementById("btn-print");
  if (printBtn) printBtn.addEventListener("click", () => window.print());
});
