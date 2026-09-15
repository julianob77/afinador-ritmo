/* Precise audio-clock scheduler ("lookahead scheduling" pattern) so the beat
 * never drifts, even if the tab is backgrounded or the main thread stalls briefly. */

const MetronomeEngine = (() => {
  const SCHEDULE_AHEAD_SEC = 0.1;
  const LOOKAHEAD_MS = 25;

  let audioCtx = null;
  let timerId = null;
  let currentStep = 0;
  let nextStepTime = 0;
  let bpm = 90;
  let pattern = null;
  let playing = false;
  let onStep = null;

  function stepDuration() {
    return 60 / bpm / pattern.subdivision;
  }

  function scheduler() {
    while (nextStepTime < audioCtx.currentTime + SCHEDULE_AHEAD_SEC) {
      scheduleStep(currentStep, nextStepTime);
      nextStepTime += stepDuration();
      currentStep = (currentStep + 1) % pattern.steps.length;
    }
  }

  function scheduleStep(stepIndex, time) {
    const hits = pattern.steps[stepIndex] || [];
    for (const hit of hits) {
      SoundBank.play(hit.sound, time, hit.vol);
    }
    if (onStep) {
      const delayMs = Math.max(0, (time - audioCtx.currentTime) * 1000);
      setTimeout(() => {
        if (playing) onStep(stepIndex, pattern.steps.length);
      }, delayMs);
    }
  }

  function start(ctx, ptn, bpmValue, stepCallback) {
    audioCtx = ctx;
    pattern = ptn;
    bpm = bpmValue;
    onStep = stepCallback;
    currentStep = 0;
    nextStepTime = audioCtx.currentTime + 0.05;
    playing = true;
    timerId = setInterval(scheduler, LOOKAHEAD_MS);
  }

  function stop() {
    playing = false;
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function setBpm(value) {
    bpm = value;
  }

  function setPattern(ptn) {
    pattern = ptn;
    currentStep = 0;
  }

  return {
    start,
    stop,
    setBpm,
    setPattern,
    get isPlaying() {
      return playing;
    },
  };
})();
