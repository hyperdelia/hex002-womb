import AudioBase from './audio-base';

export default class Buffer extends AudioBase {
  constructor(context, url) {
    super(context);
    this.url = url;
  }

  /**
   * Load and decode an audio file
   * @return {Promise<AudioBuffer>}
   */
  load() {
    return this.fetch()
      .then(arrayBuffer => {
        return this.decodeAudioData(arrayBuffer);
      })
      .catch(err => {
        console.error(err);
      });
  }

  /**
   * @private
   */
  fetch() {
    return fetch(this.url).then(response => {
      if (response.ok) {
        return response.arrayBuffer();
      }
      throw new Error('Failed to get resource:', this.url);
    });
  }

  /**
   * @private
   */
  decodeAudioData(arrayBuffer) {
    // iOS does not return promise from decodeAudioData, so we create it instead.
    return new Promise((resolve, reject) => {
      const success = (buffer) => resolve(buffer);
      const fail = (err) => reject(err);
      this.context.decodeAudioData(arrayBuffer, success, fail);
    });
  }
}
