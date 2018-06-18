import { randomItem } from '../utils';

import Voice from '../composition/voice';

const ACTIVATION_DISTANCE_THRESHOLD = 100;
const UPDATE_FREQUENCY = 100;

export default class Core {
  constructor(options) {
    const {
      audio,
      samples,
      visuals,
    } = options;

    this.audio = audio;
    this.samples = samples;
    this.visuals = visuals;

    this.interval = null;
    this.voices = [];
  }

  update() {
    // Check for stars which are close enough to be played
    const voices = this.visuals.distances.reduce((acc, obj) => {
      if (obj.distance < ACTIVATION_DISTANCE_THRESHOLD) {
        acc.push(new Voice(obj));
      }

      return acc;
    }, []);

    this.updateVoices(voices);

    // Update the player / listener position
    this.audio.updateListener(this.visuals.playerWorldMatrix);
  }

  updateVoices(voices) {
    const starIds = voices.map(voice => voice.star.id);
    const activeStarIds = this.voices.map(voice => voice.star.id);

    // Find voices which are not used anymore
    const removeVoices = this.voices.reduce((acc, voice, index) => {
      if (!starIds.includes(voice.star.id)) {
        this.voices.splice(index, 1);
        acc.push(voice);
      }
      return acc;
    }, []);

    this.audio.removeVoices(removeVoices);

    // Find new voices to be added to scene
    const addVoices = voices.reduce((acc, voice) => {
      if (!activeStarIds.includes(voice.star.id)) {
        voice.sampleUrl = randomItem(this.samples.mobile);
        this.voices.push(voice);
        acc.push(voice);
      }
      return acc;
    }, []);

    this.audio.addVoices(addVoices);
  }

  start() {
    if (this.interval) {
      return;
    }

    this.interval = setInterval(() => {
      this.update();
    }, UPDATE_FREQUENCY);
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }
}
