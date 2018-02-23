/**
 * Base class for all audio classes.
 * All WebAudio aware classes in this project should
 * inherit this base class to ensure that a valid
 * AudioContext is passed in to the constructor of
 * the subclass.
 */
export default class AudioBase {
  /**
   * @param {object} context - The current AudioContext
   */
  constructor(context) {
    if (!context) {
      throw new Error('No AudioContext found.');
    }

    this.context = context;
  }
}
