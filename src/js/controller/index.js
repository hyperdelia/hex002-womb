const UPDATE_FREQUENCY = 1 * 1000;
const DISTANCE_THRESHOLD = 500;

export default class Controller {
  constructor(options) {
    const { audio, visuals } = options;

    this.audio = audio;
    this.visuals = visuals;
    this.interval = null;
  }

  init() {

  }

  update() {
    console.log('this.visuals.distances', this.visuals.distances);

    const activeStars = this.visuals.distances.reduce((acc, obj) => {
      if (obj.distance < DISTANCE_THRESHOLD) {
        acc.push(obj);
      }

      return acc;
    }, []);

    this.audio.update(activeStars);
  }

  start() {
    this.interval = setInterval(() => {
      this.update();
    }, UPDATE_FREQUENCY);
  }

  stop() {
    clearInterval(this.interval);
  }
}
