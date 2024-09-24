import { NearestFilter, RepeatWrapping, TextureLoader } from "three";

const loadTexture = (path) => {
  const texture = new TextureLoader().load(path);
  texture.magFilter = NearestFilter;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
};

export const dirtTexture = loadTexture("/textures/dirt.png");
export const grassTexture = loadTexture("/textures/grass.png");
export const glassTexture = loadTexture("/textures/glass.png");
export const woodTexture = loadTexture("/textures/wood.png");
export const logTexture = loadTexture("/textures/log.png");
export const groundTexture = loadTexture("/textures/grass.png");

groundTexture.repeat.set(100, 100);
