import {
  Object3D,
} from 'three';

import { randomItem } from '../utils';

import MobileShape from './mobile-shape';

export default class Mobile extends Object3D {
  constructor(options) {
    super();

    const {
      density,
      maxDistance,
      origin,
      size,
      stars,
      textures,
    } = options;

    // Generate random mobile shapes
    this.shapes = stars.reduce((acc, star) => {
      if (Math.random() > density) {
        return acc;
      }

      // Place a shape at star position
      const shape = new MobileShape({
        texture: randomItem(textures),
      });
      shape.position.set(...star.p);

      // Calculate distance from origin and scale it accordingly
      let factor = size;
      let chance = 1;
      const distance = shape.position.distanceTo(origin);
      if (distance < maxDistance) { 
        factor = ((Math.sin((distance - (maxDistance / 2)) * Math.PI / maxDistance + 1) / 2)) * size;
        chance = Math.min(1, distance / maxDistance);
      }
      shape.scale.set(factor, factor, factor);

      // Add it when chances are high
      if (Math.random() < chance) {
        this.add(shape);
        acc.push(shape);
      }
      
      return acc;
    }, []);
  }

  animate() {
    this.shapes.forEach(shape => {
      shape.animate();
    });
  }
}
