import registerAudioContext from './register-audio-context.js';

function activeAudioContext() {
  if (!window.abcjsAudioContext) registerAudioContext();
  return window.abcjsAudioContext;
}

export default activeAudioContext;
