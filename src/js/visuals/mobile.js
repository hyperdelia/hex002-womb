import {
  Object3D,
} from 'three';

import MobileShape from './mobile-shape';

const SCALE_FACTOR = 10;

export default class Mobile extends Object3D {
  constructor(options) {
    super();

    const {
      density,
      origin, 
      stars,
    } = options;

    // Generate random mobile shapes
    this.shapes = stars.reduce((acc, star) => {
      if (Math.random() > density) {
        return acc;
      }

      // Place a shape at star position
      const shape = new MobileShape();
      shape.position.set(...star.p);

      // Calculate distance from origin and scale it accordingly
      const distance = shape.position.distanceTo(origin);
      const factor = Math.max(Math.log(distance / SCALE_FACTOR), 1);
      shape.scale.set(factor, factor, factor);
      
      // Add it
      this.add(shape);
      acc.push(shape);
      
      return acc;
    }, []);
  }
}
