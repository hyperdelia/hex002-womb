import '../scss/app.scss';

import Session from './session';
import View from './view';

const isDebugMode = window.location.href.includes('debug');

const session = new Session({
  isDebugMode,
});

const view = new View();

session.start()
  .then(() => {
    view.start();
  })
  .catch(error => {
    view.showError(error);
  });
