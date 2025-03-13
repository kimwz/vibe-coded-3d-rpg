import { Plane } from "@react-three/drei";
import Character from "./Character";

const Scene = () => {
  return (
    <>
      {/* 조명 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <hemisphereLight intensity={0.35} />

      {/* 캐릭터 */}
      <Character />

      {/* 바닥 */}
      <Plane 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]} 
        args={[50, 50]}
        receiveShadow
      >
        <meshStandardMaterial color="#3a7e4c" />
      </Plane>
    </>
  );
};

export default Scene;
