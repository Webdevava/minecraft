import { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { Vector3 } from "three";

const SPEED = 5;
const keys = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
};

const moveFieldByKey = (key) => keys[key];
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();
const speed = new Vector3();

const usePlayerControls = () => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });
  useEffect(() => {
    const handleKeyDown = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }));
    const handleKeyUp = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }));
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return movement;
};

export default function Player(props) {
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 1, 0],
  }));
  const pos = useRef([0, 0, 0]);
  useEffect(
    () => api.position.subscribe((p) => (pos.current = p)),
    [api.position]
  );
  const vel = useRef([0, 0, 0]);
  useEffect(
    () => api.velocity.subscribe((v) => (vel.current = v)),
    [api.velocity]
  );

  const { forward, backward, left, right, jump } = usePlayerControls();
  useFrame(() => {
    camera.position.copy(new Vector3(...pos.current));
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);
    speed.fromArray(vel.current);
    api.velocity.set(direction.x, vel.current[1], direction.z);
    if (jump && Math.abs(vel.current[1]) < 0.05)
      api.velocity.set(vel.current[0], 5, vel.current[2]);
  });
  return <mesh ref={ref} />;
}
