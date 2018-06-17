import {
  TextureLoader,
} from 'three';

const assetsUrl = 'http://world.inanimate.world';

export default function preload() {
  const data = fetch(assetsUrl)
    .then(response => response.json)
    .catch(e => console.error(e));

  const samples = data.samples;

  const textures = data.textures.map(url => {
    const loader = new TextureLoader();

    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (texture) => { resolve(texture); },
        undefined,
        (e) => { reject(e); }
      );
    });
  });

  const stars = fetch(data.stars)
    .then(response => response.json)
    .catch(e => console.error(e));

  return Promise.all([ stars, textures ])
    .then(() => {
      return {
        stars,
        textures,
        samples,
      };
    });
}
