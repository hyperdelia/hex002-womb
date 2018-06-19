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
    this.audioTag.controls = false;
    this.audioTag.crossOrigin = 'anonymous';
    this.audioTag.loop = true;
    this.audioTag.preload = 'none';
    this.audioTag.src = null;

    this.audioNode = this.context.createMediaElementSource(this.audioTag);

    this.isPlaying = false;
  }

  set src(url) {
    this.audioTag.src = url;
  }

  get src() {
    return this.audioTag.src;
  }

  connect(node) {
    this.audioNode.connect(node);
  }

  disconnect() {
    this.audioNode.disconnect();
  }

  start(url) {
    if (this.isPlaying) {
      return;
    }

    this.src = url;

    this.isPlaying = true;

    return this.audioTag.play();
  }

  stop() {
    if (!this.isPlaying) {
      return;
    }

    this.isPlaying = false;

    this.audioTag.pause();
    this.audioTag.currentTime = 0;
  }
}
