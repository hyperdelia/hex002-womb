import {
  TextureLoader,
} from 'three';

const ROOT_URL = 'https://world.inanimate.world';

function preloadTextures(urls) {
  const promises = urls.map(url => {
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

  return Promise.all(promises);
}

export default function preload() {
  return fetch(ROOT_URL + '/index.json')
    .then(response => response.json())
    .then(data => {
      const samples = Object.keys(data.samples).reduce((acc, key) => {
        acc[key] = data.samples[key].map(url => ROOT_URL + url);
        return acc;
      }, {});

      const starsRequest = fetch(ROOT_URL + data.stars)
        .then(response => response.json());

      return Promise.all([
        starsRequest,
        preloadTextures(data.textures.stars),
        preloadTextures(data.textures.mobile),
      ])
        .then(result => {
          const [stars, texturesStars, texturesMobile] = result;
          const textures = { stars: texturesStars, mobile: texturesMobile };

          return {
            stars,
            textures,
            samples,
          };
        });
    });
}
