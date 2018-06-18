import {
  TextureLoader,
} from 'three';

const ROOT_URL = 'https://world.inanimate.world';

export default function preload() {
  return fetch(ROOT_URL + '/index.json')
    .then(response => response.json())
    .then(data => {
      const samples = Object.keys(data.samples).reduce((acc, key) => {
        acc[key] = data.samples[key].map(url => ROOT_URL + url);
        return acc;
      }, {});

      const textureRequest = data.textures.map(url => {
        const loader = new TextureLoader();

        return new Promise((resolve, reject) => {
          loader.load(
            ROOT_URL + url,
            (texture) => { resolve(texture); },
            undefined,
            (e) => { reject(e); }
          );
        });
      });

      const starRequest = fetch(ROOT_URL + data.stars)
        .then(response => response.json())
        .catch(e => console.error(e));

      return Promise.all([
        starRequest,
        Promise.all(textureRequest),
      ])
        .then(result => {
          const [stars, textures] = result;

          return {
            stars,
            textures,
            samples,
          };
        });
    })
    .catch(e => console.error(e));
}
