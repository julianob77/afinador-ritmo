/* Guia de estudo: Pentatônicas e Blues para contrabaixo de 4 cordas, afinação
   padrão E-A-D-G. Referência fixa em Lá (A) — para transpor, desloque todas as
   casas igualmente (ver instruções na página). Cada escala mostra 5 posições
   móveis, uma a partir de cada grau da pentatônica, no sistema "um dedo por
   casa" (+ eventual alongamento marcado com *) — mesmo espírito do guia de
   Modos Gregos deste app. Nas escalas de blues, a "blue note" extra aparece
   destacada em azul sempre que cair dentro da posição. */

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Exibição de cima (aguda) pra baixo (grave): G, D, A, E.
const STRINGS = [
  { label: "G", open: 7 },
  { label: "D", open: 2 },
  { label: "A", open: 9 },
  { label: "E", open: 4 },
];

const ROOT = 9; // Lá (A) — referência fixa do guia

const SCALES = [
  {
    id: "penta-maior",
    name: "Pentatônica maior",
    tokens: ["1", "2", "3", "5", "6"],
    intervals: [0, 2, 4, 7, 9],
    blueInterval: null,
    blueToken: null,
    desc: "Escala maior sem a 4ª e a 7ª — evita as notas de maior tensão entre os graus, por isso soa aberta e sem ambiguidade. Uso: linhas de baixo e improviso em country, pop e rock sobre acordes maiores; funciona bem em frases melódicas e preenchimentos (fills).",
  },
  {
    id: "penta-menor",
    name: "Pentatônica menor",
    tokens: ["1", "b3", "4", "5", "b7"],
    intervals: [0, 3, 5, 7, 10],
    blueInterval: null,
    blueToken: null,
    desc: "A escala mais usada em linhas de baixo de rock, funk, reggae e blues — relativa menor da pentatônica maior (mesmas notas, tônica diferente). Uso: base de riffs e groove sobre acordes menores, e também recurso melódico sobre dominantes.",
  },
  {
    id: "blues-menor",
    name: "Blues (pentatônica menor + blue note)",
    tokens: ["1", "b3", "4", "5", "b7"],
    intervals: [0, 3, 5, 7, 10],
    blueInterval: 6,
    blueToken: "b5",
    desc: "Pentatônica menor + b5 (a clássica 'blue note'), tocada como nota de passagem rápida entre o 4º e o 5º grau — quase nunca como nota longa. Uso: o som mais característico do blues, rock e funk, sobre acordes menores e também sobre dominantes.",
  },
  {
    id: "blues-maior",
    name: "Blues maior (pentatônica maior + blue note)",
    tokens: ["1", "2", "3", "5", "6"],
    intervals: [0, 2, 4, 7, 9],
    blueInterval: 3,
    blueToken: "b3",
    desc: "Pentatônica maior + blue note (b3), tocada em passagem rápida entre a 2ª e a 3ª maior. Uso: versão mais 'alegre' da escala blues — comum em country, blues tradicional, boogie e rock'n'roll.",
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

/* Uma "âncora" por grau da pentatônica: a casa em que aquele grau aparece na
   corda Mi (E), em ordem crescente pelo braço — cada posição começa numa nota
   diferente da escala na corda mais grave. */
function computeAnchors(scale) {
  const eOpen = STRINGS.find((s) => s.label === "E").open;
  const anchors = scale.intervals.map((iv, idx) => {
    const pc = (ROOT + iv) % 12;
    const fret = (((pc - eOpen) % 12) + 12) % 12;
    return { interval: iv, token: scale.tokens[idx], pc, fret, isRoot: iv === 0 };
  });
  anchors.sort((a, b) => a.fret - b.fret);
  return anchors;
}

/* Monta os dados de uma posição (caixa móvel) a partir da casa-âncora na corda
   Mi. Além dos graus da pentatônica, também marca a blue note (se houver)
   sempre que ela cair dentro da caixa de 5 casas. */
function buildPosition(anchor, scale) {
  const intervalMap = new Map();
  scale.intervals.forEach((iv, idx) => intervalMap.set(iv, scale.tokens[idx]));
  if (scale.blueInterval != null) intervalMap.set(scale.blueInterval, scale.blueToken);

  const baseFret = anchor.fret;
  const fingerBase = baseFret === 0 ? 1 : baseFret;
  const cells = [];
  let usesStretch = false;
  let usesOpen = false;
  let hasBlueNote = false;

  STRINGS.forEach((s) => {
    for (let c = 0; c <= 4; c++) {
      const fretAbs = baseFret + c;
      const note = (s.open + fretAbs) % 12;
      const iv = (((note - ROOT) % 12) + 12) % 12;
      if (!intervalMap.has(iv)) continue;

      const isBlue = scale.blueInterval != null && iv === scale.blueInterval;
      if (isBlue) hasBlueNote = true;

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
        isBlue,
        noteName: noteNameAt(note),
        token: intervalMap.get(iv),
      });
    }
  });

  return { baseFret, fingerBase, cells, usesStretch, usesOpen, hasBlueNote };
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

    const dotClass =
      "fb-dot" +
      (cell.isRoot ? " is-root" : "") +
      (cell.isBlue ? " is-blue" : "") +
      (cell.isOpen ? " is-open" : "");
    svg.appendChild(svgEl("circle", { cx: x, cy: y, r: 11, class: dotClass }));
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
    const degreeLabel = svgEl("text", { x, y: y + 22, class: "degree-label" + (cell.isBlue ? " is-blue" : "") });
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
  table.innerHTML = "<thead><tr><th>Escala</th><th>Graus</th><th>Notas em Lá</th></tr></thead>";
  const tbody = document.createElement("tbody");
  SCALES.forEach((scale) => {
    const allIntervals = scale.blueInterval != null
      ? [...scale.intervals, scale.blueInterval].sort((a, b) => a - b)
      : scale.intervals;
    const notes = allIntervals.map((iv) => noteNameAt(ROOT + iv)).join(" ");
    const tokens = allIntervals
      .map((iv) => (iv === scale.blueInterval ? scale.blueToken : scale.tokens[scale.intervals.indexOf(iv)]))
      .join(" ");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><a href="#${slugify(scale.name)}">${scale.name}</a></td><td class="mono">${tokens}</td><td class="mono">${notes}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

function buildScaleSection(scale) {
  const section = document.createElement("section");
  section.className = "mode-section";
  section.id = slugify(scale.name);

  const head = document.createElement("div");
  head.className = "mode-head";
  const notes = scale.intervals.map((iv) => noteNameAt(ROOT + iv)).join(" · ");
  const blueLine = scale.blueInterval != null
    ? ` &nbsp;|&nbsp; Blue note: ${scale.blueToken} (${noteNameAt(ROOT + scale.blueInterval)})`
    : "";
  head.innerHTML = `
    <h2>${scale.name}</h2>
    <p class="mode-formula mono">Graus: ${scale.tokens.join(" · ")} &nbsp;|&nbsp; Notas: ${notes}${blueLine}</p>
    <p class="mode-desc">${scale.desc}</p>
  `;
  section.appendChild(head);

  const grid = document.createElement("div");
  grid.className = "positions-grid";

  const anchors = computeAnchors(scale);
  anchors.forEach((anchor, idx) => {
    const pos = buildPosition(anchor, scale);
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

    if (pos.hasBlueNote) {
      const blueNote = document.createElement("p");
      blueNote.className = "position-blue-note";
      blueNote.textContent = `Blue note nesta posição: ${scale.blueToken} — use como nota de passagem rápida, não como nota longa.`;
      card.appendChild(blueNote);
    }

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

  const nav = document.getElementById("scale-nav");
  const container = document.getElementById("scales-container");
  SCALES.forEach((scale) => {
    if (nav) {
      const a = document.createElement("a");
      a.className = "family-link";
      a.href = "#" + slugify(scale.name);
      a.textContent = scale.name;
      nav.appendChild(a);
    }
    container.appendChild(buildScaleSection(scale));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  const printBtn = document.getElementById("btn-print");
  if (printBtn) printBtn.addEventListener("click", () => window.print());
});
