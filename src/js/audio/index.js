import createAudioContext from 'ios-safe-audio-context';
import { ResonanceAudio } from 'resonance-audio';

import { normalizeDimension } from '../converters';

import AudioStream from './audio-stream';
import Actor from './actor';

const NUM_ACTORS = 4;
const ROOM_SIZE = 500;

export default class Audio {
  constructor() {
    this.context = createAudioContext();

    this.scene = new ResonanceAudio(this.context);
    this.scene.output.connect(this.context.destination);

    const roomDimensions = {
      width: ROOM_SIZE,
      height: ROOM_SIZE,
      depth: ROOM_SIZE,
    };

    const roomMaterials = {
      // Room wall materials
      left: 'brick-bare',
      right: 'curtain-heavy',
      front: 'marble',
      back: 'glass-thin',
      // Room floor
      down: 'grass',
      // Room ceiling
      up: 'transparent',
    };

    // Add the room definition to the scene.
    this.scene.setRoomProperties(roomDimensions, roomMaterials);

    this.actors = [];

    for (let i=0; i < NUM_ACTORS; i++) {
      const resonanceSource = this.scene.createSource();
      const audioStream = new AudioStream(this.context);

      audioStream.connect(resonanceSource.input);

      const actor = new Actor({ resonanceSource, audioStream });
      this.actors.push(actor);
    }
  }

  updateListener(matrix) {
    this.scene.setListenerFromMatrix(normalizeDimension(ROOM_SIZE, matrix));
    // this.scene.setListenerPosition(normalizeDimension(matrix));
  }

  addVoices(voices) {
    if (voices.length === 0) return;

    let index = 0;

    this.actors.some(actor => {
      if (!actor.isPlaying) {
        const voice = voices[index];
        const {
          id,
          position,
        } = voice.star;

        actor.start(voice.sampleUrl, id, normalizeDimension(ROOM_SIZE, position));

        index += 1;
      }

      return index > voices.length - 1;
    });

    if (index < (voices.length - 1)) {
      console.warn('Too few available voices');
    }
  }

  removeVoices(voices) {
    const oldStarIds = voices.map(voice => voice.star.id);

    this.actors.forEach(actor => {
      if (oldStarIds.includes(actor.starId)) {
        actor.stop();
      }
    });
  }
}

// let audioStream = null;

// const onPlay = () => {
//   const context = createAudioContext();
//   const stream = new AudioStream(context, audioURL);

//   stream.load().then(() => {
//     const biquadFilter = context.createBiquadFilter();
//     biquadFilter.type = 'highpass';
//     biquadFilter.frequency.value = 4000;
//     stream.connect(biquadFilter);

//     biquadFilter.connect(context.destination);
//     stream.play();
//     console.log('playing..');
//   });

//   audioStream = stream;
// };

// const onStop = () => {
//   if (audioStream) {
//     audioStream.stop();
//   }
// };

// const playButton = document.createElement('button');
// playButton.innerHTML = 'Play';
// playButton.addEventListener('click', onPlay);
// document.body.appendChild(playButton);

// const stopButton = document.createElement('button');
// stopButton.innerHTML = 'Stop';
// stopButton.addEventListener('click', onStop);
// document.body.appendChild(stopButton);
