import createAudioContext from 'ios-safe-audio-context';

import Audio from '../audio';
import Composition from '../composition';
import Core from '../core';
import Visuals from '../visuals';

import samples from '../../composition/samples.json';
import stars from '../../composition/stars.json';

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

    this.visuals.createScenery({
      stars,
    });

    window.addEventListener('resize', () => {
      this.visuals.resize(window.innerWidth, window.innerHeight);
    });

    // Create composition
    this.composition = new Composition({
      samples,
      stars,
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
