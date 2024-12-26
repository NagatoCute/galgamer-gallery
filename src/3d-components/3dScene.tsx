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
          shadows
      >
          {/* 光照 */}
          {/*后面的数越大阴影越淡*/}
          <ambientLight color={0x606060} intensity={3}/>
          {/*<directionalLight color={0xbcd2ee} position={[1, 0.75, 0.5]} intensity={2} />*/}
          {/*方向光，投射阴影的，我调不好，但是确实可以用*/}
          <directionalLight
              color={0xbcd2ee}
              position={[20, 30, 20]} // 调整光源位置
              intensity={2}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-near={0.1}
              shadow-camera-far={200}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
          />

          {/* 方塊 */}
          <mesh>
              <boxGeometry/>
              <meshStandardMaterial color={0xffff00}/>
          </mesh>


          <MainBody position={[10, 1, 10]} rotationAngle={0}/>
          <TopCover position={[10, 1.5, 10]} rotationAngle={0}/>
          <MainBody position={[5, 1, 10]} rotationAngle={0}/>
          <TopCover position={[5, 1, 10]} rotationAngle={0}/>

          {/*木地板*/}
          <WoodFloor/>

          <gridHelper args={[100, 20, 0xff0000, 0x808080]}/>
          {/* 地面 */}
          <axesHelper args={[30]}/>
          {/* 坐标轴 */}
          {/* 牆 */}
          <gridHelper args={[100, 20, 0x00ff00, 0x808080]} position={[-50, 50, 0]} rotation={[0, 0, Math.PI / 2]}/>
          <gridHelper args={[100, 20, 0x00ff00, 0x808080]} position={[50, 50, 0]} rotation={[0, 0, Math.PI / 2]}/>

          {/* 画框（大概） */}
          {/* <FrameBox position={[50, 5, 0]} rotationAngle={0} />*/}
          <FrameBox position={[-50, 11, -12]} rotationAngle={0}/>
          <FrameBox position={[-50, 11, 12]} rotationAngle={0}/>
          <FrameBox position={[-50, 11, 36]} rotationAngle={0}/>

          <CameraPosition/>
          <CameraRotation/>
      </Canvas>
  );
}

//木地板
function WoodFloor() {
    const texture = useTexture(
        '/texture/old-plank-flooring1_basecolor.png',
        (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
        }
    );

    return (
        <mesh position={[0, -1, 0]} receiveShadow>
            <boxGeometry args={[100, 2, 100]} />
            <meshStandardMaterial map={texture} color={0xF5DEB3} emissive={0xD2B48C } emissiveIntensity={0.1} />
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
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

