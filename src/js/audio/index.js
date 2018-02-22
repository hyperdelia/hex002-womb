import createAudioContext from 'ios-safe-audio-context';
import { ResonanceAudio } from 'resonance-audio';

import AudioStream from './audio-stream';
import Actor from './actor';

const NUM_VOICES = 4;

export default class Audio {
  constructor() {
    this.context = createAudioContext();

    this.scene = new ResonanceAudio(this.context);
    this.scene.output.connect(this.context.destination);

    const roomDimensions = {
      width: 3.1,
      height: 2.5,
      depth: 3.4,
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

    for (let i=0; i < NUM_VOICES; i++) {
      const source = this.scene.createSource();
      const audioStream = new AudioStream(this.context);

      audioStream.connect(source.input);

      const actor = new Actor({ source, audioStream });
      this.actors.push(actor);
    }

    // source.setPosition(-0.707, -0.707, 0);
    // audioStream.load().then(() => {
    //   // audioStream.play();
    //   console.log('playing..');
    // });
  }

  addVoices(voices) {
    if (voices.length === 0) return;

    let index = 0;

    this.actors.some(actor => {
      if (!actor.isPlaying) {
        const url = voices[index].sampleUrl;
        const starId = voices[index].star.id;

        actor.start(url, starId);

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
