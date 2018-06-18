import {
  CatmullRomCurve3,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Shape,
  ShapeGeometry,
  MirroredRepeatWrapping,
  Vector3,
} from 'three';

import randomRange from '../utils/random-range';

const CHANGE_PROPABILITY = 0.0005;
const CURVE_DIVISIONS = 70;
const CURVE_TENSION = 0.3;
const SHAPE_RANDOMNESS = 0.6;
const SIZE_MAX = 10;
const SIZE_MIN = 1;
const SPEED_MAX = 0.001;
const SPEED_MIN = 0.0007;
const TEXTURE_SIZE = 0.1;

export default class MobileShape extends Mesh {
  constructor(options) {
    const { texture } = options;

    // Pick a random height and weight
    const width = randomRange(SIZE_MIN, SIZE_MAX);
    const height = randomRange(SIZE_MIN, SIZE_MAX);

    // Path for a simple rectangle shape
    const rectangle = [
      new Vector3(width, 0, 0),
      new Vector3(width, height / 2, 0),
      new Vector3(width, height, 0),
      new Vector3(0, height, 0),
      new Vector3(-width, height, 0),
      new Vector3(-width, height / 2, 0),
      new Vector3(-width, 0, 0),
      new Vector3(-width, -height / 2, 0),
      new Vector3(-width, -height, 0),
      new Vector3(0, -height, 0),
      new Vector3(width, -height, 0),
      new Vector3(width, -height / 2, 0),
    ];

    // Randomize path a little bit
    const points = rectangle.map(point => {
      point.x *= randomRange(1 - SHAPE_RANDOMNESS, 1);
      point.y *= randomRange(1 - SHAPE_RANDOMNESS, 1);
      return point;
    });

    // Draw lines between these points
    const curve = new CatmullRomCurve3(points);
    curve.closed = true;
    curve.tension = CURVE_TENSION;

    // Make a geometry out of this shape
    const shape = new Shape();
    shape.setFromPoints(curve.getPoints(CURVE_DIVISIONS));
    const geometry = new ShapeGeometry(shape);

    // Give it a texture
    texture.wrapS = MirroredRepeatWrapping;
    texture.wrapT = MirroredRepeatWrapping;
    texture.repeat.set(TEXTURE_SIZE, TEXTURE_SIZE);
    
    const material = new MeshBasicMaterial({
      side: DoubleSide,
      map: texture,
    });

    // Create mesh
    super(geometry, material);

    // Give it an initial rotation, speed and direction
    this.rotateY(randomRange(0, Math.PI * 2));
    this.randomSpin();
  }

  randomSpin() {
    this.speed = randomRange(SPEED_MIN, SPEED_MAX);
    this.direction = (Math.random() < 0.5) ? false : true;
  }

  animate() {
    this.rotateY(this.direction ? this.speed : -this.speed);

    if (Math.random() < CHANGE_PROPABILITY) {
      this.randomSpin();
    }
  }
}
