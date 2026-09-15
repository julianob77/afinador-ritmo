/* App bootstrap: owns state, wires DOM events to the engine modules. */

(() => {
  const STORAGE_KEY = "afinador-ritmo-settings";

  const state = {
    bpm: 90,
    rhythmId: "simple",
    timeSigBeats: 4,
    playing: false,
    micActive: false,
    a4: 440,
    volume: 0.8,
    darkTheme: true,
  };

  let audioCtx = null;

  const TIME_SIGS = [
    { value: 2, label: "2/4" },
    { value: 3, label: "3/4" },
    { value: 4, label: "4/4" },
    { value: 5, label: "5/4" },
    { value: 6, label: "6/4" },
    { value: 7, label: "7/4" },
  ];

  function ensureAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      SoundBank.init(audioCtx);
      SoundBank.setVolume(state.volume);
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function currentPattern() {
    const base = RhythmPatterns.get(state.rhythmId);
    return RhythmPatterns.withTimeSignature(base, state.timeSigBeats);
  }

  function refreshRhythmUI() {
    const pattern = currentPattern();
    UI.setTimeSigEnabled(!!pattern.editableTimeSig);
    const accents = RhythmPatterns.beatAccents(pattern.beatsPerBar, pattern.subdivision);
    UI.renderBeatDots(pattern.steps.length, accents);
    if (state.playing) {
      MetronomeEngine.setPattern(pattern);
    }
  }

  function selectRhythm(id) {
    state.rhythmId = id;
    UI.renderRhythmChips(RhythmPatterns.LIST, state.rhythmId, selectRhythm);
    refreshRhythmUI();
  }

  function handleStep(stepIndex) {
    UI.litBeatDot(stepIndex);
  }

  function togglePlay() {
    const ctx = ensureAudioContext();
    if (state.playing) {
      MetronomeEngine.stop();
      state.playing = false;
      UI.clearBeatDots();
    } else {
      const pattern = currentPattern();
      MetronomeEngine.start(ctx, pattern, state.bpm, handleStep);
      state.playing = true;
    }
    UI.setPlayButton(state.playing);
  }

  function setBpm(value) {
    state.bpm = Math.max(30, Math.min(300, Math.round(value)));
    UI.setBpm(state.bpm);
    MetronomeEngine.setBpm(state.bpm);
  }

  let tapTimes = [];
  function handleTap() {
    const now = performance.now();
    tapTimes = tapTimes.filter((t) => now - t < 2000);
    tapTimes.push(now);
    if (tapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimes.length; i++) intervals.push(tapTimes[i] - tapTimes[i - 1]);
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      setBpm(Math.round(60000 / avgMs));
    }
  }

  async function toggleMic() {
    if (state.micActive) {
      PitchDetector.stop();
      state.micActive = false;
      UI.setMicButton(false);
      UI.setTunerStatus('Toque em "Ativar microfone" para começar');
      UI.updateTuner(null);
      return;
    }
    try {
      const ctx = ensureAudioContext();
      UI.setTunerStatus("Solicitando acesso ao microfone…");
      await PitchDetector.start(ctx, (result) => {
        if (result) {
          UI.setTunerStatus("Escutando…");
          UI.updateTuner(result);
        } else {
          UI.setTunerStatus("Toque uma nota…");
          UI.updateTuner(null);
        }
      });
      state.micActive = true;
      UI.setMicButton(true);
    } catch (err) {
      UI.setTunerStatus("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
      console.error("Microphone access failed", err);
    }
  }

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (saved.a4) state.a4 = saved.a4;
      if (saved.darkTheme != null) state.darkTheme = saved.darkTheme;
      if (saved.volume != null) state.volume = saved.volume;
    } catch (e) {
      /* ignore malformed/blocked storage */
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ a4: state.a4, darkTheme: state.darkTheme, volume: state.volume })
      );
    } catch (e) {
      /* private browsing / storage blocked */
    }
  }

  function init() {
    loadSettings();

    UI.buildMeterTicks();
    UI.applyTheme(state.darkTheme);
    document.getElementById("theme-toggle").checked = state.darkTheme;
    document.getElementById("a4-input").value = state.a4;
    UI.el.volumeSlider.value = state.volume;
    PitchDetector.setA4(state.a4);

    UI.populateTimeSignatures(TIME_SIGS, state.timeSigBeats);
    UI.renderRhythmChips(RhythmPatterns.LIST, state.rhythmId, selectRhythm);
    refreshRhythmUI();
    UI.setBpm(state.bpm);
    UI.setPlayButton(false);
    UI.setMicButton(false);
    UI.updateTuner(null);

    UI.el.btnPlay.addEventListener("click", togglePlay);
    UI.el.btnMic.addEventListener("click", toggleMic);
    document.getElementById("btn-bpm-minus").addEventListener("click", () => setBpm(state.bpm - 1));
    document.getElementById("btn-bpm-plus").addEventListener("click", () => setBpm(state.bpm + 1));
    UI.el.bpmSlider.addEventListener("input", (e) => setBpm(Number(e.target.value)));
    document.getElementById("btn-tap").addEventListener("click", handleTap);
    UI.el.timeSigSelect.addEventListener("change", (e) => {
      state.timeSigBeats = Number(e.target.value);
      refreshRhythmUI();
    });
    UI.el.volumeSlider.addEventListener("input", (e) => {
      state.volume = Number(e.target.value);
      if (audioCtx) SoundBank.setVolume(state.volume);
      saveSettings();
    });

    document.getElementById("btn-settings").addEventListener("click", () => UI.toggleSettings(true));
    document.getElementById("btn-close-settings").addEventListener("click", () => UI.toggleSettings(false));
    document.getElementById("sheet-backdrop").addEventListener("click", () => UI.toggleSettings(false));
    document.getElementById("a4-input").addEventListener("change", (e) => {
      const val = Number(e.target.value);
      if (val >= 410 && val <= 470) {
        state.a4 = val;
        PitchDetector.setA4(val);
        saveSettings();
      }
    });
    document.getElementById("theme-toggle").addEventListener("change", (e) => {
      state.darkTheme = e.target.checked;
      UI.applyTheme(state.darkTheme);
      saveSettings();
    });

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").catch(() => {});
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
