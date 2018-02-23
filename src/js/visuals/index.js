import {
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import Stats from 'stats.js';

import { objectToVector3 } from '../converters';

import Starfield from './starfield';

export default class Visuals {
  constructor(options) {
    const {
      canvas,
      devicePixelRatio,
      height,
      isStatsShown,
      stars,
      width,
    } = options;

    this.stars = stars;

    // Create scene
    this.scene = new Scene();

    // Create camera / player and set initial position
    this.camera = new PerspectiveCamera(27, width / height, 5, 3500);
    this.camera.position.z = 2750;

    // Initialise the renderer
    this.renderer = new WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.resize(width, height);

    // Add objects to scenery
    const starfield = new Starfield({
      color: new Color('white'),
      positions: stars.map(star => star.position),
      size: 15,
    });

    this.scene.add(starfield);

    // Add stats monitor when requested
    this.stats = null;

    if (isStatsShown) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }

    // Render scene
    this.render();
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });

    this.render();
    this.stats.update();
  }

  render() {
    this.camera.position.z -= 3;

    this.renderer.render(this.scene, this.camera);
  }

  get distances() {
    return this.stars.map(star => {
      const distance = this.camera.position.distanceTo(
        objectToVector3(star.position)
      );

      return {
        star,
        distance,
      };
    });
  }

  get cameraMatrix() {
    return this.camera.matrixWorld;
  }
}
