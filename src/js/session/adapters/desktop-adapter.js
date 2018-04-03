const MOVE_INTERVAL = 10;

export default class DesktopAdapter {
  constructor(options) {
    this.options = options;

    this.isMoving = false;

    this.pointerPosition = {
      x: 0,
      y: 0,
    };

    this.registerEvents();
  }

  registerEvents() {
    const onMouseDown = () => {
      if (!this.isMoving) {
        this.options.onStart();
      } else {
        this.options.onStop();
      }
    };

    const onMouseUp = () => {
      if (this.isMoving) {
        this.options.onStart();
      }
    };

    const onMouseMove = event => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = event.view;

      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;

      this.pointerPosition.x = x;
      this.pointerPosition.y = y;
    };

    window.addEventListener('touchstart', onMouseDown, false);
    window.addEventListener('touchend', onMouseUp, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('mousemove', onMouseMove, false);
  }

  start() {
    this.isMoving = true;

    window.setInterval(() => {
      if (!this.isMoving) {
        return;
      }

      const { x, y } = this.pointerPosition;
      this.options.onMove(x, y);
    }, MOVE_INTERVAL);
  }
}
