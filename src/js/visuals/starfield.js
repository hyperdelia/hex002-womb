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

    const { stars, size, color, magnitude } = options;

    // Prepare positions and colors for BufferGeometry
    const convertedPositions = stars.reduce((acc, star) => {
      const [ x, y, z ] = star.p;
      acc.push(x * magnitude, y * magnitude, z * magnitude);
      return acc;
    }, []);

    const convertedColors = stars.reduce(acc => {
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
      size,
      vertexColors: VertexColors,
    });

    // Add starfield to object
    const points = new Points(geometry, material);
    this.add(points);
  }
}
