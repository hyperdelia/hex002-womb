import {
  STATUS_BUFFERING,
  STATUS_PREFETCH,
  STATUS_READY,
} from '../audio/status-events';

const FADE_TIME = 10;
const MAX_LEVEL = 0.5;

export default class LayerOne {
  constructor(context, options = {}) {
    this.context = context;
    this.samples = options.samples.interstellar;
    this.statusCallback = options.statusCallback;

    this.isPlaying = false;

    const scene = options.scene;

    const maxDistance = 75;
    const position = {
      x: 0,
      y: 0,
      z: 0,
    };

    this.streams = [];

    this.samples.forEach((url, index) => {
      const resonanceSource = scene.createSource({
        maxDistance,
        rolloff: 'linear',
      });

      const { tag, node } = this.createAudioObject(index, url);
      const gain = context.createGain();

      resonanceSource.setPosition(
        position.x,
        position.y,
        position.z
      );

      gain.gain.value = 0;
      node.connect(gain);
      gain.connect(resonanceSource.input);

      this.streams.push({
        tag,
        node,
        gain,
        resonanceSource,
      });
    });
  }

  fadeIn() {
    this.streams.forEach(obj => {
      const vca = obj.gain;
      vca.gain.linearRampToValueAtTime(MAX_LEVEL, FADE_TIME);
    });
  }

  fadeOut() {
    this.streams.forEach(obj => {
      const vca = obj.gain;
      vca.gain.linearRampToValueAtTime(0.0, FADE_TIME);
    });
  }

  onReady(index) {
    if ((this.samples.length - 1) === index) {
      this.statusCallback(STATUS_READY);
      this.start().then(() => {
        this.isPlaying = true;
        this.fadeIn();
      });
    }
    console.log(`layer-one player: ${index} ready`);
  }

  onLoaded() {
    this.statusCallback(STATUS_PREFETCH);
  }

  onBuffer() {
    this.statusCallback(STATUS_BUFFERING);
  }

  createAudioObject(index, url) {
    const tag = document.createElement('audio');

    tag.src = url;
    tag.loop = true;
    tag.preload = 'auto';
    tag.controls = false;
    tag.crossOrigin = 'anonymous';

    tag.addEventListener('seeked', () => { this.onBuffer(index); }, true);
    tag.addEventListener('canplay', () => { this.onReady(index); }, true);
    tag.addEventListener('loadstart', () => { this.onLoaded(index); }, true);

    const node = this.context.createMediaElementSource(tag);

    return {
      tag,
      node,
    };
  }

  set amp(value) {
    this.streams.forEach(obj => obj.gain.gain.value = value);
  }

  get amp() {
    return this.streams.map(obj => obj.gain.gain.value);
  }

  set position(vector) {
    this.streams.forEach(obj => {
      const { x, y, z } = vector;
      obj.resonanceSource.setPosition(x, y, z);
    });
  }

  start() {
    if (this.isPlaying) {
      return;
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

    this.streams.forEach(obj => {
      obj.tag.pause();
      obj.tag.currentTime = 0;
    });
  }
}
