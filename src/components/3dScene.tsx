import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import * as THREE from "three";
import { Subject, map, filter, pipe, scan, merge } from 'rxjs';

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

      <gridHelper args={[100, 20, 0xff0000, 0x808080]} /> {/* 地面 */}
      <axesHelper args={[30]} /> {/* 坐标轴 */}
      {/* 牆 */}
      <gridHelper args={[100, 20, 0x00ff00, 0x808080]} position={[-50, 50, 0]} rotation={[0, 0, Math.PI / 2]} />
      <gridHelper args={[100, 20, 0x00ff00, 0x808080]} position={[50, 50, 0]} rotation={[0, 0, Math.PI / 2]} />

      <CameraPosition  />
      <CameraRotation />
    </Canvas>
  );
}


function CameraPosition() {
  const direction = useKeyboardMoving();
  const speed = 30;
  useFrame(({ camera }, delta, frame) => {
    const [front, side] = direction; // 之後要歸一化
    const currentAngle = camera.getWorldDirection(new THREE.Vector3());
    let currentPos = camera.position.clone();

    // 前進後退
    currentPos.add(currentAngle.multiplyScalar(front * speed * delta));
    
    // 左右移動我擦，這個不靈
    const right = currentAngle.clone().cross(camera.up);
    currentPos.add(right.multiplyScalar(side * speed * delta));

    camera.position.set(currentPos.x, currentPos.y, currentPos.z);
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


function useKeyboardMoving() {
  // 一個 hook 監聽鍵盤事件，返回移動的方向
  // 前進 (1,0), 後退 (-1,0), 左移 (0,-1), 右移 (0,1)
  // 以及牠們的組合
  const [direction, setDirection] = useState([0, 0]);
  const keyDown$ = useRef(new Subject<KeyboardEvent>());
  const keyUp$ = useRef(new Subject<KeyboardEvent>());

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => keyDown$.current.next(e);
    const keyUpHandler = (e: KeyboardEvent) => keyUp$.current.next(e);

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  // 使用 rxjs 運算符洗出 wasd 和方向鍵的按鍵事件
  // 通過 keydown 和 keyup 事件的流，計算當前被按下的按鍵

  const allowedKeys = [
    'w', 'a', 's', 'd', 
    'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'
  ];

  useEffect(() => {
    const keyDownEvents$ = keyDown$.current.pipe(
      filter(e => allowedKeys.includes(e.key)),
      map(e => ({ key: e.key, pressed: true }))
    );
    
    const keyUpEvents$ = keyUp$.current.pipe(
      filter(e => allowedKeys.includes(e.key)),
      map(e => ({ key: e.key, pressed: false }))
    );


    const pressing$ = merge(keyDownEvents$, keyUpEvents$).pipe(
      scan((acc: Set<string>, { key, pressed }) => {
        if (pressed) {
          acc.add(key);
        } else {
          acc.delete(key);
        }
        return acc;
      }, new Set<string>()),
      map((keys: Set<string>) => {
        const front = keys.has('w') || keys.has('ArrowUp') ? 1 : 0;
        const mashiro = keys.has('s') || keys.has('ArrowDown') ? -1 : 0;
        const left = keys.has('a') || keys.has('ArrowLeft') ? -1 : 0;
        const right = keys.has('d') || keys.has('ArrowRight') ? 1 : 0;
        return [front + mashiro, left + right];
      })
    );

    const wasdSub = pressing$.subscribe(
      (dir) => {
        console.log(dir);
        setDirection(dir);
      }
    );
    return () => wasdSub.unsubscribe();
  }, []);

  return direction as [number, number];
}