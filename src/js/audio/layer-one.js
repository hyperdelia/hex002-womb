import HLS from 'hls.js';

import { Vector3 } from 'three';
import { normalizeDimension } from '../utils';

const FADE_TIME = 5;
const MAX_LEVEL = 0.5;
const POSITIONS = [
  new Vector3(
    -10000,
    0,
    0,
  ),
  new Vector3(
    10000,
    0,
    0,
  ),
];

export default class LayerOne {
  constructor(context, options = {}) {
    this.context = context;
    this.options = options;
  }

  load() {
    if (!this.loadPromise) {
      const startTime = this.getStartTime();

      const { samples } = this.options;
      const url = samples.interstellar;

      this.loadPromise = this.createAudioObject(url, startTime)
        .then(result => {
          const { tag, node } = result;

          this.tag = tag;
          this.node = node;

          return {
            tag,
            node,
          };
        });
    }

    return this.loadPromise;
  }

  splitChannels(object) {
    if (!this.splitPromise) {
      const numChannels = 2;
      const {
        roomDimension,
        scene,
      } = this.options;

      const { tag, node } = object;

      const splitter = this.context.createChannelSplitter(numChannels);
      node.connect(splitter);

      this.streams = [];

      for (let index = 0; index < numChannels; index += 1) {
        const resonanceSource = scene.createSource({
          maxDistance: 99999,
          rolloff: 'linear',
          sourceWidth: 0,
        });

        const positionVector = normalizeDimension(
          roomDimension, POSITIONS[index]
        );

        resonanceSource.setPosition(
          positionVector.x,
          positionVector.y,
          positionVector.z
        );

        const gain = this.context.createGain();

        gain.gain.value = 0.0;
        splitter.connect(gain, index);
        gain.connect(resonanceSource.input);

        this.streams.push({
          tag,
          node,
          gain,
          resonanceSource,
        });
      }

      this.splitPromise = Promise.resolve(object);
    }

    return this.splitPromise;
  }

  set amp(value) {
    this.streams.forEach(obj => obj.gain.gain.value = value);
  }

  get amp() {
    return this.streams.map(obj => obj.gain.gain.value);
  }

  getStartTime() {
    return Math.floor(Math.random() * 2160.0); // totalLength - 2min
  }

  fadeIn() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }

    this.streams.forEach(obj => {
      const vca = obj.gain;
      const now = this.context.currentTime;

      vca.gain.cancelScheduledValues(now);
      vca.gain.setValueAtTime(0.0, now);
      vca.gain.linearRampToValueAtTime(
        MAX_LEVEL,
        now + FADE_TIME
      );
    });
  }

  fadeOut() {
    const gains = [];

    this.streams.forEach(obj => {
      const vca = obj.gain;
      const now = this.context.currentTime;

      vca.gain.cancelScheduledValues(now);
      vca.gain.setValueAtTime(MAX_LEVEL, now);
      vca.gain.linearRampToValueAtTime(
        0.0,
        now + FADE_TIME
      );

      gains.push(vca);
    });

    return new Promise(resolve => {
      const getCurrentValue = () => gains.reduce((acc, vca) => acc + vca.gain.value, 0);

      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }

      // workaround, gain.value is always zero in Firefox
      if (getCurrentValue() === 0) {
        this.timer = setTimeout(() => { resolve(); }, FADE_TIME * 1000.0);
        return;
      }

      const checkValues = () => {
        if (getCurrentValue() < 0.001) {
          resolve();
        } else {
          this.timer = setTimeout(() => { checkValues(); }, 0.5 * 1000);
        }
      };

      checkValues();
    });
  }

  createAudioObject(url, startTime = 0) {
    const tag = document.createElement('audio');

    tag.loop = true;
    tag.preload = 'auto';
    tag.controls = false;
    tag.crossOrigin = 'anonymous';
    tag.currentTime = startTime;

    const node = this.context.createMediaElementSource(tag);

    return new Promise((resolve, reject) => {
      if (HLS.isSupported()) {
        const hls = new HLS();

        hls.loadSource(url);
        hls.attachMedia(tag);
        hls.on(HLS.Events.MANIFEST_PARSED, () => {
          resolve({ tag, node });
        });
      } else if (tag.canPlayType('application/vnd.apple.mpegurl')) {
        tag.src = url;
        tag.addEventListener('loadedmetadata', () => {
          resolve({ tag, node });
        });
      } else {
        reject();
      }
    });
  }

  start() {
    return this.load()
      .then(result => this.splitChannels(result))
      .then(result => {
        const { tag } = result;
        return tag.play()
          .then(() => {
            this.fadeIn();
          });
      });
  }

  stop() {
    const nextStartTime = this.getStartTime();

    return this.fadeOut().then(() => {
      this.tag.pause();
      this.tag.currentTime = nextStartTime;
    });
  }
}
