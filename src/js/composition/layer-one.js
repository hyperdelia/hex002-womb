import AudioStream from '../audio/audio-stream';

export default class LayerOne {
  constructor(context, options = {}) {
    this.audioStream = new AudioStream(context);
    this.url = options.url;

    this.vca = context.createGain();
    this.vca.gain.value = 0.1;

    this.audioStream.connect(this.vca);
    this.vca.connect(options.scene.ambisonicInput);
  }

  set amp(value) {
    this.vca.gain.value = value;
  }

  get amp() {
    return this.vca.gain.value;
  }

  start() {
    this.audioStream.start(this.url);
  }

  stop() {
    this.audioStream.stop();
  }
}
