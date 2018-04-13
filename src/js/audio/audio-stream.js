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

    this.output = context.createGain();
    this.isPlaying = false;
  }

  createNodes() {
    this.audioTag = document.createElement('audio');
    this.audioTag.controls = false;
    this.audioTag.crossOrigin = 'anonymous';
    this.audioTag.loop = true;

    this.audioNode = this.context.createMediaElementSource(this.audioTag);
    this.audioNode.connect(this.output);
  }

  removeNodes() {
    this.audioTag.remove();
    this.audioNode.disconnect();
  }

  connect(node) {
    this.output.connect(node);
  }

  disconnect() {
    this.output.disconnect();
  }

  start(url) {
    if (this.isPlaying) {
      return;
    }

    this.isPlaying = true;

    this.createNodes();

    this.audioTag.src = url;
    this.audioTag.play();
  }

  stop() {
    if (!this.isPlaying) {
      return;
    }

    this.isPlaying = false;

    this.audioTag.pause();
    this.audioTag.currentTime = 0;

    this.removeNodes();
  }
}
