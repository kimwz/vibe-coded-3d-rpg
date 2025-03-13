import { useState, useEffect } from "react";

interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  run: boolean;
}

export const useKeyboardControls = () => {
  const [keys, setKeys] = useState<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    run: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      
      switch (e.code) {
        case "KeyW":
          setKeys((keys) => ({ ...keys, forward: true }));
          break;
        case "KeyS":
          setKeys((keys) => ({ ...keys, backward: true }));
          break;
        case "KeyA":
          setKeys((keys) => ({ ...keys, left: true }));
          break;
        case "KeyD":
          setKeys((keys) => ({ ...keys, right: true }));
          break;
        case "Space":
          setKeys((keys) => ({ ...keys, jump: true }));
          break;
        case "ShiftLeft":
          setKeys((keys) => ({ ...keys, run: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          setKeys((keys) => ({ ...keys, forward: false }));
          break;
        case "KeyS":
          setKeys((keys) => ({ ...keys, backward: false }));
          break;
        case "KeyA":
          setKeys((keys) => ({ ...keys, left: false }));
          break;
        case "KeyD":
          setKeys((keys) => ({ ...keys, right: false }));
          break;
        case "Space":
          setKeys((keys) => ({ ...keys, jump: false }));
          break;
        case "ShiftLeft":
          setKeys((keys) => ({ ...keys, run: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return { keys };
};
