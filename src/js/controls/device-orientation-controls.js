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

    this.registerEvents();
    this.updateScreenOrientation();
  }

  start() {
    this.isEnabled = true;
  }

  registerEvents() {
    const onOrientationChange = () => {
      this.updateScreenOrientation();
    };

    const onDeviceOrientation = event => {
      this.deviceOrientation = event;
    };

    window.addEventListener('orientationchange', onOrientationChange, false);
    window.addEventListener('deviceorientation', onDeviceOrientation, false);
  }

  updateScreenOrientation() {
    this.screenOrientation = window.orientation || 0;
  }

  calculateQuaternion(alpha, beta, gamma, orient) {
    const zee = new Vector3(0, 0, 1);
    const q0 = new Quaternion();
    const q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

    const euler = new Euler();
    euler.set(beta, alpha, -gamma, 'YXZ');

    const quaternion = new Quaternion();
    quaternion.setFromEuler(euler);
    quaternion.multiply(q1);
    quaternion.multiply(q0.setFromAxisAngle(zee, -orient));

    return quaternion;
  }

  update() {
    if (!this.isEnabled) {
      return;
    }

    const { screenOrientation } = this;
    const { degToRad } = ThreeMath;
    const { alphaOffset, smoothing } = PARAMETERS;
    const { alpha: a, beta: b, gamma: g } = this.deviceOrientation;

    const alpha = a ? (degToRad(a) + alphaOffset) : 0;
    const beta = b ? degToRad(b) : 0;
    const gamma = g ? degToRad(g) : 0;
    const orient = screenOrientation ? degToRad(screenOrientation) : 0;
    const rotation = this.calculateQuaternion(alpha, beta, gamma, orient);

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
