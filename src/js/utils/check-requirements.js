import modernizrTest from './modernizr-test';

const FEATURE_REQUIREMENTS = [
  'audio',
  'audioloop',
  'canvas',
  'requestanimationframe',
  'webaudio',
  'webgl',
];

export default function checkRequirements() {
  return new Promise((resolve, reject) => {
    const unsupportedFeature = modernizrTest(FEATURE_REQUIREMENTS);
    if (unsupportedFeature) {
      reject(
        new Error(`${unsupportedFeature} is not supported by your device.`)
      );
    } else {
      resolve();
    }
  });
}
