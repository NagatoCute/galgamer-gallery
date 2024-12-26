import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
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
        <ambientLight color={0x606060} intensity={1}/>
        <directionalLight color={0xbcd2ee} position={[1, 0.75, 0.5]} intensity={1}/>

        {/* 方塊 */}
        <mesh>
          <boxGeometry/>
          <meshStandardMaterial color={0xffff00}/>
        </mesh>

        {/*木地板*/}
        <WoodFloor />

        <gridHelper args={[100, 20, 0xff0000, 0x808080]}/>
        {/* 地面 */}
        <axesHelper args={[30]}/>
        {/* 坐标轴 */}
        {/* 牆 */}
        <gridHelper args={[100, 20, 0x00ff00, 0x808080]} position={[-50, 50, 0]} rotation={[0, 0, Math.PI / 2]}/>
        <gridHelper args={[100, 20, 0x00ff00, 0x808080]} position={[50, 50, 0]} rotation={[0, 0, Math.PI / 2]}/>

        {/* 画框（大概） */}
        {/* <FrameBox position={[50, 5, 0]} rotationAngle={0} /> */}
        <FrameBox position={[-50, 11, -12]} rotationAngle={0}/>
        <FrameBox position={[-50, 11, 12]} rotationAngle={0}/>
        <FrameBox position={[-50, 11, 36]} rotationAngle={0}/>

        <CameraPosition />
        <CameraRotation />
      </Canvas>
  );
}

//木地板
function WoodFloor() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('/texture/old-plank-flooring1_basecolor.png');

// 设置纹理重复方式和重复次数
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10); // 调整重复次数

return (
    <mesh position={[0, -1, 0]}>
      <boxGeometry args={[100, 2, 100]}/>
      <meshStandardMaterial map={texture}/>
    </mesh>
);
}
//画框占位符
function FrameBox({position, rotationAngle}: { position: [number, number, number], rotationAngle: number }) {
  const width = 20;
  const height = 12;
  const depth = 0.1;
  // 定义图片的宽度和高度
  const imageWidth = 1024;
  const imageHeight = 680;

  // 加载图片纹理
  const texture = useLoader(THREE.TextureLoader, `https://placehold.co/${imageWidth}x${imageHeight}/jpg`);

  return (
      <mesh position={position} rotation={[0, rotationAngle + Math.PI / 2, 0]}>
        <boxGeometry args={[width, height, depth]}/>
        <meshStandardMaterial map={texture}/>
      </mesh>
);
}


function CameraPosition() {
  const direction = useKeyboardMoving();
  const speed = 30;
  useFrame(({camera}, delta, frame) => {
    let [front, side] = direction; // 归一化
    let currentPos = camera.position.clone();

    // 归一化方向输入
    //计算 front 和 side 的向量的长度：directionLength = sqrt(front^2 + side^2)。
    // 如果 directionLength 大于 0，则将 front 和 side 分别除以 directionLength，从而将它们转换为单位向量 。
    const directionLength = Math.sqrt(front * front + side * side);
    if (directionLength > 0) {
      front /= directionLength;
      side /= directionLength;
    }


    // 获取相机的前向方向
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.normalize(); // 归一化前向方向

    // 计算右向量
    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    // 前进后退
    currentPos.add(forward.multiplyScalar(front * speed * delta));

    // 限制x轴范围在-50到50之间
    currentPos.x = Math.max(-49, Math.min(49, currentPos.x));

    // 左右移动
    currentPos.add(right.multiplyScalar(side * speed * delta));

    // 防止飞到天上或地下
    currentPos.y = Math.max(6, 7);


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