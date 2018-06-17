import {
  CatmullRomCurve3,
  DoubleSide,
  Mesh,
  MeshNormalMaterial,
  Shape,
  ShapeGeometry,
  Vector3,
} from 'three';

const DIVISIONS = 50;

export default class MobileShape extends Mesh {
  constructor() {
    const points = [
      new Vector3(-6, -10, 0),
      new Vector3(-6, 2, 0),
      new Vector3(-6, 12, 0),
      new Vector3(6, 2, 0),
      new Vector3(6, -10, 0),
    ];

    const curve = new CatmullRomCurve3(points);

    const shape = new Shape();
    shape.setFromPoints(curve.getPoints(DIVISIONS));

    const geometry = new ShapeGeometry(shape);

    const material = new MeshNormalMaterial({
      side: DoubleSide,
    });

    super(geometry, material);
  }
}
