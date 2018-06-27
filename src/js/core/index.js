import { randomItem } from '../utils';

import Voice from '../audio/voice';

const UPDATE_FREQUENCY = 250;

export default class Core {
  constructor(options) {
    const {
      audio,
      samples,
      visuals,
    } = options;

    this.audio = audio;
    this.samples = samples.mobile;
    this.visuals = visuals;

    this.interval = null;
    this.voices = [];
  }

  update() {
    // Check for stars which are close enough to be played
    const voices = this.visuals.distances.reduce((acc, obj) => {
      if (obj.distance < this.audio.actorsMaxDistance / 2) {
        acc.push(new Voice(obj));
      }
      return acc;
    }, []).sort((a, b) => a.distance - b.distance);

    this.updateVoices(voices.slice(0, this.audio.actors.length));

    // Update the player / listener position
    this.audio.updateListener(this.visuals.playerWorldMatrix);
  }

  updateVoices(voices) {
    const starIds = voices.map(voice => voice.star.id);
    const activeStarIds = this.voices.map(voice => voice.star.id);
    
    // Find voices which are not used anymore
    const removeVoices = this.voices.filter(voice => {
      return !starIds.includes(voice.star.id);
    });

    this.voices = this.voices.filter(voice => {
      return starIds.includes(voice.star.id);
    });

    if (removeVoices.length > 0) {
      this.audio.removeVoices(removeVoices);
    }

    // Find new voices to be added to scene
    const addVoices = voices.reduce((acc, voice) => {
      if (!activeStarIds.includes(voice.star.id)) {
        voice.sampleUrl = randomItem(this.samples);
        this.voices.push(voice);
        acc.push(voice);
      }
      return acc;
    }, []);

    if (addVoices.length > 0) {
      this.audio.addVoices(addVoices);
    }
  }

  start() {
    if (this.interval) {
      return;
    }

    this.audio.start();

    this.interval = setInterval(() => {
      this.update();
    }, UPDATE_FREQUENCY);
  }

  stop() {
    this.audio.stop();

    clearInterval(this.interval);
    this.interval = null;
  }
}
