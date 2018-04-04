import {
  Math as ThreeMath,
  Object3D,
  Vector3,
} from 'three';

const PI_2 = Math.PI / 2;
const MOVE_INTERVAL = 10;

const PARAMETERS = {
  moveSpeed: 25.0,
  rotateSpeed: 0.004,
  stopSpeed: 2.0,
};

export default class PointerControls {
  constructor(options) {
    this.options = options;

    this.isEnabled = false;
    this.isMoving = false;

    this.pointerPosition = {
      x: 0,
      y: 0,
    };

    this.registerEvents();

    this.camera = this.options.camera;
    this.camera.rotation.set(0, 0, 0);

    this.pitchObject = new Object3D();
    this.pitchObject.add(this.camera);

    this.yawObject = new Object3D();
    this.yawObject.add(this.pitchObject);

    this.velocity = new Vector3();
  }

  registerEvents() {
    const onMouseDown = () => {
      this.stopMoving();
    };

    const onMouseUp = () => {
      this.startMoving();
    };

    const onMouseMove = event => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = event.view;

      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;

      this.pointerPosition.x = x;
      this.pointerPosition.y = y;
    };

    window.addEventListener('touchstart', onMouseDown, false);
    window.addEventListener('touchend', onMouseUp, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('mousemove', onMouseMove, false);
  }

  start() {
    this.isEnabled = true;
    this.startMoving();

    window.setInterval(() => {
      const { x, y } = this.pointerPosition;
      this.movePointer(x, y);
    }, MOVE_INTERVAL);
  }

  /**
   * Changes the players direction relatively.
   * @param {float} horizontal - Movement force on X-axis (-1.0 - 1.0)
   * @param {float} vertical - Movement force on Y-axis (-1.0 - 1.0)
   */
  movePointer(horizontal, vertical) {
    if (!this.isEnabled) {
      return;
    }

    const { rotateSpeed } = PARAMETERS;

    this.yawObject.rotation.y -= horizontal * rotateSpeed;

    this.pitchObject.rotation.x -= vertical * rotateSpeed;
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

    const { moveSpeed, stopSpeed } = PARAMETERS;
    const { y, z } = this.velocity;

    if (this.isMoving) {
      let lat = ThreeMath.radToDeg(this.pitchObject.rotation.x);
      lat = Math.max(-85, Math.min(85, lat));

      const phi = ThreeMath.degToRad(90 - lat);
      const theta = ThreeMath.degToRad(-90);

      this.velocity.y = y + moveSpeed * Math.cos(phi) * delta;
      this.velocity.z = z + moveSpeed * Math.sin(phi) * Math.sin(theta) * delta;
    }

    this.velocity.y -= y * stopSpeed * delta;
    this.velocity.z -= z * stopSpeed * delta;

    this.yawObject.translateY(this.velocity.y * delta);
    this.yawObject.translateZ(this.velocity.z * delta);
  }

  setPosition(x, y, z) {
    this.yawObject.position.set(x, y, z);
  }

  get sceneObject() {
    return this.yawObject;
  }

  get playerWorldPosition() {
    return this.yawObject.getWorldPosition(new Vector3());
  }

  get playerWorldMatrix() {
    return this.camera.matrixWorld;
  }
}
