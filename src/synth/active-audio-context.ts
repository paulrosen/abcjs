import registerAudioContext from './register-audio-context.js';

function activeAudioContext() {
  // @ts-expect-error TS(2551): Property 'abcjsAudioContext' does not exist on typ... Remove this comment to see the full error message
  if (!window.abcjsAudioContext) registerAudioContext();
  // @ts-expect-error TS(2551): Property 'abcjsAudioContext' does not exist on typ... Remove this comment to see the full error message
  return window.abcjsAudioContext;
}

export default activeAudioContext;
