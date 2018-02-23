import {
  BufferGeometry,
  Float32BufferAttribute,
  Object3D,
  Points,
  PointsMaterial,
  VertexColors,
} from 'three';

export default class Starfield extends Object3D {
  constructor(options) {
    super();

    const { positions, color } = options;

    // Prepare positions and colors for BufferGeometry
    const convertedPositions = positions.reduce((acc, position) => {
      const { x, y, z } = position;
      acc.push(x, y, z);
      return acc;
    }, []);

    const convertedColors = positions.reduce(acc => {
      acc.push(color.r, color.g, color.b);
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
      size: 15,
      vertexColors: VertexColors,
    });

    // Add starfield to object
    const points = new Points(geometry, material);
    this.add(points);
  }
}
