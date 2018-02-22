import { randomItem } from '../utils';

import Voice from '../composition/voice';

const UPDATE_FREQUENCY = 1 * 1000;
const DISTANCE_THRESHOLD = 5000;

export default class Controller {
  constructor(options) {
    const {
      audio,
      visuals,
      composition,
    } = options;

    this.audio = audio;
    this.visuals = visuals;
    this.composition = composition;

    this.interval = null;
    this.voices = [];
  }

  update() {
    const voices = this.visuals.distances.reduce((acc, obj) => {
      if (obj.distance < DISTANCE_THRESHOLD) {
        acc.push(new Voice(obj));
      }

      return acc;
    }, []);

    this.updateVoices(voices);
  }

  updateVoices(voices) {
    const starIds = voices.map(voice => voice.star.id);
    const activeStarIds = this.voices.map(voice => voice.star.id);

    console.log('starIds', starIds);
    console.log('activeStarIds', activeStarIds);

    const removeVoices = this.voices.reduce((acc, voice, idx) => {
      if (!starIds.includes(voice.star.id)) {
        this.voices.splice(idx, 1);
        acc.push(voice);
      }

      return acc;
    }, []);

    const addVoices = voices.reduce((acc, voice) => {
      if (!activeStarIds.includes(voice.star.id)) {
        voice.sampleUrl = randomItem(this.composition.samples.stars);
        this.voices.push(voice);
        acc.push(voice);
      }

      return acc;
    }, []);

    console.log('removeVoices', removeVoices);
    console.log('addVoices', addVoices);

    this.audio.removeVoices(removeVoices);
    this.audio.addVoices(addVoices);
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
