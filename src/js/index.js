import '../scss/app.scss';

import Audio from './audio';
import Composition from './composition';
import Controller from './controller';
import Visuals from './visuals';

import stars from '../composition/stars.json';

const {
  innerHeight: height,
  innerWidth: width,
} = window;

const canvas = document.getElementById('visuals');

const audio = new Audio();
const visuals = new Visuals({
  width,
  height,
  canvas,
  stars,
});

const composition = new Composition({
  stars,
});

const controller = new Controller({
  audio,
  visuals,
});

controller.init(composition);

window.addEventListener('resize', () => {
  visuals.resize(window.innerWidth, window.innerHeight);
});
