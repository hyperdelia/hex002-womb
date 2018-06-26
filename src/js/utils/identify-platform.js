import modernizrTest from './modernizr-test';

const PLATFORM_FEATURES = {
  mobile: [
    'deviceorientation',
    'touchevents',
  ],
};

const DEFAULT_PLATFORM = 'desktop';

export default function identifyPlatform() {
  return new Promise(resolve => {
    const platform = Object.keys(PLATFORM_FEATURES).find(platform => {
      return !modernizrTest(PLATFORM_FEATURES[platform]);
    });

    if (platform) {
      resolve(platform);
      return;
    }

    resolve(DEFAULT_PLATFORM);
  });
}
