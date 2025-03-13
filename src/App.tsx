import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./App.css";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }}>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 60 }}>
        <Scene />
      </Canvas>
      <div className="controls-info">
        <p>WASD: 이동</p>
        <p>Shift: 달리기</p>
      </div>
    </div>
  );
}

export default App;
