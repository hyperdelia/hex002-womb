import {
  BufferGeometry,
  Float32BufferAttribute,
  Object3D,
  Points,
  PointsMaterial,
  VertexColors,
} from 'three';

import { randomRange } from '../utils';

function shuffleAndGroup(stars, groupNum) {
  const groups = [];

  for (let i = 0; i < groupNum; i += 1) {
    groups.push([]);
  }

  stars.forEach(star => {
    groups[Math.floor(Math.random() * groups.length)].push(star);
  });

  return groups;
}

export default class Starfield extends Object3D {
  constructor(options) {
    super();

    const { stars, textures, size } = options;

    // Group stars in separate starfields for individual textures
    const starGroups = shuffleAndGroup(stars, textures.length);

    starGroups.forEach((starGroup, index) => {
      // Prepare positions and colors for BufferGeometry
      const convertedPositions = starGroup.reduce((acc, star) => {
        acc.push(...star.p);
        return acc;
      }, []);

      const convertedColors = starGroup.reduce(acc => {
        acc.push(0, 0, 0);
        return acc;
      }, []);

      // Define buffer geometry
      const geometry = new BufferGeometry();

      geometry.addAttribute('position', new Float32BufferAttribute(
        convertedPositions,
        3
      ));

      geometry.addAttribute('color', new Float32BufferAttribute(
        convertedColors,
        3
      ));

      geometry.computeBoundingSphere();

      // Define material
      const material = new PointsMaterial({
        map: textures[index],
        size: randomRange(size / 2, size + (size / 2)),
        transparent: true,
        vertexColors: VertexColors,
      });

      // Add starfield group to object
      const points = new Points(geometry, material);
      this.add(points);
    });
  }
}
