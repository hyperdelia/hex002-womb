import createAudioContext from 'ios-safe-audio-context';

import Audio from '../audio';
import Core from '../core';
import Visuals from '../visuals';

import preload from '../utils/preload';

export default class Session {
  constructor(options) {
    this.options = options;

    this.composition = null;
    this.visuals = null;
  }

  prepare() {
    const {
      canvas,
      isDebugMode,
      platform,
    } = this.options;

    // Define user controls
    let controlsName;
    switch (platform) {
      case 'mobile':
        controlsName = 'deviceOrientation';
        break;
      case 'vr':
        controlsName = 'virtualReality';
        break;
      default:
        controlsName = 'pointer';
    }

    // Create visuals
    const {
      devicePixelRatio,
      innerHeight: height,
      innerWidth: width,
    } = window;

    this.visuals = new Visuals({
      canvas,
      controlsName,
      devicePixelRatio,
      height,
      isDebugMode,
      width,
    });

    window.addEventListener('resize', () => {
      this.visuals.resize(window.innerWidth, window.innerHeight);
    });

    return preload().then(assets => {
      const { stars, textures } = assets;

      this.visuals.createScenery({
        stars,
        textures,
      });
    });
  }

  start() {
    const { composition, visuals } = this;

    // Create audio context
    const context = createAudioContext();
    const audio = new Audio(context);

    // Create core handler
    const core = new Core({
      audio,
      composition,
      visuals,
    });

    core.start();
    this.visuals.start();
  }
}
