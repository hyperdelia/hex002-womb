import {
  Math as ThreeMath,
  Object3D,
  Vector3,
} from 'three';

const PI_2 = Math.PI / 2;

export default class PointerLockControls {
  constructor(options, camera) {
    this.options = options;

    this.isEnabled = true;

    camera.rotation.set(0, 0, 0);

    this.pitchObject = new Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new Object3D();
    this.yawObject.add(this.pitchObject);

    this.velocity = new Vector3();

    this.directions = {
      backward: false,
      forward: false,
      left: false,
      right: false,
    };
  }

  movePointer(movementX, movementY) {
    if (!this.isEnabled) {
      return;
    }

    this.yawObject.rotation.y -= movementX * 0.002;
    this.pitchObject.rotation.x -= movementY * 0.002;
    this.pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, this.pitchObject.rotation.x)
    );
  }

  toggleDirections(directions) {
    this.directions = Object.assign({}, this.directions, directions);
  }

  update(delta) {
    if (!this.isEnabled) {
      return;
    }

    const { moveSpeed, stopSpeed } = this.options;
    const { x, y, z } = this.velocity;
    const { forward, backward, left, right } = this.directions;

    if (forward || backward) {
      let lat = ThreeMath.radToDeg(
        this.pitchObject.rotation.x
      ) * (forward ? 1 : -1);
      lat = Math.max(-85, Math.min(85, lat));

      const phi = ThreeMath.degToRad(90 - lat);
      const theta = ThreeMath.degToRad(forward ? -90 : 90);

      this.velocity.y = y + moveSpeed * Math.cos(phi) * delta;
      this.velocity.z = z + moveSpeed * Math.sin(phi) * Math.sin(theta) * delta;
    }

    if (left) {
      this.velocity.x -= moveSpeed * delta;
    }

    if (right) {
      this.velocity.x += moveSpeed * delta;
    }

    this.velocity.x -= x * stopSpeed * delta;
    this.velocity.y -= y * stopSpeed * delta;
    this.velocity.z -= z * stopSpeed * delta;

    this.yawObject.translateX(this.velocity.x * delta);
    this.yawObject.translateY(this.velocity.y * delta);
    this.yawObject.translateZ(this.velocity.z * delta);
  }

  get worldPosition() {
    return this.yawObject.getWorldPosition();
  }
}
