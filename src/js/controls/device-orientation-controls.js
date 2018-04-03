/**
 * Based on:
 * https://github.com/mrdoob/three.js/blob/master/examples/js/controls/DeviceOrientationControls.js
 *
 * MIT License
 *
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 */

import {
  Euler,
  Math as ThreeMath,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';

export default class DeviceOrientationControls {
  constructor(options) {
    this.options = options;

    this.isEnabled = false;
    this.isMoving = false;

    this.camera = this.options.camera;
    this.camera.rotation.set(0, 0, 0);
    this.camera.rotation.reorder('YXZ');

    this.deviceOrientation = {};
    this.screenOrientation = 0;
    this.alphaOffset = 0; // radians

    this.pitchObject = new Object3D();
    this.pitchObject.add(this.camera);

    this.yawObject = new Object3D();
    this.yawObject.add(this.pitchObject);

    this.velocity = new Vector3();

    this.setObjectQuaternion = this.objectQuaternion();
    this.connect();
  }

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
  objectQuaternion() {
    const zee = new Vector3(0, 0, 1);
    const euler = new Euler();
    const q0 = new Quaternion();
    const q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return (quaternion, alpha, beta, gamma, orient) => {
      euler.set(beta, alpha, - gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
      quaternion.setFromEuler(euler); // orient the device
      quaternion.multiply(q1); // camera looks out the back of the device, not the top
      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    };
  }

  onDeviceOrientationChangeEvent(event) {
    this.deviceOrientation = event;
  }

  onScreenOrientationChangeEvent() {
    this.screenOrientation = window.orientation || 0;
  }

  connect() {
    this.onScreenOrientationChangeEvent(); // run once on load

    window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent.bind(this), false);
    window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent.bind(this), false);

    this.isEnabled = true;
  }

  disconnect() {
    window.removeEventListener('orientationchange', this.onScreenOrientationChangeEvent.bind(this), false);
    window.removeEventListener('deviceorientation', this.onDeviceOrientationChangeEvent.bind(this), false);

    this.isEnabled = false;
  }

  update() {
    if (!this.isEnabled) {
      return;
    }

    const device = this.deviceOrientation;

    if (device) {
      const alpha = device.alpha ? ThreeMath.degToRad(device.alpha) + this.alphaOffset : 0; // Z
      const beta = device.beta ? ThreeMath.degToRad(device.beta) : 0; // X'
      const gamma = device.gamma ? ThreeMath.degToRad(device.gamma) : 0; // Y''
      const orient = this.screenOrientation ? ThreeMath.degToRad(this.screenOrientation) : 0; // O

      this.setObjectQuaternion(this.camera.quaternion, alpha, beta, gamma, orient);
    }
  }

  startMoving() {
    this.isMoving = true;
  }

  stopMoving() {
    this.isMoving = false;
  }

  get playerWorldPosition() {
    return this.yawObject.getWorldPosition();
  }

  get playerWorldMatrix() {
    return this.camera.matrixWorld;
  }
}
