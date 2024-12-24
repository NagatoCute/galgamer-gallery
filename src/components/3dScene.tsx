import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import * as THREE from "three";
import { Subject } from 'rxjs';

export default function Scene() {
  return (
    <Canvas
      camera={{  // 默認值
        position: [0, 10, 30],
        fov: 75,
        near: 0.1,
        far: 1000,
      }}
    >
      {/* 光照 */}
      <ambientLight color={0x606060} intensity={1} />
      <directionalLight color={0xbcd2ee} position={[1, 0.75, 0.5]} intensity={1} />

      {/* 方塊 */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color={0xffff00} />
      </mesh>

      <gridHelper args={[100, 20, 0xff0000, 0x000000]} /> {/* 地面 */}
      <axesHelper args={[30]} /> {/* 坐标轴 */}
      {/* 牆 */}
      <gridHelper args={[100, 20, 0x00ff00, 0x000000]} position={[-50, 50, 0]} rotation={[0, 0, Math.PI / 2]} />
      <gridHelper args={[100, 20, 0x00ff00, 0x000000]} position={[50, 50, 0]} rotation={[0, 0, Math.PI / 2]} />

      <CameraPosition position={[10, 10, 10]} />
      <CameraRotation />
    </Canvas>
  );
}


function CameraPosition(
  { position }: { position: [number, number, number] }
) {
  const [x, y, z] = position;
  useFrame(({ camera }, delta, frame) => {
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
  });
  return <></>;
}

function CameraRotation() {
  const accDelta = useRef([0, 0]);
  const ratio = 0.002;

  useDrag(({ delta: [x, y] }) => {
    accDelta.current[0] += x * ratio;
    accDelta.current[1] += y * ratio;
  }, { target: window });

  useFrame(({ camera }) => {
    let [deltaX, deltaY] = accDelta.current;
    // 防止攝影機在垂直方向上旋轉超過90度
    const current = camera.getWorldDirection(new THREE.Vector3());
    if (current.y + deltaY > 1) {
      deltaY = 1 - current.y;
    } else if (current.y + deltaY < -1) {
      deltaY = -1 - current.y;
    }

    camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), deltaY);
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaX);
    // Reset accumulated delta
    accDelta.current = [0, 0];
  });

  return <></>;
}
