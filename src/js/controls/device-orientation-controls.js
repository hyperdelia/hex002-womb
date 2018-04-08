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
  Quaternion,
  Vector3,
} from 'three';

const PARAMETERS = {
  alphaOffset: 0, // radians
  smoothing: 0.07,
};

export default class DeviceOrientationControls {
  constructor(options) {
    this.options = options;

    this.isEnabled = false;

    this.camera = this.options.camera;
    this.camera.rotation.set(0, 0, 0);
    this.camera.rotation.reorder('YXZ');

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.setObjectQuaternion = this.objectQuaternion();

    this.registerEvents();
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

  start() {
    this.isEnabled = true;
  }

  onOrientationChange() {
    this.screenOrientation = window.orientation || 0;
  }

  onDeviceOrientationChange(event) {
    this.deviceOrientation = event;
  }

  registerEvents() {
    // Run once on load
    this.onOrientationChange();

    window.addEventListener(
      'orientationchange',
      this.onOrientationChange.bind(this),
      false
    );
    window.addEventListener(
      'deviceorientation',
      this.onDeviceOrientationChange.bind(this),
      false
    );
  }

  update() {
    if (!this.isEnabled) {
      return;
    }

    const { degToRad } = ThreeMath;
    const { alphaOffset, smoothing } = PARAMETERS;

    const device = this.deviceOrientation;

    const alpha = device.alpha ? degToRad(device.alpha) + alphaOffset : 0; // Z
    const beta = device.beta ? degToRad(device.beta) : 0; // X'
    const gamma = device.gamma ? degToRad(device.gamma) : 0; // Y''
    const orient = this.screenOrientation ? degToRad(this.screenOrientation) : 0; // O

    const rotation = new Quaternion();
    this.setObjectQuaternion(rotation, alpha, beta, gamma, orient);
    this.camera.quaternion.slerp(rotation, smoothing);
  }

  setPosition(x, y, z) {
    this.camera.position.set(x, y, z);
  }

  get playerWorldPosition() {
    return this.camera.getWorldPosition(new Vector3());
  }

  get playerWorldMatrix() {
    return this.camera.matrixWorld;
  }
}
