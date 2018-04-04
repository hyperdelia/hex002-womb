import '../scss/app.scss';

import Session from './session';
import View from './view';

import checkRequirements from './utils/check-requirements';
import identifyPlatform from './utils/identify-platform';

const canvas = document.getElementById('visuals');
const isDebugMode = window.location.href.includes('debug');

identifyPlatform()
  .then(platform => {
    const session = new Session({
      canvas,
      isDebugMode,
      platform,
    });

    const view = new View({
      platform,
      onStart: () => {
        session.start();
      },
    });

    checkRequirements()
      .then(() => {
        session.prepare();
      })
      .catch(error => {
        view.showError(error);
      });
  });
