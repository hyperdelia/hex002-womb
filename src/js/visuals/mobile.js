import {
  Object3D,
} from 'three';

import MobileShape from './mobile-shape';

export default class Mobile extends Object3D {
  constructor(options) {
    super();

    const {
      count,
    } = options;

    // Generate random mobile shapes
    this.shapes = [];

    for (let i = 0; i < count; i += 1) {
      const shape = new MobileShape();
      shape.position.set(0, 0, 0);
      this.add(shape);
    }
  }
}
