export default class Controller {
  constructor(options) {
    const { audio, visuals } = options;

    this.audio = audio;
    this.visuals = visuals;
  }

  init(composition) {
    // this.visuals.init();
  }
}
