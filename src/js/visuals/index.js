import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

export default class Visuals {
  constructor(options) {
    const { width, height, canvas } = options;

    // Create a scene
    this.scene = new Scene();

    // Create a camera
    this.camera = new PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );

    // Initialise the renderer
    this.renderer = new WebGLRenderer({
      canvas,
    });
    this.resize(width, height);
  }

  resize(width, height) {
    this.camera.aspect = width / height;

    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.renderer.render(this.scene, this.camera);
  }
}
