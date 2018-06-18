import {
  Clock,
  Color,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import Stats from 'stats.js';

import { arrayToVector3 } from '../utils';

import Controls from '../controls';
import Mobile from './mobile';
import Starfield from './starfield';

const GRID_HELPER_SIZE = 500;

export default class Visuals {
  constructor(options) {
    const {
      canvas,
      controlsName,
      devicePixelRatio,
      height,
      width,
    } = options;

    this.options = options;

    this.stars = [];

    this.clock = new Clock();

    // Create scene
    this.scene = new Scene();
    this.scene.background = new Color('black');

    // Create camera / player and set initial position
    this.camera = new PerspectiveCamera(27, width / height, 5, 3500);

    // Prepare user controls
    this.controls = new Controls[controlsName]({
      camera: this.camera,
    });

    if (this.controls.sceneObject) {
      this.scene.add(this.controls.sceneObject);
    }

    // Set starting position
    this.controls.setPosition(0, 0, 0);

    // Initialise the renderer
    this.renderer = new WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.resize(width, height);

    // Add stats monitor when requested
    this.stats = null;

    if (this.options.isDebugMode) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
  }

  createScenery(data) {
    const { stars } = data;

    this.stars = stars;

    // Add objects to scenery
    const starfield = new Starfield({
      color: new Color('white'),
      magnitude: 1,
      size: 2,
      stars,
    });

    this.scene.add(starfield);

    // Add mobile with shapes to scenery
    const mobile = new Mobile({
      density: 0.007,
      origin: this.controls.position,
      stars,
    });

    this.mobile = mobile;
    this.scene.add(mobile);

    // Add grid for orientation while testing
    if (this.options.isDebugMode) {
      const gridHelper = new GridHelper(
        GRID_HELPER_SIZE,
        10,
        new Color('white'),
        new Color('blue')
      );
      this.scene.add(gridHelper);
    }
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  start() {
    this.controls.start();
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });

    this.mobile.animate();

    this.render();

    if (this.options.isDebugMode) {
      this.stats.update();
    }
  }

  render() {
    this.controls.update(this.clock.getDelta());

    this.renderer.render(this.scene, this.camera);
  }

  get distances() {
    const { playerWorldPosition } = this.controls;

    return this.stars.map(star => {
      const { p: position } = star;
      const distance = playerWorldPosition.distanceTo(arrayToVector3(position));

      return {
        star,
        distance,
      };
    });
  }

  get playerWorldMatrix() {
    return this.controls.playerWorldMatrix;
  }
}
