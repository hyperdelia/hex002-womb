import createAudioContext from 'ios-safe-audio-context';

import Audio from '../audio';
import Core from '../core';
import Visuals from '../visuals';

import preload from '../utils/preload';
import {
  STATUS_READY,
} from '../audio/status-events';

const statusCallback = (state) => {
  if (state === STATUS_READY) {
    console.log('layer one ready');
  }
};

export default class Session {
  constructor(options) {
    this.options = options;

    this.visuals = null;
    this.core = null;
    this.samples = null;

    this.isReady = false;
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
      const { stars, textures, samples } = assets;

      this.visuals.createScenery({
        stars,
        textures,
      });

      this.samples = samples;
    });
  }

  start() {
    const { samples, visuals } = this;

    if (this.isReady) {
      this.visuals.resume();
      this.core.resume();
      return;
    }

    // Create audio context
    const context = createAudioContext();
    const audio = new Audio(
      context,
      samples,
      statusCallback
    );

    // Create core handler
    this.core = new Core({
      audio,
      samples,
      visuals,
    });

    this.core.start();
    this.visuals.start();

    this.isReady = true;
  }

  stop() {
    this.core.stop();
    this.visuals.stop();
  }
}
