/* Rhythm pattern library.
 * Each pattern = { id, name, beatsPerBar, subdivision, steps }
 * - subdivision = how many steps make up one beat (1 = quarter notes, 2 = eighths, 3 = triplets, 4 = sixteenths)
 * - steps.length = beatsPerBar * subdivision
 * - steps[i] = array of hits at that step: [{ sound, vol }], or [] for silence
 * - "accentSteps" marks steps considered strong beats, used for the visual beat indicator only
 */

const RhythmPatterns = (() => {
  function buildSteps(total, hitsByStep) {
    const steps = Array.from({ length: total }, () => []);
    for (const [stepStr, hits] of Object.entries(hitsByStep)) {
      steps[Number(stepStr)] = hits;
    }
    return steps;
  }

  function beatAccents(beatsPerBar, subdivision) {
    const accents = [];
    for (let b = 0; b < beatsPerBar; b++) accents.push(b * subdivision);
    return accents;
  }

  const simple = {
    id: "simple",
    name: "Metrônomo",
    beatsPerBar: 4,
    subdivision: 1,
    editableTimeSig: true,
    steps: buildSteps(4, {
      0: [{ sound: "click", vol: 1 }],
      1: [{ sound: "click_low", vol: 0.7 }],
      2: [{ sound: "click_low", vol: 0.7 }],
      3: [{ sound: "click_low", vol: 0.7 }],
    }),
  };

  const rock = {
    id: "rock",
    name: "Rock",
    beatsPerBar: 4,
    subdivision: 2,
    steps: buildSteps(8, {
      0: [{ sound: "kick", vol: 1 }, { sound: "hihat", vol: 0.5 }],
      1: [{ sound: "hihat", vol: 0.35 }],
      2: [{ sound: "snare", vol: 0.9 }, { sound: "hihat", vol: 0.5 }],
      3: [{ sound: "hihat", vol: 0.35 }],
      4: [{ sound: "kick", vol: 1 }, { sound: "hihat", vol: 0.5 }],
      5: [{ sound: "hihat", vol: 0.35 }],
      6: [{ sound: "snare", vol: 0.9 }, { sound: "hihat", vol: 0.5 }],
      7: [{ sound: "hihat", vol: 0.35 }],
    }),
  };

  const popBallad = {
    id: "pop_ballad",
    name: "Pop Balada",
    beatsPerBar: 4,
    subdivision: 2,
    steps: buildSteps(8, {
      0: [{ sound: "kick", vol: 0.9 }, { sound: "hihat", vol: 0.3 }],
      1: [{ sound: "hihat", vol: 0.2 }],
      2: [{ sound: "rim", vol: 0.6 }, { sound: "hihat", vol: 0.3 }],
      3: [{ sound: "hihat", vol: 0.2 }],
      4: [{ sound: "kick", vol: 0.75 }, { sound: "hihat", vol: 0.3 }],
      5: [{ sound: "kick", vol: 0.5 }, { sound: "hihat", vol: 0.2 }],
      6: [{ sound: "rim", vol: 0.6 }, { sound: "hihat", vol: 0.3 }],
      7: [{ sound: "hihat", vol: 0.2 }],
    }),
  };

  const samba = {
    id: "samba",
    name: "Samba",
    beatsPerBar: 2,
    subdivision: 4,
    steps: buildSteps(8, {
      0: [{ sound: "surdo", vol: 1 }],
      1: [{ sound: "shaker", vol: 0.4 }],
      2: [{ sound: "tamborim", vol: 0.7 }],
      3: [{ sound: "tamborim", vol: 0.55 }, { sound: "shaker", vol: 0.3 }],
      4: [{ sound: "surdo", vol: 0.75 }],
      5: [{ sound: "shaker", vol: 0.4 }],
      6: [{ sound: "tamborim", vol: 0.7 }],
      7: [{ sound: "tamborim", vol: 0.55 }, { sound: "shaker", vol: 0.3 }],
    }),
  };

  const bossaNova = {
    id: "bossa_nova",
    name: "Bossa Nova",
    beatsPerBar: 4,
    subdivision: 4,
    steps: buildSteps(16, {
      0: [{ sound: "kick", vol: 0.85 }, { sound: "shaker", vol: 0.25 }],
      2: [{ sound: "shaker", vol: 0.2 }],
      3: [{ sound: "rim", vol: 0.75 }],
      4: [{ sound: "shaker", vol: 0.25 }],
      6: [{ sound: "rim", vol: 0.6 }],
      8: [{ sound: "kick", vol: 0.6 }, { sound: "shaker", vol: 0.25 }],
      10: [{ sound: "rim", vol: 0.75 }],
      12: [{ sound: "kick", vol: 0.7 }, { sound: "shaker", vol: 0.25 }],
      14: [{ sound: "shaker", vol: 0.2 }],
    }),
  };

  const baiao = {
    id: "baiao",
    name: "Baião",
    beatsPerBar: 4,
    subdivision: 4,
    steps: buildSteps(16, {
      0: [{ sound: "surdo", vol: 1 }],
      3: [{ sound: "rim", vol: 0.55 }],
      6: [{ sound: "surdo", vol: 0.7 }],
      8: [{ sound: "rim", vol: 0.7 }],
      10: [{ sound: "rim", vol: 0.4 }],
      12: [{ sound: "surdo", vol: 0.85 }],
      14: [{ sound: "rim", vol: 0.5 }],
    }),
  };

  const reggae = {
    id: "reggae",
    name: "Reggae",
    beatsPerBar: 4,
    subdivision: 4,
    steps: buildSteps(16, {
      0: [{ sound: "hihat", vol: 0.3 }],
      2: [{ sound: "rim", vol: 0.65 }],
      4: [{ sound: "hihat", vol: 0.3 }],
      6: [{ sound: "rim", vol: 0.65 }],
      8: [{ sound: "kick", vol: 1 }, { sound: "snare", vol: 0.85 }],
      10: [{ sound: "rim", vol: 0.65 }],
      12: [{ sound: "hihat", vol: 0.3 }],
      14: [{ sound: "rim", vol: 0.65 }],
    }),
  };

  const shuffleBlues = {
    id: "shuffle",
    name: "Shuffle/Blues",
    beatsPerBar: 4,
    subdivision: 3,
    steps: buildSteps(12, {
      0: [{ sound: "kick", vol: 1 }, { sound: "hihat", vol: 0.5 }],
      2: [{ sound: "hihat", vol: 0.3 }],
      3: [{ sound: "snare", vol: 0.85 }, { sound: "hihat", vol: 0.45 }],
      5: [{ sound: "hihat", vol: 0.3 }],
      6: [{ sound: "kick", vol: 0.9 }, { sound: "hihat", vol: 0.5 }],
      8: [{ sound: "hihat", vol: 0.3 }],
      9: [{ sound: "snare", vol: 0.85 }, { sound: "hihat", vol: 0.45 }],
      11: [{ sound: "hihat", vol: 0.3 }],
    }),
  };

  const valsa = {
    id: "valsa",
    name: "Valsa",
    beatsPerBar: 3,
    subdivision: 1,
    steps: buildSteps(3, {
      0: [{ sound: "kick", vol: 1 }],
      1: [{ sound: "rim", vol: 0.55 }],
      2: [{ sound: "rim", vol: 0.55 }],
    }),
  };

  const funk = {
    id: "funk",
    name: "Funk",
    beatsPerBar: 4,
    subdivision: 4,
    steps: buildSteps(16, {
      0: [{ sound: "kick", vol: 1 }, { sound: "hihat", vol: 0.4 }],
      2: [{ sound: "hihat", vol: 0.25 }],
      3: [{ sound: "kick", vol: 0.65 }, { sound: "hihat", vol: 0.3 }],
      4: [{ sound: "snare", vol: 0.85 }, { sound: "hihat", vol: 0.4 }],
      6: [{ sound: "hihat", vol: 0.25 }],
      8: [{ sound: "hihat", vol: 0.4 }],
      10: [{ sound: "kick", vol: 0.75 }, { sound: "hihat", vol: 0.3 }],
      12: [{ sound: "snare", vol: 0.85 }, { sound: "hihat", vol: 0.4 }],
      14: [{ sound: "hihat_open", vol: 0.4 }],
    }),
  };

  const LIST = [simple, rock, popBallad, samba, bossaNova, baiao, reggae, shuffleBlues, valsa, funk];

  function get(id) {
    return LIST.find((p) => p.id === id) || simple;
  }

  function withTimeSignature(pattern, beatsPerBar) {
    if (!pattern.editableTimeSig) return pattern;
    const accentVol = { 0: 1 };
    const hits = {};
    for (let b = 0; b < beatsPerBar; b++) {
      hits[b] = [{ sound: b === 0 ? "click" : "click_low", vol: b === 0 ? 1 : 0.7 }];
    }
    return { ...pattern, beatsPerBar, steps: buildSteps(beatsPerBar, hits) };
  }

  return { LIST, get, beatAccents, withTimeSignature };
})();
