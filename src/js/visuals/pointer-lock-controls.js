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
    this.isMoving = false;

    camera.rotation.set(0, 0, 0);

    this.pitchObject = new Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new Object3D();
    this.yawObject.add(this.pitchObject);

    this.velocity = new Vector3();
  }

  movePointer(movementX, movementY) {
    if (!this.isEnabled) {
      return;
    }

    const { rotateSpeed } = this.options;

    const x = movementX > 0 ? rotateSpeed : -rotateSpeed;
    const y = movementY > 0 ? rotateSpeed : -rotateSpeed;

    this.yawObject.rotation.y -= movementX !== 0 ? x : 0;
    this.pitchObject.rotation.x -= movementY !== 0 ? y : 0;
    this.pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, this.pitchObject.rotation.x)
    );
  }

  startMoving() {
    this.isMoving = true;
  }

  stopMoving() {
    this.isMoving = false;
  }

  update(delta) {
    if (!this.isEnabled) {
      return;
    }

    const { moveSpeed, stopSpeed } = this.options;
    const { x, y, z } = this.velocity;

    if (this.isMoving) {
      let lat = ThreeMath.radToDeg(this.pitchObject.rotation.x);
      lat = Math.max(-85, Math.min(85, lat));

      const phi = ThreeMath.degToRad(90 - lat);
      const theta = ThreeMath.degToRad(-90);

      this.velocity.y = y + moveSpeed * Math.cos(phi) * delta;
      this.velocity.z = z + moveSpeed * Math.sin(phi) * Math.sin(theta) * delta;
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
