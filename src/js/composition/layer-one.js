import AudioStream from '../audio/audio-stream';

export default class LayerOne {
  constructor(context, options = {}) {
    this.audioStream = new AudioStream(context);
    this.audioStream.src = options.url;

    this.vca = context.createGain();
    this.vca.gain.value = 0.1;

    this.audioStream.connect(this.vca);
    this.vca.connect(options.scene.ambisonicInput);
  }

  set amp(value) {
    this.gain.gain.value = value;
  }

  get amp() {
    return this.gain.gain.value;
  }

  start() {
    this.audioStream.play();
  }

  stop() {
    this.audioStream.stop();
  }
}
