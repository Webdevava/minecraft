import { useBox } from "@react-three/cannon";
import { useState, useCallback } from "react";
import { useStore } from "@/hooks/useStore";
import * as textures from "../images/textures";

function Cube({ position, texture }) {
  const [isHovered, setIsHovered] = useState(false);
  const [ref] = useBox(() => ({
    type: "Static",
    position,
  }));
  const addCube = useStore((state) => state.addCube);
  const removeCube = useStore((state) => state.removeCube);

  const activeTexture = textures[`${texture}Texture`];

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      const clickedFace = Math.floor(e.faceIndex / 2);
      const { x, y, z } = ref.current.position;
      if (e.button === 0) {
        // Left click
        removeCube(x, y, z);
      } else if (e.button === 2) {
        // Right click
        const positions = [
          [x + 1, y, z],
          [x - 1, y, z],
          [x, y + 1, z],
          [x, y - 1, z],
          [x, y, z + 1],
          [x, y, z - 1],
        ];
        addCube(...positions[clickedFace]);
      }
    },
    [addCube, removeCube, ref]
  );

  return (
    <mesh
      onPointerMove={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onClick={handleClick}
      onContextMenu={handleClick}
      ref={ref}
    >
      <boxGeometry attach="geometry" />
      <meshStandardMaterial
        color={isHovered ? "grey" : "white"}
        map={activeTexture}
        transparent={texture === "glass"}
        opacity={texture === "glass" ? 0.6 : 1}
        attach="material"
      />
    </mesh>
  );
}

export default Cube;
