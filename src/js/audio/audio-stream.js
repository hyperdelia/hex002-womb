import AudioBase from './audio-base';

/**
 * AudioStream creates and wraps a standard HTML5 audio tag in
 * mediaElementSourceNode for further processing in the WebAudio domain.
 */
export default class AudioStream extends AudioBase {
  /**
   * Create a new AudioStream instance
   * @param {object} context - Current AudioContext
   */
  constructor(context) {
    super(context);

    this.audioTag = document.createElement('audio');
    this.audioTag.preload = 'none';
    this.audioTag.src = null;
    this.audioTag.controls = false;
    this.audioTag.crossOrigin = 'anonymous';

    this.audioNode = this.context.createMediaElementSource(this.audioTag);

    this.isPlaying = false;
  }

  set src(url) {
    this.audioTag.src = url;
  }

  get src() {
    return this.audioTag.src;
  }

  /**
   * Begin to load the audio file.
   * This Method has to be called before using any other methods of this class.
   * @return {Promise}
   */
  load() {
    if (!this.loadPromise) {
      this.loadPromise = new Promise((resolve, reject) => {
        this.audioTag.addEventListener('canplay', () => {
          resolve();
        });

        this.audioTag.addEventListener('error', (err) => { reject(err); });

        this.audioTag.load();
      });
    }

    return this.loadPromise;
  }

  connect(aNode) {
    this.audioNode.connect(aNode);
  }

  disconnect() {
    this.audioNode.disconnect();
  }

  play() {
    if (this.isPlaying) {
      return;
    }

    this.isPlaying = true;

    this.audioTag.play();
  }

  stop() {
    if (!this.isPlaying) {
      return;
    }

    this.isPlaying = false;

    this.audioTag.pause();
    this.audioTag.currentTime = 0;
  }

  pause() {
    if (!this.isPlaying) {
      return;
    }

    this.isPlaying = false;

    this.audioTag.pause();
  }
}
