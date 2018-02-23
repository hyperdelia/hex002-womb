import {
  Clock,
  Color,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import Stats from 'stats.js';

import { objectToVector3 } from '../converters';

import PointerControls from './pointer-controls';
import Starfield from './starfield';

const GRID_HELPER_SIZE = 500;

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

    this.clock = new Clock();

    // Create scene
    this.scene = new Scene();
    this.scene.background = new Color('black');

    // Create camera / player and set initial position
    this.camera = new PerspectiveCamera(27, width / height, 5, 3500);

    // Prepare pointer controller
    this.controls = new PointerControls({
      moveSpeed: 100.0,
      rotateSpeed: 0.005,
      stopSpeed: 5.0,
    }, this.camera);

    this.scene.add(this.controls.yawObject);

    // Set starting position
    this.controls.yawObject.position.set(0, 0, 300);

    // Initialise the renderer
    this.renderer = new WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.resize(width, height);

    // Add objects to scenery
    const starfield = new Starfield({
      color: new Color('white'),
      positions: stars.map(star => star.position),
      size: 50,
    });

    this.scene.add(starfield);

    // Add grid for orientation while testing
    const gridHelper = new GridHelper(
      GRID_HELPER_SIZE,
      10,
      new Color('white'),
      new Color('blue')
    );
    this.scene.add(gridHelper);

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
    this.controls.update(this.clock.getDelta());

    this.renderer.render(this.scene, this.camera);
  }

  get distances() {
    const playerWorldPosition = this.controls.worldPosition;

    return this.stars.map(star => {
      const distance = playerWorldPosition.distanceTo(
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
