import { ResonanceAudio } from 'resonance-audio';

import { normalizeDimension } from '../converters';

import Actor from './actor';
import AudioStream from './audio-stream';

const SOURCE_MAX_DISTANCE = 1;
const SOURCE_MIN_DISTANCE = 0;
const SOURCE_WIDTH = 180;

const MAX_ACTOR_COUNT = 10;

const ROOM_SIZE = 500;

const ROOM_MATERIALS = {
  left: 'curtain-heavy',
  right: 'curtain-heavy',
  front: 'curtain-heavy',
  back: 'curtain-heavy',
  down: 'curtain-heavy',
  up: 'curtain-heavy',
};

export default class Audio {
  constructor(context) {
    this.context = context;

    this.scene = new ResonanceAudio(this.context);
    this.scene.output.connect(this.context.destination);

    // Set the room definition for the scene
    const roomDimensions = {
      width: ROOM_SIZE,
      height: ROOM_SIZE,
      depth: ROOM_SIZE,
    };

    this.scene.setRoomProperties(roomDimensions, ROOM_MATERIALS);

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
      normalizeDimension(ROOM_SIZE, matrix)
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
          normalizeDimension(ROOM_SIZE, position)
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
