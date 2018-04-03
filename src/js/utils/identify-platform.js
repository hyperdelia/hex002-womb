import modernizrTest from './modernizr-test';

const PLATFORM_FEATURES = {
  mobile: [
    'deviceorientation',
    'touchevents',
  ],
  vr: [
    'vrdisplays',
  ],
};

const DEFAULT_PLATFORM = 'desktop';

export default function identifyPlatform() {
  return new Promise(resolve => {
    const platform = Object.keys(PLATFORM_FEATURES).find(platform => {
      return !modernizrTest(PLATFORM_FEATURES[platform]);
    });

    // Check if we have at least one VR Display given
    if (platform === 'vr') {
      window.navigator.getVRDisplays().then(displays => {
        if (displays.length > 0) {
          resolve(platform);
        } else {
          resolve(DEFAULT_PLATFORM);
        }
      });
      return;
    }

    if (platform) {
      resolve(platform);
      return;
    }

    resolve(DEFAULT_PLATFORM);
  });
}
