export default class Voice {
  constructor(options) {
    const {
      star,
      distance,
      sampleUrl,
    } = options;

    this.star = star;
    this.distance = distance;
    this.sampleUrl = sampleUrl;
  }
}
