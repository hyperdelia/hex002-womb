import { Vector3 } from 'three';

import { normalizeDimension } from '../utils';
import {
  STATUS_BUFFERING,
  STATUS_PREFETCH,
  STATUS_READY,
} from '../audio/status-events';

const FADE_TIME = 5;
const MAX_LEVEL = 1;
const POSITIONS = [
  new Vector3(
    -5000,
    5000,
    0,
  ),
  new Vector3(
    5000,
    5000,
    0,
  ),
  new Vector3(
    -5000,
    -5000,
    0,
  ),
  new Vector3(
    5000,
    -5000,
    0,
  ),
];

export default class LayerOne {
  constructor(context, options = {}) {
    this.context = context;
    this.samples = options.samples.interstellar;
    this.statusCallback = options.statusCallback;

    const scene = options.scene;
    const startTime = Math.floor(Math.random() * 2160.0); // totalLength - 2min

    this.streams = [];

    this.samples.forEach((url, index) => {
      const resonanceSource = scene.createSource({
        maxDistance: 99999,
        rolloff: 'linear',
      });

      const { tag, node } = this.createAudioObject(
        index,
        url,
        startTime
      );
      const gain = context.createGain();

      const positions = normalizeDimension(
        this.roomDimension, POSITIONS[index]
      );

      resonanceSource.setPosition(
        positions.x,
        positions.y,
        positions.z
      );

      gain.gain.value = 0.0;
      node.connect(gain);
      gain.connect(resonanceSource.input);

      this.streams.push({
        tag,
        node,
        gain,
        resonanceSource,
      });
    });

    this.isPlaying = false;
  }

  set amp(value) {
    this.streams.forEach(obj => obj.gain.gain.value = value);
  }

  get amp() {
    return this.streams.map(obj => obj.gain.gain.value);
  }

  fadeIn() {
    this.streams.forEach(obj => {
      const vca = obj.gain;
      const now = this.context.currentTime;

      vca.gain.cancelScheduledValues(now);
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
      vca.gain.linearRampToValueAtTime(
        0.0,
        now + FADE_TIME
      );

      gains.push(vca);
    });

    return new Promise(resolve => {
      const checkValues = () => {
        const currentVal = gains.reduce((acc, vca) => acc + vca.gain.value, 0);

        if (currentVal < 0.001) {
          resolve();
        } else {
          setTimeout(() => {
            checkValues();
          }, 0.5 * 1000);
        }
      };

      checkValues();
    });
  }

  onReady(index) {
    if ((this.samples.length - 1) === index) {
      this.statusCallback(STATUS_READY);

      this.start().then(() => {
        if (this.isPlaying) {
          return;
        }
        this.isPlaying = true;
        this.fadeIn();
      });
    }
  }

  createAudioObject(index, url, startTime = 0) {
    const tag = document.createElement('audio');

    tag.src = url;
    tag.loop = true;
    tag.preload = 'auto';
    tag.controls = false;
    tag.crossOrigin = 'anonymous';
    tag.currentTime = startTime;

    tag.addEventListener('canplay', () => { this.onReady(index); }, true);

    const node = this.context.createMediaElementSource(tag);

    return {
      tag,
      node,
    };
  }

  start() {
    if (this.isPlaying) {
      return Promise.resolve();
    }

    const promises = this.samples.map((url, index) => {
      const audioTag = this.streams[index].tag;
      return audioTag.play();
    });

    return Promise.all(promises);
  }

  stop() {
    if (!this.isPlaying) {
      return;
    }

    this.fadeOut().then(() => {
      this.streams.forEach(obj => {
        obj.tag.pause();
        obj.tag.currentTime = 0;
      });
      this.isPlaying = false;
    });
  }
}
