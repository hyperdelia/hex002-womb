import createAudioContext from 'ios-safe-audio-context';

import Audio from '../audio';
import Composition from '../composition';
import Controller from '../controller';
import Visuals from '../visuals';
import checkRequirements from './check-requirements';
import identifyPlatform from './identify-platform';
import preload from './preload';
import { DesktopAdapter, MobileAdapter, VRAdapter } from './adapters';

import samples from '../../composition/samples.json';
import stars from '../../composition/stars.json';

const CANVAS_ELEM_ID = 'visuals';

export default class Session {
  constructor(options) {
    const { isDebugMode } = options;

    const {
      devicePixelRatio,
      innerHeight: height,
      innerWidth: width,
    } = window;

    this.visuals = new Visuals({
      canvas: document.getElementById(CANVAS_ELEM_ID),
      devicePixelRatio,
      height,
      isDebugMode,
      width,
    });

    window.addEventListener('resize', () => {
      this.visuals.resize(window.innerWidth, window.innerHeight);
    });
  }

  checkRequirements() {
    checkRequirements();
  }

  preload() {
    // @TODO
  }

  createAdapter(platform) {
    const { controls } = this.visuals;

    const options = {
      onStart: () => {
        controls.startMoving();
      },
      onStop: () => {
        controls.stopMoving();
      },
      onMove: (x, y) => {
        controls.movePointer(x, y);
      },
    };

    switch (platform) {
      case 'mobile':
        this.adapter = new MobileAdapter(options);
        break;
      case 'vr':
        this.adapter = new VRAdapter(options);
        break;
      default:
        this.adapter = new DesktopAdapter(options);
    }
  }

  createSession() {
    const { visuals } = this;

    const composition = new Composition({
      samples,
      stars,
    });

    const context = createAudioContext();
    const audio = new Audio(context);

    const controller = new Controller({
      audio,
      composition,
      visuals,
    });

    this.visuals.createScenery({
      stars,
    });

    controller.start();
    this.visuals.start();
    this.adapter.start();
  }

  start() {
    return Promise.resolve()
      .then(() => {
        return checkRequirements();
      })
      .then(() => {
        return preload();
      })
      .then(() => {
        const platform = identifyPlatform();
        this.createAdapter(platform);
        this.createSession();
      });
  }
}
