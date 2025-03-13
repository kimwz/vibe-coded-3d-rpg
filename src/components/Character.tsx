import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group, AnimationMixer, Vector3, Quaternion, Euler } from "three";
import { useKeyboardControls } from "./useKeyboardControls";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

// 캐릭터 모델 및 애니메이션 URL
const CHARACTER_MODEL_URL = "https://agent8-games.verse8.io/assets/3d/characters/commando.glb";

// 애니메이션 상태 정의
enum AnimationState {
  IDLE = "idle",
  WALK = "walk",
  RUN = "run",
}

const Character = () => {
  const characterRef = useRef<Group>(null);
  const { scene: originalScene, animations } = useGLTF(CHARACTER_MODEL_URL);
  
  const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.IDLE);
  const mixer = useRef<AnimationMixer | null>(null);
  const animationActions = useRef<Record<string, any>>({});
  
  const { camera } = useThree();
  const { keys } = useKeyboardControls();
  
  const moveSpeed = 0.05;
  const runSpeed = 0.1;
  const rotationSpeed = 0.1;
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());
  
  // 캐릭터 초기화
  useEffect(() => {
    if (!characterRef.current || !originalScene) return;
    
    // SkeletonUtils를 사용하여 모델 복제 (스켈레톤 포함)
    const model = SkeletonUtils.clone(originalScene);
    
    // 기존 자식 요소 제거
    while (characterRef.current.children.length > 0) {
      characterRef.current.remove(characterRef.current.children[0]);
    }
    
    // 새 모델 추가
    characterRef.current.add(model);
    
    // 애니메이션 설정
    if (animations && animations.length > 0) {
      mixer.current = new AnimationMixer(model);
      
      // 모든 애니메이션 액션 생성
      animations.forEach(clip => {
        const action = mixer.current?.clipAction(clip);
        if (action) {
          animationActions.current[clip.name] = action;
          
          // 기본적으로 모든 애니메이션 비활성화
          action.enabled = false;
          action.setEffectiveTimeScale(1);
          action.setEffectiveWeight(1);
        }
      });
      
      // 초기 애니메이션 설정 (idle)
      if (animationActions.current[AnimationState.IDLE]) {
        animationActions.current[AnimationState.IDLE].enabled = true;
        animationActions.current[AnimationState.IDLE].play();
      }
    }
    
    // 카메라 위치 설정
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 1, 0);
  }, [originalScene, animations, camera]);
  
  // 애니메이션 상태 변경 함수
  const changeAnimation = (newState: AnimationState) => {
    if (animationState === newState) return;
    
    // 현재 애니메이션 비활성화
    if (animationActions.current[animationState]) {
      animationActions.current[animationState].enabled = false;
    }
    
    // 새 애니메이션 활성화
    if (animationActions.current[newState]) {
      animationActions.current[newState].enabled = true;
      animationActions.current[newState].reset();
      animationActions.current[newState].play();
      setAnimationState(newState);
    }
  };
  
  // 매 프레임마다 실행
  useFrame((_, delta) => {
    if (!characterRef.current || !mixer.current) return;
    
    // 애니메이션 업데이트
    mixer.current.update(delta);
    
    // 이동 방향 계산
    const isMoving = keys.forward || keys.backward || keys.left || keys.right;
    const isRunning = keys.run && isMoving;
    
    // 애니메이션 상태 관리
    if (isMoving) {
      changeAnimation(isRunning ? AnimationState.RUN : AnimationState.WALK);
    } else {
      changeAnimation(AnimationState.IDLE);
    }
    
    // 이동 로직
    direction.current.set(0, 0, 0);
    
    if (keys.forward) direction.current.z -= 1;
    if (keys.backward) direction.current.z += 1;
    if (keys.left) direction.current.x -= 1;
    if (keys.right) direction.current.x += 1;
    
    if (direction.current.length() > 0) {
      direction.current.normalize();
      
      // 이동 방향으로 캐릭터 회전
      if (direction.current.x !== 0 || direction.current.z !== 0) {
        const angle = Math.atan2(direction.current.x, direction.current.z);
        const targetRotation = new Quaternion().setFromEuler(
          new Euler(0, angle, 0)
        );
        characterRef.current.quaternion.slerp(targetRotation, rotationSpeed);
      }
      
      // 캐릭터 이동
      const currentSpeed = isRunning ? runSpeed : moveSpeed;
      velocity.current.set(
        direction.current.x * currentSpeed,
        0,
        direction.current.z * currentSpeed
      );
      
      characterRef.current.position.add(velocity.current);
      
      // 카메라 위치 업데이트 (캐릭터 뒤에 고정)
      const cameraOffset = new Vector3(0, 2, 5);
      const cameraPosition = characterRef.current.position.clone().add(cameraOffset);
      camera.position.copy(cameraPosition);
      camera.lookAt(characterRef.current.position.clone().add(new Vector3(0, 1, 0)));
    }
  });
  
  return <group ref={characterRef} position={[0, 0, 0]} />;
};

export default Character;
