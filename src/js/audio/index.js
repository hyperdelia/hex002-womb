import createAudioContext from 'ios-safe-audio-context';
import AudioStream from './audio-stream';
import audioURL from '../../assets/audio/clark-sample2.mp3';

const onPlay = () => {
  const context = createAudioContext();
  const stream = new AudioStream(context, audioURL);

  stream.load().then(() => {
    const biquadFilter = context.createBiquadFilter();
    biquadFilter.type = 'highpass';
    biquadFilter.frequency.value = 4000;
    stream.connect(biquadFilter);

    biquadFilter.connect(context.destination);
    stream.play();
    console.log('playing..');
  });
};

const playButton = document.createElement('button');
playButton.innerHTML = 'Play';
playButton.addEventListener('click', onPlay);
document.body.appendChild(playButton);
