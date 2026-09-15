/* Pure DOM rendering helpers. No state lives here — app.js owns state and calls these. */

const UI = (() => {
  const el = {
    tunerStatus: document.getElementById("tuner-status"),
    noteName: document.getElementById("note-name"),
    noteOctave: document.getElementById("note-octave"),
    freqReadout: document.getElementById("freq-readout"),
    needle: document.getElementById("meter-needle"),
    meterTicks: document.getElementById("meter-ticks"),
    btnMic: document.getElementById("btn-mic"),
    bpmValue: document.getElementById("bpm-value"),
    bpmSlider: document.getElementById("bpm-slider"),
    timeSigSelect: document.getElementById("time-sig-select"),
    beatIndicator: document.getElementById("beat-indicator"),
    rhythmSelect: document.getElementById("rhythm-select"),
    btnPlay: document.getElementById("btn-play"),
    volumeSlider: document.getElementById("volume-slider"),
  };

  const CENTER = { x: 150, y: 150 };
  const MAX_CENTS = 50;
  const MAX_ANGLE = 48; // degrees of needle sweep to either side

  function buildMeterTicks() {
    const marks = [-50, -37.5, -25, -12.5, 0, 12.5, 25, 37.5, 50];
    const html = marks
      .map((cents) => {
        const angle = (cents / MAX_CENTS) * MAX_ANGLE;
        const rad = (angle * Math.PI) / 180;
        const isCenter = cents === 0;
        const rOuter = 128;
        const rInner = isCenter ? 108 : 116;
        const x1 = CENTER.x + rInner * Math.sin(rad);
        const y1 = CENTER.y - rInner * Math.cos(rad);
        const x2 = CENTER.x + rOuter * Math.sin(rad);
        const y2 = CENTER.y - rOuter * Math.cos(rad);
        const cls = isCenter ? "meter-tick center" : "meter-tick";
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="${cls}" />`;
      })
      .join("");
    el.meterTicks.innerHTML = html;
  }

  function updateTuner(result) {
    if (!result) {
      el.noteName.textContent = "—";
      el.noteName.className = "note-name";
      el.noteOctave.textContent = "";
      el.freqReadout.textContent = "0.0 Hz";
      setNeedle(0, false);
      return;
    }
    const { note, octave, cents, frequency } = result;
    el.noteName.textContent = note;
    el.noteOctave.textContent = octave;
    el.freqReadout.textContent = `${frequency.toFixed(1)} Hz`;

    const clamped = Math.max(-MAX_CENTS, Math.min(MAX_CENTS, cents));
    const inTune = Math.abs(cents) <= 5;
    const close = Math.abs(cents) <= 15;
    el.noteName.className = "note-name" + (inTune ? " in-tune" : close ? " close" : "");
    setNeedle(clamped, inTune, close);
  }

  function setNeedle(cents, inTune, close) {
    const angle = (cents / MAX_CENTS) * MAX_ANGLE;
    el.needle.style.transform = `rotate(${angle}deg)`;
    el.needle.setAttribute("class", "meter-needle" + (inTune ? " in-tune" : close ? " close" : ""));
  }

  function setTunerStatus(text) {
    el.tunerStatus.textContent = text;
  }

  function setMicButton(active) {
    el.btnMic.textContent = active ? "🎤 Microfone ativo" : "🎤 Ativar microfone";
    el.btnMic.classList.toggle("is-active", active);
  }

  function setBpm(bpm) {
    el.bpmValue.textContent = bpm;
    el.bpmSlider.value = bpm;
  }

  function populateTimeSignatures(options, selected) {
    el.timeSigSelect.innerHTML = options
      .map((o) => `<option value="${o.value}" ${o.value === selected ? "selected" : ""}>${o.label}</option>`)
      .join("");
  }

  function setTimeSigEnabled(enabled) {
    el.timeSigSelect.disabled = !enabled;
    el.timeSigSelect.style.opacity = enabled ? "1" : "0.5";
  }

  function renderRhythmChips(list, activeId, onSelect) {
    el.rhythmSelect.innerHTML = list
      .map((r) => `<button class="rhythm-chip${r.id === activeId ? " active" : ""}" data-id="${r.id}">${r.name}</button>`)
      .join("");
    el.rhythmSelect.querySelectorAll(".rhythm-chip").forEach((btn) => {
      btn.addEventListener("click", () => onSelect(btn.dataset.id));
    });
  }

  function renderBeatDots(totalSteps, accentSteps) {
    el.beatIndicator.innerHTML = Array.from({ length: totalSteps }, (_, i) => {
      const isAccent = accentSteps.includes(i);
      return `<span class="beat-dot${isAccent ? " accent" : ""}" data-step="${i}"></span>`;
    }).join("");
  }

  function litBeatDot(stepIndex) {
    el.beatIndicator.querySelectorAll(".beat-dot").forEach((dot) => {
      dot.classList.toggle("lit", Number(dot.dataset.step) === stepIndex);
    });
  }

  function clearBeatDots() {
    el.beatIndicator.querySelectorAll(".beat-dot").forEach((dot) => dot.classList.remove("lit"));
  }

  function setPlayButton(playing) {
    el.btnPlay.textContent = playing ? "■ Parar" : "▶ Tocar";
    el.btnPlay.classList.toggle("is-active", playing);
  }

  function applyTheme(dark) {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  function toggleSettings(show) {
    document.getElementById("settings-sheet").hidden = !show;
  }

  return {
    el,
    buildMeterTicks,
    updateTuner,
    setTunerStatus,
    setMicButton,
    setBpm,
    populateTimeSignatures,
    setTimeSigEnabled,
    renderRhythmChips,
    renderBeatDots,
    litBeatDot,
    clearBeatDots,
    setPlayButton,
    applyTheme,
    toggleSettings,
  };
})();
