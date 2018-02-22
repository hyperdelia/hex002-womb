import createAudioContext from 'ios-safe-audio-context';
import { ResonanceAudio } from 'resonance-audio';

import AudioStream from './audio-stream';

const audioURL = 'https://s3.eu-central-1.amazonaws.com/hyperdelia/collaborations/hex002/files/DPSTM+135+top+mfb+phase+sweep+hilarity.mp3';
// const NUM_VOICES = 10;

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

    const source = this.scene.createSource();
    const audioStream = new AudioStream(this.context, audioURL);

    audioStream.connect(source.input);
    source.setPosition(-0.707, -0.707, 0);

    audioStream.load().then(() => {
      // audioStream.play();
      console.log('playing..');
    });
  }

  update(activeStars) {

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
