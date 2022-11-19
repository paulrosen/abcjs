var allNotes = {};

const allPitches = [
  "C,,,",
  "D,,,",
  "E,,,",
  "F,,,",
  "G,,,",
  "A,,,",
  "B,,,",
  "C,,",
  "D,,",
  "E,,",
  "F,,",
  "G,,",
  "A,,",
  "B,,",
  "C,",
  "D,",
  "E,",
  "F,",
  "G,",
  "A,",
  "B,",
  "C",
  "D",
  "E",
  "F",
  "G",
  "A",
  "B",
  "c",
  "d",
  "e",
  "f",
  "g",
  "a",
  "b",
  "c'",
  "d'",
  "e'",
  "f'",
  "g'",
  "a'",
  "b'",
  "c''",
  "d''",
  "e''",
  "f''",
  "g''",
  "a''",
  "b''",
  "c'''",
  "d'''",
  "e'''",
  "f'''",
  "g'''",
  "a'''",
  "b'''"
];

// @ts-expect-error TS(2339): Property 'pitchIndex' does not exist on type '{}'.
allNotes.pitchIndex = function (noteName: any) {
  return allPitches.indexOf(noteName);
};

// @ts-expect-error TS(2339): Property 'noteName' does not exist on type '{}'.
allNotes.noteName = function (pitchIndex: any) {
  return allPitches[pitchIndex];
};

export default allNotes;
