export default class VirtualRealityControls {
  constructor(options) {
    this.options = options;
    this.camera = this.options.camera;
    this.isEnabled = true;
  }

  start() {}

  update(delta) { // eslint-disable-line no-unused-vars
    if (!this.isEnabled) {
      return;
    }
  }

  setPosition(x, y, z) {} // eslint-disable-line no-unused-vars

  get position() {}

  get playerWorldPosition() {}

  get playerWorldMatrix() {}
}
