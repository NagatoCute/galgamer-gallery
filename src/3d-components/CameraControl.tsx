import * as THREE from "three";
import { Subject, map, filter, scan, merge } from 'rxjs';
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react';
import { useDrag } from '@use-gesture/react'

export function CameraRotation() {
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


export function CameraPosition() {
  const direction = useKeyboardMoving();
  const speed = 30;
  useFrame(({ camera }, delta, frame) => {
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
    forward.y = 0; // 将Y轴的值设置为0，防止看天/地减速
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
        setDirection(dir);
      }
    );
    return () => wasdSub.unsubscribe();
  }, []);

  return direction as [number, number];
}