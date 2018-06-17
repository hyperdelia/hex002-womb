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
      this.onStart();
    });
  }

  onStart() {
    this.elements.view.classList.add('view--is-running');
    this.options.onStart();
  }

  showError(error) {
    this.elements.view.classList.add('view--is-error');
    this.elements.error.innerText = error;
  }
}
