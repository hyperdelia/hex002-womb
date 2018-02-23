import createAudioContext from 'ios-safe-audio-context';

import '../scss/app.scss';

import Audio from './audio';
import Composition from './composition';
import Controller from './controller';
import Visuals from './visuals';

import samples from '../composition/samples.json';
import stars from '../composition/stars.json';

const DEBUG_MODE = true;

const ACTIVE_MOVE_CORNERS = 0.5;
const MOVE_INTERVAL = 10;

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

const pointerPosition = {
  x: 0,
  y: 0,
};

function start() {
  const context = createAudioContext();
  const audio = new Audio(context);

  const controller = new Controller({
    audio,
    composition,
    visuals,
  });

  visuals.animate();
  controller.start();

  isPlaying = true;
}

function startPointerUpdate() {
  window.setInterval(() => {
    if (!isPlaying) {
      return;
    }

    const { x, y } = pointerPosition;

    visuals.controls.movePointer(
      x < -ACTIVE_MOVE_CORNERS || x > ACTIVE_MOVE_CORNERS ? x : 0,
      y < -ACTIVE_MOVE_CORNERS || y > ACTIVE_MOVE_CORNERS ? y : 0
    );
  }, MOVE_INTERVAL);
}

function onMouseDown() {
  if (!isPlaying) {
    start();
    startPointerUpdate();

    visuals.controls.startMoving();
  } else {
    visuals.controls.stopMoving();
  }
}

function onMouseUp() {
  if (isPlaying) {
    visuals.controls.startMoving();
  }
}

function onMouseMove(event) {
  const { clientX, clientY } = event;
  const { innerWidth, innerHeight } = event.view;

  const x = (clientX / innerWidth) * 2 - 1;
  const y = (clientY / innerHeight) * 2 - 1;

  pointerPosition.x = x;
  pointerPosition.y = y;
}

window.addEventListener('touchstart', onMouseDown, false);
window.addEventListener('touchend', onMouseUp, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('mousemove', onMouseMove, false);

window.addEventListener('resize', () => {
  visuals.resize(window.innerWidth, window.innerHeight);
});
