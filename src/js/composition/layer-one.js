import AudioStream from '../audio/audio-stream';
import { Vector3 } from 'three';
// import { normalizeDimension } from '../utils';

const SOURCE_MIN_DISTANCE = 1;
const SOURCE_MAX_DISTANCE = 2;

export default class LayerOne {
  constructor(context, options = {}) {
    this.context = context;
    this.scene = options.scene;
    this.roomDimension = options.roomDimensions;

    const sourceUrls = [
      'https://s3.eu-central-1.amazonaws.com/hyperdelia/collaborations/hex002/files/audio/output-11.mp3',
      'https://s3.eu-central-1.amazonaws.com/hyperdelia/collaborations/hex002/files/audio/output-12.mp3',
      'https://s3.eu-central-1.amazonaws.com/hyperdelia/collaborations/hex002/files/audio/output-13.mp3',
      'https://s3.eu-central-1.amazonaws.com/hyperdelia/collaborations/hex002/files/audio/output-14.mp3',
    ];

    this.sourcePositions = [
      { x: 1,  y: -1, z: 0 }, // L
      { x: 1,  y: 1,  z: 0 }, // R
      { x: -1, y: -1, z: 0 }, // Ls
      { x: -1, y: 1,  z: 0 }, // Rs
    ];

    this.sources = sourceUrls.map((url, index) => {
      const audioStream = new AudioStream(context);
      const resonanceSource = this.scene.createSource({
        position: this.sourcePositions[index],
        minDistance: SOURCE_MIN_DISTANCE,
        maxDistance: SOURCE_MAX_DISTANCE,
      });

      audioStream.src = url;
      audioStream.connect(resonanceSource.input);

      return {
        resonanceSource,
        audioStream,
      };
    });
  }

  start() {
    this.sources.forEach(obj => {
      // TODO(davidgranstrom): Handle sync?
      obj.audioStream.play();
    });
  }

  stop() {
    this.sources.forEach(obj => {
      obj.audioStream.stop();
    });
  }

  updatePositions(normalizedMatrix) {
    this.sources.forEach((obj, index) => {
      const currentPosition = new Vector3();

      currentPosition.setFromMatrixPosition(normalizedMatrix);

      let { x, y, z } = currentPosition;

      x += this.sourcePositions[index].x;
      y += this.sourcePositions[index].y;
      z += this.sourcePositions[index].z;

      // obj.resonanceSource.setPosition(x, y, z);
      console.log('setting position', x, y, z);
      // console.log(currentPosition);
      // console.log(x, y, z);
    });
  }
}
