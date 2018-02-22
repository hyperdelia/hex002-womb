import {
  BufferGeometry,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  VertexColors,
  WebGLRenderer,
} from 'three';

import { objectToVector3 } from '../helpers/converters';

export default class Visuals {
  constructor(options) {
    const { width, height, canvas, stars } = options;

    this.stars = stars;

    // Create a scene
    this.scene = new Scene();

    // Create a camera
    this.camera = new PerspectiveCamera(
      27,
      width / height,
      5,
      3500
    );

    this.camera.position.z = 2750;

    // Initialise the renderer
    this.renderer = new WebGLRenderer({
      canvas,
    });
    this.resize(width, height);

    // Create stars
    const colors = [];
    const geometry = new BufferGeometry();
    const positions = stars.reduce((acc, star) => {
      const { x, y, z } = star.position;
      colors.push(1, 1, 1);
      acc.push(x, y, z);
      return acc;
    }, []);

    geometry.addAttribute('position', new Float32BufferAttribute(
      positions,
      3
    ));

    geometry.addAttribute('color', new Float32BufferAttribute(
      colors,
      3
    ));

    geometry.computeBoundingSphere();

    const material = new PointsMaterial({
      size: 15,
      vertexColors: VertexColors,
    });
    const points = new Points(geometry, material);

    this.scene.add(points);

    this.animate();
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => { this.animate(); });

    this.renderer.render(this.scene, this.camera);
  }

  get distances() {
    return this.stars.map(star => {
      const distance = this.camera.position.distanceTo(objectToVector3(star.position));

      return {
        star,
        distance,
      };
    });
  }
}
