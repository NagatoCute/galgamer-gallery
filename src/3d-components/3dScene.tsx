import { Canvas, useLoader } from '@react-three/fiber'
import * as THREE from "three";
import { CameraPosition, CameraRotation } from './CameraControl';
import { useTexture } from "@react-three/drei"
import { MainBody, TopCover } from './kettle-model';

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
      <directionalLight color={0xbcd2ee} position={[1, 0.75, 0.5]} intensity={2} />

      {/* 方塊 */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color={0xffff00} />
      </mesh>
      <MainBody position={[10, 20, 10]} rotationAngle={0} />
      <TopCover position={[10, 30, 10]} rotationAngle={0} />

      {/*木地板*/}
      <WoodFloor />

      <gridHelper args={[100, 20, 0xff0000, 0x808080]} />
      {/* 地面 */}
      <axesHelper args={[30]} />
      {/* 坐标轴 */}
      {/* 牆 */}
      <gridHelper args={[100, 20, 0x00ff00, 0x808080]} position={[-50, 50, 0]} rotation={[0, 0, Math.PI / 2]} />
      <gridHelper args={[100, 20, 0x00ff00, 0x808080]} position={[50, 50, 0]} rotation={[0, 0, Math.PI / 2]} />

      {/* 画框（大概） */}
      {/* <FrameBox position={[50, 5, 0]} rotationAngle={0} /> */}
      <FrameBox position={[-50, 11, -12]} rotationAngle={0} />
      <FrameBox position={[-50, 11, 12]} rotationAngle={0} />
      <FrameBox position={[-50, 11, 36]} rotationAngle={0} />

      <CameraPosition />
      <CameraRotation />
    </Canvas>
  );
}

//木地板
function WoodFloor() {
  const texture = useTexture(
    '/texture/old-plank-flooring1_basecolor.png',
    // 设置纹理重复方式和重复次数
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
    }
  );
  
  return (
    <mesh position={[0, -1, 0]}>
      <boxGeometry args={[100, 2, 100]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}


//画框占位符
function FrameBox({ position, rotationAngle }: { position: [number, number, number], rotationAngle: number }) {
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
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

