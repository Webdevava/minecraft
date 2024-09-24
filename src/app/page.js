"use client";

import { Canvas } from "@react-three/fiber";
import { Sky, PointerLockControls } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { Suspense, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Player from "@/components/Player";
import Ground from "@/components/Ground";
import Cubes from "@/components/Cubes";
import { useStore } from "@/hooks/useStore";

const textures = ["dirt", "grass", "wood", "glass", "log"];

export default function Home() {
  const addCube = useStore((state) => state.addCube);
  const setTexture = useStore((state) => state.setTexture);
  const [activeTextureIndex, setActiveTextureIndex] = useState(0);

  const selectTexture = useCallback(
    (index) => {
      setActiveTextureIndex(index);
      setTexture(textures[index]);
    },
    [setTexture]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (key >= "1" && key <= "5") {
        const index = parseInt(key) - 1;
        selectTexture(index);
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      setActiveTextureIndex((prevIndex) => {
        const newIndex =
          (prevIndex + (e.deltaY > 0 ? 1 : -1) + textures.length) %
          textures.length;
        setTexture(textures[newIndex]);
        return newIndex;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [selectTexture, setTexture]);

  return (
    <div className="w-screen h-screen">
      <Canvas shadows>
        <Sky sunPosition={[100, 100, 20]} />
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Physics>
            <Player />
            <Cubes />
            <Ground addCube={addCube} />
          </Physics>
        </Suspense>
        <PointerLockControls />
      </Canvas>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-4 h-4 border-2 border-white rounded-full"></div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg">
        <TooltipProvider>
          {textures.map((texture, index) => (
            <Tooltip key={texture}>
              <TooltipTrigger asChild>
                <Button
                  className={`w-16 h-16 ${
                    index === activeTextureIndex ? "ring-2 ring-white" : ""
                  }`}
                  style={{
                    backgroundImage: `url(/textures/${texture}.png)`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                  onClick={() => selectTexture(index)}
                >
                  <span className="absolute top-0 left-2 text-white text-shadow">
                    {index + 1}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{texture.charAt(0).toUpperCase() + texture.slice(1)}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 p-2 rounded-lg">
        Use number keys (1-5) or scroll to select blocks
      </div>
    </div>
  );
}
