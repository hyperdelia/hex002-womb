export default class VirtualRealityControls {
  constructor(options) {
    this.options = options;
    this.isEnabled = true;
    this.camera = this.options.camera;
  }

  start() {
  }

  update() {
    if (!this.isEnabled) {
      return;
    }
  }

  setPosition(x, y, z) {
  }

  get playerWorldPosition() {
  }

  get playerWorldMatrix() {
  }
}
