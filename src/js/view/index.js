import modernizrTest from '../utils/modernizr-test';

const ELEMENT_IDS = [
  'error',
  'start',
  'view',
];

export default class View {
  constructor(options) {
    this.options = options;

    this.elements = ELEMENT_IDS.reduce((acc, id) => {
      acc[id] = document.getElementById(id);
      return acc;
    }, {});

    this.elements.view.classList.add(`view--is-${options.platform}`);

    this.registerEvents();
    this.isLoading = true;
  }

  get isLoading() {
    return this._isLoading;
  }

  set isLoading(bool) {
    this._isLoading = bool;

    if (this._isLoading) {
      this.elements.view.classList.add('view--is-loading');
    } else {
      this.elements.view.classList.remove('view--is-loading');
    }
  }

  registerEvents() {
    this.elements.start.addEventListener('click', () => {
      this.requestFullscreen();
    });

    [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange',
    ].forEach(eventName => {
      document.addEventListener(eventName, () => {
        this.onFullscreenChange();
      });
    });
  }

  onStart() {
    this.elements.view.classList.add('view--is-running');
    this.options.onStart();
  }

  onStop() {
    this.elements.view.classList.remove('view--is-running');
    this.options.onStop();
  }

  onFullscreenChange() {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      this.onStart();
    } else {
      this.onStop();
    }
  }

  showError(message, error) {
    this.elements.view.classList.add('view--is-error');
    this.elements.error.innerText = message + ' ❤';

    // don't stop if we get an error loading an audio file
    if (error !== undefined && error.name && error.name === 'AbortError') {
      return;
    }

    this.onStop();
  }

  showConnectionError() {
    this.showError(
      'Sorry, something went wrong during loading. Please check your internet connection and reload the page to try again.'
    );
  }

  showRequirementError(error) {
    this.showError(
      'Sorry, but it looks like this won\'t work on your browser. Please try it with another one. We recommend the latest version of Chrome or Firefox.',
      error
    );
  }

  requestFullscreen() {
    if (modernizrTest(['fullscreen'])) {
      this.onStart();
      return;
    }

    document.body.requestFullScreen = (
      document.body.requestFullScreen ||
      document.body.mozRequestFullScreen ||
      document.body.webkitRequestFullScreen
    );

    document.body.requestFullScreen();
  }
}
