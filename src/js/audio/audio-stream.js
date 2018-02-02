import AudioBase from './audio-base';
import _ from 'lodash';

/**
 * AudioStream creates and wraps a standard HTML5 audio tag in
 * mediaElementSourceNode for further processing in the WebAudio domain.
 */
export default class AudioStream extends AudioBase {
  /**
   * Create a new AudioStream instance
   * @param {object} context - Current AudioContext
   * @param {string} url - Audio file URL
   */
  constructor(context, url) {
    super(context);

    this.audioTag = document.createElement('audio');
    this.audioTag.src = url;
    this.audioTag.controls = false;
    this.audioTag.crossOrigin = true;
  }

  /**
   * Begin to load the audio file.
   * This Method has to be called before using any other methods of this class.
   * @return {Promise}
   */
  load() {
    if (!this.loadPromise) {
      this.loadPromise = new Promise((resolve, reject) => {
        // TODO(david): Ugly hack for now
        this.audioTag.addEventListener('error', (err) => { reject(err); });

        this.node = this.context.createMediaElementSource(this.audioTag);
        resolve();

        /*
        this.audioTag.addEventListener('canplay', () => {
          const debug = document.createElement('div');
          debug.innerHTML = 'Ready';
          document.body.appendChild(debug);

          this.node = this.context.createMediaElementSource(this.audioTag);
          resolve();
        });

        // TODO(david): To call play looks like the only way to get iOS to actually
        // fire the canplay event.. see if there is another way.
        this.play();
        */
      });

      return this.loadPromise;
    }
  }

  connect(aNode) {
    this.node.connect(aNode);
  }

  disconnect() {
    this.node.disconnect();
  }

  play() {
    this.audioTag.play();
  }

  stop() {
    this.audioTag.stop();
  }
}
