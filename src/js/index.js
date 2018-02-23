import createAudioContext from 'ios-safe-audio-context';

import '../scss/app.scss';

import Audio from './audio';
import Composition from './composition';
import Controller from './controller';
import Visuals from './visuals';

import samples from '../composition/samples.json';
import stars from '../composition/stars.json';

const DEBUG_MODE = true;

const {
  devicePixelRatio,
  innerHeight: height,
  innerWidth: width,
} = window;

const canvas = document.getElementById('visuals');

const visuals = new Visuals({
  canvas,
  devicePixelRatio,
  height,
  isStatsShown: DEBUG_MODE,
  stars,
  width,
});

const composition = new Composition({
  samples,
  stars,
});

let isPlaying = false;

function start() {
  if (isPlaying) {
    return;
  }

  const context = createAudioContext();
  const audio = new Audio(context);

  const controller = new Controller({
    audio,
    composition,
    visuals,
  });

  visuals.animate();
  visuals.controls.toggleDirections({ forward: true });

  controller.start();

  isPlaying = true;
}

window.addEventListener('resize', () => {
  visuals.resize(window.innerWidth, window.innerHeight);
});

window.addEventListener('touchend', start, false);
window.addEventListener('click', start, false);

window.addEventListener('mousemove', event => {
  const movementX = (
    event.movementX ||
    event.mozMovementX ||
    event.webkitMovementX ||
    0
  );

  const movementY = (
    event.movementY ||
    event.mozMovementY ||
    event.webkitMovementY ||
    0
  );

  visuals.controls.movePointer(movementX, movementY);
}, false);
