import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useMMD from '@/utils/useMMD'


export default function Snow幽潮(
  props:
    { position: [number, number, number], rotation: [number, number, number], scale?: number }
) {
  const mesh = useMMD('/Snowbreak/【尘白禁区】幽潮-灿阳一刻/幽潮-灿阳一刻.pmx',);
  const myGroup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (myGroup.current)
    {
      myGroup.current.rotation.y = clock.getElapsedTime();
      // myGroup.current.position.y = Math.sin(Math.PI * clock.getElapsedTime()) * 1.3 + props.position[1];
    }
  })

  const { scale = .4 } = props;
  return (
    <group {...props} dispose={null}>
      <group scale={scale} ref={myGroup}>
        <primitive 
          castShadow
          receiveShadow
          object={mesh} 
        />
      </group>
    </group>
  );
}