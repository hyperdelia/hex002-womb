import { ResonanceAudio } from 'resonance-audio';

import { normalizeDimension } from '../converters';

import Actor from './actor';
import AudioStream from './audio-stream';

const SOURCE_MAX_DISTANCE = 1;
const SOURCE_MIN_DISTANCE = 0;
const SOURCE_WIDTH = 180;

const MAX_ACTOR_COUNT = 10;

const ROOM_DIMENSION = 500;
const ROOM_MATERIAL = 'curtain-heavy';

export default class Audio {
  constructor(context) {
    this.context = context;

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

    for (let i = 0; i < MAX_ACTOR_COUNT; i += 1) {
      const resonanceSource = this.scene.createSource();
      resonanceSource.setMaxDistance(SOURCE_MAX_DISTANCE);
      resonanceSource.setMinDistance(SOURCE_MIN_DISTANCE);
      resonanceSource.setSourceWidth(SOURCE_WIDTH);

      const audioStream = new AudioStream(this.context);
      const actor = new Actor({
        resonanceSource,
        audioStream,
      });

      this.actors.push(actor);
    }
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
        const { id, position } = voice.star;

        actor.start(
          voice.sampleUrl,
          id,
          normalizeDimension(ROOM_DIMENSION, position)
        );

        index += 1;
      }

      return index > voices.length - 1;
    });

    if (index < (voices.length - 1)) {
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
}
