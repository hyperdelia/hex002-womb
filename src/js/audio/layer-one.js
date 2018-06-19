import { Vector3 } from 'three';
import { normalizeDimension } from '../utils';

const FADE_TIME = 5;
const MAX_LEVEL = 0.5;
const POSITIONS = [
  new Vector3(
    -10000,
    10000,
    0,
  ),
  new Vector3(
    10000,
    10000,
    0,
  ),
  new Vector3(
    -10000,
    -10000,
    0,
  ),
  new Vector3(
    10000,
    -10000,
    0,
  ),
];

export default class LayerOne {
  constructor(context, options = {}) {
    this.context = context;
    this.samples = options.samples.interstellar;

    const scene = options.scene;
    const startTime = this.getStartTime();

    this.streams = [];

    this.samples.forEach((url, index) => {
      const resonanceSource = scene.createSource({
        maxDistance: 99999,
        rolloff: 'linear',
        sourceWidth: 0,
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

  getStartTime() {
    return Math.floor(Math.random() * 2160.0); // totalLength - 2min
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

  createAudioObject(index, url, startTime = 0) {
    const tag = document.createElement('audio');

    tag.src = url;
    tag.loop = true;
    tag.preload = 'auto';
    tag.controls = false;
    tag.crossOrigin = 'anonymous';
    tag.currentTime = startTime;

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

    return Promise.all(promises)
      .then(() => {
        this.isPlaying = true;
        this.fadeIn();
      });
  }

  stop() {
    if (!this.isPlaying) {
      return Promise.resolve();
    }

    const nextStartTime = this.getStartTime();

    return this.fadeOut().then(() => {
      this.streams.forEach(obj => {
        obj.tag.pause();
        obj.tag.currentTime = nextStartTime;
      });

      this.isPlaying = false;
    });
  }
}
