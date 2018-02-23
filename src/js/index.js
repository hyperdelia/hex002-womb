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

const audio = new Audio();

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

const controller = new Controller({
  audio,
  composition,
  visuals,
});

controller.start();

window.addEventListener('resize', () => {
  visuals.resize(window.innerWidth, window.innerHeight);
});
