import {
  CatmullRomCurve3,
  DoubleSide,
  Mesh,
  MeshNormalMaterial,
  Shape,
  ShapeGeometry,
  Vector3,
} from 'three';

import randomRange from '../utils/random-range';

const CHANGE_PROPABILITY = 0.0005;
const CURVE_DIVISIONS = 70;
const CURVE_TENSION = 0.3;
const SHAPE_RANDOMNESS = 0.7;
const MIN_SPEED = 0.0007;
const MAX_SPEED = 0.003;

export default class MobileShape extends Mesh {
  constructor() {
    // Path for a simple rectangle shape
    const rectangle = [
      new Vector3(1, 0, 0),
      new Vector3(1, 1, 0),
      new Vector3(1, 2, 0),
      new Vector3(0, 2, 0),
      new Vector3(-1, 2, 0),
      new Vector3(-1, 1, 0),
      new Vector3(-1, 0, 0),
      new Vector3(-1, -1, 0),
      new Vector3(-1, -2, 0),
      new Vector3(0, -2, 0),
      new Vector3(1, -2, 0),
      new Vector3(1, -1, 0),
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
    const material = new MeshNormalMaterial({
      side: DoubleSide,
    });

    // Create mesh
    super(geometry, material);

    // Give it an initial rotation, speed and direction
    this.rotateY(randomRange(0, Math.PI * 2));
    this.randomSpin();
  }

  randomSpin() {
    this.speed = randomRange(MIN_SPEED, MAX_SPEED);
    this.direction = (Math.random() < 0.5) ? false : true;
  }

  animate() {
    this.rotateY(this.direction ? this.speed : -this.speed);

    if (Math.random() < CHANGE_PROPABILITY) {
      this.randomSpin();
    }
  }
}
