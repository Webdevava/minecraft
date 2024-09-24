import { usePlane } from "@react-three/cannon";
import { useCallback } from "react";
import { NearestFilter, RepeatWrapping, TextureLoader } from "three";

const loadTexture = (path) => {
  const texture = new TextureLoader().load(path);
  texture.magFilter = NearestFilter;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
};

const groundTexture = loadTexture("/textures/grass.png");
groundTexture.repeat.set(100, 100);

export default function Ground(props) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      const [x, y, z] = Object.values(e.point).map(Math.ceil);
      props.addCube(x, y, z);
    },
    [props.addCube]
  );

  return (
    <mesh onClick={handleClick} ref={ref}>
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" map={groundTexture} />
    </mesh>
  );
}
