export default class Actor {
  constructor(options) {
    const {
      audioStream,
      resonanceSource,
      starId,
    } = options;

    this.audioStream = audioStream;
    this.resonanceSource = resonanceSource;
    this.starId = starId;
  }

  get isPlaying() {
    return this.audioStream.isPlaying;
  }

  set position(point) {
    this.resonanceSource.setPosition(
      point.x,
      point.y,
      point.z
    );
  }

  start(url, starId, position) {
    this.starId = starId;

    this.resonanceSource.setPosition(
      position.x,
      position.y,
      position.z
    );

    this.audioStream.connect(this.resonanceSource.input);
    return this.audioStream.start(url);
  }

  stop() {
    this.starId = null;

    this.audioStream.stop();
    this.audioStream.disconnect();
  }
}
