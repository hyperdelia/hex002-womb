import { ResonanceAudio } from 'resonance-audio';

import { normalizeDimension } from '../utils';

import Actor from './actor';
import AudioStream from './audio-stream';
import LayerOne from './layer-one';

const MAX_ACTOR_COUNT = {
  desktop: 5,
  mobile: 3,
};

const ROOM_DIMENSION = 1;
const ROOM_MATERIAL = 'transparent';
const SOURCE_MAX_DISTANCE = 600;

export default class Audio {
  constructor(options) {
    const {
      context,
      samples,
      onError,
      platform,
    } = options;

    this.context = context;
    this.samples = samples;
    this.onError = onError;

    this.scene = new ResonanceAudio(this.context);
    this.scene.output.connect(this.context.destination);

    // Set the room definition for the scene
    const roomDimensions = {
      width: ROOM_DIMENSION,
      height: ROOM_DIMENSION,
      depth: ROOM_DIMENSION,
    };

    const roomMaterials = {
      left: ROOM_MATERIAL, right: ROOM_MATERIAL,
      front: ROOM_MATERIAL, back: ROOM_MATERIAL,
      down: ROOM_MATERIAL, up: ROOM_MATERIAL,
    };

    this.scene.setRoomProperties(roomDimensions, roomMaterials);

    this.actors = [];
    this.actorsMaxDistance = SOURCE_MAX_DISTANCE;

    for (let i = 0; i < MAX_ACTOR_COUNT[platform]; i += 1) {
      const resonanceSource = this.scene.createSource({
        maxDistance: this.actorsMaxDistance,
        rolloff: 'linear',
      });

      const audioStream = new AudioStream(this.context);
      const actor = new Actor({
        resonanceSource,
        audioStream,
      });

      this.actors.push(actor);
    }

    this.layerOne = new LayerOne(this.context, {
      scene: this.scene,
      roomDimension: ROOM_DIMENSION,
      samples,
    });
  }

  updateListener(matrix) {
    this.scene.setListenerFromMatrix(
      normalizeDimension(ROOM_DIMENSION, matrix)
    );
  }

  addVoices(voices) {
    if (!voices.length) {
      return;
    }

    let index = 0;

    this.actors.some(actor => {
      if (!actor.isPlaying) {
        const voice = voices[index];
        const { id } = voice.star;
        const { x, y, z } = voice.star.position;
        actor.start(
          voice.sampleUrl,
          id,
          normalizeDimension(ROOM_DIMENSION, { x, y, z })
        ).catch(err => { this.onError(err); });

        index += 1;
      }

      return index > voices.length - 1;
    });

    if (index < voices.length) {
      console.warn('Too few available actors.');
    }
  }

  removeVoices(voices) {
    const oldStarIds = voices.map(voice => voice.star.id);
    this.actors.forEach(actor => {
      if (oldStarIds.includes(actor.starId)) {
        actor.stop();
      }
    });
  }

  removeAllVoices() {
    this.actors.forEach(actor => {
      actor.stop();
    });
  }

  stop() {
    this.removeAllVoices();
    this.layerOne.stop();
  }

  start() {
    this.layerOne.start()
      .catch(this.onError);
  }
}
