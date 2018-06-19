import {
  Clock,
  Color,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import Stats from 'stats.js';

import Controls from '../controls';
import Mobile from './mobile';
import Starfield from './starfield';

const GRID_HELPER_SIZE = 500;
const STARFIELD_MAGNITUDE = 6.5;

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
    this.isRunning = false;

    this.stars = [];

    this.clock = new Clock();

    // Create scene
    this.scene = new Scene();

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
    this.renderer = new WebGLRenderer({ canvas, alpha: true });
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
    // Resize starfield
    const stars = data.stars.map(star => {
      star.p = star.p.map(position => {
        return position * STARFIELD_MAGNITUDE;  
      });
      return star;
    });

    this.stars = stars;

    // Add objects to scenery
    const starfield = new Starfield({
      size: 5,
      stars,
      textures: data.textures.stars,
    });

    this.scene.add(starfield);

    // Add mobile with shapes to scenery
    const mobile = new Mobile({
      density: 0.007,
      maxDistance: 1000,
      origin: this.controls.position,
      size: 30,
      stars,
      textures: data.textures.mobile,
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
    this.isRunning = true;
    this.controls.start();
    this.animate();
  }

  stop() {
    this.isRunning = false;
    this.controls.stop();
  }

  resume() {
    this.start();
  }

  animate() {
    requestAnimationFrame(() => {
      if (this.isRunning) {
        this.animate();
      }
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

    return this.mobile.shapes.map(mobileShape => {
      const distance = playerWorldPosition.distanceTo(mobileShape.position);

      return {
        star: {
          id: mobileShape.uuid,
          position: mobileShape.position,
        },
        distance,
      };
    });
  }

  get playerWorldMatrix() {
    return this.controls.playerWorldMatrix;
  }
}
