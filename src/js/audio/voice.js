export default class Voice {
  constructor(options) {
    const {
      distance,
      sampleUrl,
      star,
    } = options;

    this.distance = distance;
    this.sampleUrl = sampleUrl;
    this.star = star;
  }
}
