"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamic imports for all components
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);
const Sky = dynamic(() => import("@react-three/drei").then((mod) => mod.Sky), {
  ssr: false,
});
const Physics = dynamic(
  () => import("@react-three/cannon").then((mod) => mod.Physics),
  { ssr: false }
);
const Button = dynamic(
  () => import("@/components/ui/button").then((mod) => mod.Button),
  { ssr: false }
);
const TooltipProvider = dynamic(
  () => import("@/components/ui/tooltip").then((mod) => mod.TooltipProvider),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("@/components/ui/tooltip").then((mod) => mod.Tooltip),
  { ssr: false }
);
const TooltipTrigger = dynamic(
  () => import("@/components/ui/tooltip").then((mod) => mod.TooltipTrigger),
  { ssr: false }
);
const TooltipContent = dynamic(
  () => import("@/components/ui/tooltip").then((mod) => mod.TooltipContent),
  { ssr: false }
);

const Ground = dynamic(() => import("@/components/Ground"), { ssr: false });
const Cubes = dynamic(() => import("@/components/Cubes"), { ssr: false });
const Player = dynamic(() => import("@/components/Player"), { ssr: false });
const PointerLockControls = dynamic(
  () => import("@react-three/drei").then((mod) => mod.PointerLockControls),
  { ssr: false }
);

const useStore = dynamic(
  () => import("@/hooks/useStore").then((mod) => mod.useStore),
  { ssr: false }
);

const textures = ["dirt", "grass", "wood", "glass", "log"];

export default function Home() {
  const [addCube, setAddCube] = useState(null);
  const [setTexture, setSetTexture] = useState(null);
  const [activeTextureIndex, setActiveTextureIndex] = useState(0);

  useEffect(() => {
    // Load store hook dynamically
    import("@/hooks/useStore").then((mod) => {
      const store = mod.useStore.getState();
      setAddCube(() => store.addCube);
      setSetTexture(() => store.setTexture);
    });
  }, []);

  const selectTexture = useCallback(
    (index) => {
      setActiveTextureIndex(index);
      setTexture && setTexture(textures[index]);
    },
    [setTexture]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
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
          setTexture && setTexture(textures[newIndex]);
          return newIndex;
        });
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("wheel", handleWheel);
      };
    }
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
