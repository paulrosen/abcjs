import activeAudioContext from './active-audio-context';

//
// Support for audio depends on three things: support for Promise, support for AudioContext, and support for AudioContext.resume.
// Unfortunately, AudioContext.resume cannot be detected unless an AudioContext is created, and creating an AudioContext can't
// be done until a user click, so there is no way to know for sure if audio is supported until the user tries.
// We can get close, though - we can test for Promises and AudioContext - there are just a few evergreen browsers that supported
// that before supporting resume, so we'll test what we can.

// The best use of this routine is to call it before doing any audio related stuff to decide whether to bother.
// But then, call it again after a user interaction to test for resume.

function supportsAudio() {
  if (!window.Promise) return false;

  if (
    !window.AudioContext &&
    // @ts-expect-error TS(2339): Property 'webkitAudioContext' does not exist on ty... Remove this comment to see the full error message
    !window.webkitAudioContext &&
    // @ts-expect-error TS(2339): Property 'mozAudioContext' does not exist on type ... Remove this comment to see the full error message
    !navigator.mozAudioContext &&
    // @ts-expect-error TS(2339): Property 'msAudioContext' does not exist on type '... Remove this comment to see the full error message
    !navigator.msAudioContext
  )
    return false;

  var aac = activeAudioContext();
  if (aac) return aac.resume !== undefined;
}

export default supportsAudio;
