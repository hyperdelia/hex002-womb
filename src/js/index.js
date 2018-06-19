import '../scss/app.scss';

import Session from './session';
import View from './view';

import checkRequirements from './utils/check-requirements';
import identifyPlatform from './utils/identify-platform';

import {
  STATUS_BUFFERING,
  STATUS_PREFETCH,
  STATUS_READY,
} from './audio/status-events';

const canvas = document.getElementById('visuals');
const isDebugMode = window.location.href.includes('debug');

const statusCallback = (state) => {
  switch (state) {
    case STATUS_READY: {
      break;
    }
    case STATUS_PREFETCH: {
      break;
    }
    case STATUS_BUFFERING: {
      break;
    }
  }
};

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
        session.start(statusCallback);
      },
    });

    const checkup = checkRequirements()
      .then(() => session.prepare())
      .then(() => {
        view.isLoading = false;
      });

    if (!isDebugMode) {
      checkup.catch(error => {
        view.showError(error);
      });
    }
  });
