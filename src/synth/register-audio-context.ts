// Call this when it is safe for the abcjs to produce sound. This is after the first user gesture on the page.
// If you call it with no parameters, then an AudioContext is created and stored.
// If you call it with a parameter, that is used as an already created AudioContext.

function registerAudioContext(ac: any) {
  // If one is passed in, that is the one to use even if there was already one created.
  // @ts-expect-error TS(2551): Property 'abcjsAudioContext' does not exist on typ... Remove this comment to see the full error message
  if (ac) window.abcjsAudioContext = ac;
  else {
    // no audio context passed in, so create it unless there is already one from before.
    // @ts-expect-error TS(2551): Property 'abcjsAudioContext' does not exist on typ... Remove this comment to see the full error message
    if (!window.abcjsAudioContext) {
      // @ts-expect-error TS(2339): Property 'webkitAudioContext' does not exist on ty... Remove this comment to see the full error message
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      // @ts-expect-error TS(2551): Property 'abcjsAudioContext' does not exist on typ... Remove this comment to see the full error message
      if (AudioContext) window.abcjsAudioContext = new AudioContext();
      else return false;
    }
  }
  // @ts-expect-error TS(2551): Property 'abcjsAudioContext' does not exist on typ... Remove this comment to see the full error message
  return window.abcjsAudioContext.state !== "suspended";
}

export default registerAudioContext;
