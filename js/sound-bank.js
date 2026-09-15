/* Percussion sounds synthesized in real time with the Web Audio API — no sample files needed. */

const SoundBank = (() => {
  let ctx = null;

  function init(audioContext) {
    ctx = audioContext;
  }

  function noiseBuffer(duration) {
    const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  function envGain(startTime, peak, attack, decay) {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + attack + decay);
    return gain;
  }

  function playTone(time, freq, peak, attack, decay, type) {
    const osc = ctx.createOscillator();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, time);
    const gain = envGain(time, peak, attack, decay);
    osc.connect(gain);
    return { node: osc, gain, stopAt: time + attack + decay + 0.02 };
  }

  function playNoise(time, peak, attack, decay, filterType, filterFreq, q) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(attack + decay + 0.05);
    const filter = ctx.createBiquadFilter();
    filter.type = filterType || "highpass";
    filter.frequency.setValueAtTime(filterFreq || 4000, time);
    if (q) filter.Q.setValueAtTime(q, time);
    const gain = envGain(time, peak, attack, decay);
    src.connect(filter).connect(gain);
    return { node: src, gain, stopAt: time + attack + decay + 0.05 };
  }

  const SOUNDS = {
    click: (time, vol) => {
      const { node, gain, stopAt } = playTone(time, 1800, vol, 0.001, 0.03, "square");
      node.connect(gain).connect(masterOut());
      node.start(time);
      node.stop(stopAt);
    },
    click_low: (time, vol) => {
      const { node, gain, stopAt } = playTone(time, 1200, vol * 0.85, 0.001, 0.03, "square");
      node.connect(gain).connect(masterOut());
      node.start(time);
      node.stop(stopAt);
    },
    kick: (time, vol) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
      const gain = envGain(time, vol, 0.001, 0.16);
      osc.connect(gain).connect(masterOut());
      osc.start(time);
      osc.stop(time + 0.2);
    },
    surdo: (time, vol) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, time);
      osc.frequency.exponentialRampToValueAtTime(60, time + 0.2);
      const gain = envGain(time, vol, 0.002, 0.22);
      osc.connect(gain).connect(masterOut());
      osc.start(time);
      osc.stop(time + 0.26);
    },
    snare: (time, vol) => {
      const { node, gain, stopAt } = playNoise(time, vol, 0.001, 0.12, "highpass", 1800, 0.7);
      node.connect(gain).connect(masterOut());
      node.start(time);
      node.stop(stopAt);
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, time);
      const g2 = envGain(time, vol * 0.4, 0.001, 0.06);
      osc.connect(g2).connect(masterOut());
      osc.start(time);
      osc.stop(time + 0.08);
    },
    rim: (time, vol) => {
      const { node, gain, stopAt } = playTone(time, 900, vol * 0.8, 0.001, 0.02, "square");
      node.connect(gain).connect(masterOut());
      node.start(time);
      node.stop(stopAt);
    },
    tamborim: (time, vol) => {
      const { node, gain, stopAt } = playNoise(time, vol, 0.001, 0.05, "bandpass", 3200, 2.5);
      node.connect(gain).connect(masterOut());
      node.start(time);
      node.stop(stopAt);
    },
    hihat: (time, vol) => {
      const { node, gain, stopAt } = playNoise(time, vol * 0.7, 0.001, 0.035, "highpass", 7000, 0.5);
      node.connect(gain).connect(masterOut());
      node.start(time);
      node.stop(stopAt);
    },
    hihat_open: (time, vol) => {
      const { node, gain, stopAt } = playNoise(time, vol * 0.6, 0.001, 0.14, "highpass", 6000, 0.5);
      node.connect(gain).connect(masterOut());
      node.start(time);
      node.stop(stopAt);
    },
    shaker: (time, vol) => {
      const { node, gain, stopAt } = playNoise(time, vol * 0.55, 0.001, 0.06, "bandpass", 6000, 1.2);
      node.connect(gain).connect(masterOut());
      node.start(time);
      node.stop(stopAt);
    },
    clave: (time, vol) => {
      const { node, gain, stopAt } = playTone(time, 2500, vol * 0.9, 0.001, 0.045, "square");
      node.connect(gain).connect(masterOut());
      node.start(time);
      node.stop(stopAt);
    },
    conga: (time, vol) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(260, time);
      osc.frequency.exponentialRampToValueAtTime(180, time + 0.09);
      const gain = envGain(time, vol * 0.8, 0.002, 0.1);
      osc.connect(gain).connect(masterOut());
      osc.start(time);
      osc.stop(time + 0.14);
    },
  };

  let master = null;
  function masterOut() {
    if (!master) {
      master = ctx.createGain();
      master.gain.value = 1;
      master.connect(ctx.destination);
    }
    return master;
  }

  let masterVolume = 0.8;
  function setVolume(v) {
    masterVolume = v;
    if (master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.01);
  }

  function play(soundName, time, vol) {
    const fn = SOUNDS[soundName];
    if (!fn) return;
    fn(time, vol == null ? 1 : vol);
  }

  return { init, play, setVolume, get masterVolume() { return masterVolume; } };
})();
