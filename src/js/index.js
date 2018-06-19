import '../scss/app.scss';
import '../img/favicon.ico';
import '../img/womb.jpg';

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
        session.start(
          () => {
            view.showError();
          }
        );
      },
      onStop: () => {
        session.stop();
      },
    });

    const checkup = checkRequirements()
      .then(() => {
        session.prepare();
      })
      .then(() => {
        view.isLoading = false;
      });

    if (!isDebugMode) {
      checkup.catch(() => {
        view.showError();
      });
    }
  });
