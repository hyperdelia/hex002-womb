import {
  TextureLoader,
} from 'three';

const rootUrl = 'https://world.inanimate.world';

export default function preload() {
  return fetch(rootUrl + '/index.json')
    .then(response => response.json())
    .then(data => {
      const samples = Object.keys(data.samples).reduce((acc, key) => {
        acc[key] = data.samples[key].map(url => rootUrl + url);
        return acc;
      }, {});

      const textureRequest = data.textures.map(url => {
        const loader = new TextureLoader();

        return new Promise((resolve, reject) => {
          loader.load(
            rootUrl + url,
            (texture) => { resolve(texture); },
            undefined,
            (e) => { reject(e); }
          );
        });
      });

      const starRequest = fetch(rootUrl + data.stars)
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
