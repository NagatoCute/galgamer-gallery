import { Canvas, useLoader } from '@react-three/fiber'
import * as THREE from "three";
import { CameraPosition, CameraRotation } from './CameraControl';
import {Box, useTexture} from "@react-three/drei"
import { MainBody, TopCover } from './goupe/kettle-model';
import { Saratoga } from './諤次元/Saratoga';
import Snow悖謬 from './❄️/悖謬';
import Snow幽潮 from './❄️/幽潮';
import Snow朝翼 from './❄️/朝翼';
import Snow羽蜕 from './❄️/羽蛻';

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
          // 修復顏色黯淡問題
          // https://stackoverflow.com/questions/69074954/threejs-washed-out-textures
          // There is an issue related to sRGB encoding in THREE. In RTF you would use the linear and flat props on your <Canvas/>:
          linear
          flat
      >
          {/* 光照 */}
          {/*后面的数越大阴影越淡*/}
          <ambientLight color={'#f9eddb'} intensity={0.85}/>
          {/*<directionalLight color={0xbcd2ee} position={[1, 0.75, 0.5]} intensity={2} />*/}
          {/*方向光，投射阴影的，我调不好，但是确实可以用*/}
          <directionalLight
              color={"#f9eddb"}
              position={[20, 50, 20]} // 调整光源位置
              intensity={1.25}
              castShadow
              shadow-mapSize-width={8192}  // 阴影质量
              shadow-mapSize-height={8192}
              shadow-camera-near={0.01}
              shadow-camera-far={200}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}

              // https://discourse.threejs.org/t/strange-rendering-issue-with-texture/30203/2
              // These patterns are called shadow acne .
              shadow-normalBias={0.01}
              shadow-bias={-0.001}
          />

          {/* 方塊 */}
          <mesh position={[20, 50, 20]}>
              <boxGeometry args={[1, 1, 1]}/>
              <meshStandardMaterial color={0xffff00}/>
          </mesh>

          {/* 碧蓝航线 */}
          <Saratoga position={[30, 1, 30]} rotation={[0, -Math.PI / 2, 0]}/>
          <mesh position={[30, 0, 30]} castShadow receiveShadow>
              <boxGeometry args={[4, 2, 4]}/>
              <meshStandardMaterial color="pink"/>
          </mesh>

          {/*墙面*/}
          <WhiteWall position={[51, 50, 0]}/>
          <WhiteWall position={[-51, 50, 0]}/>

          {/* Goupe 作品*/}
          <MainBody position={[10, 6, 10]} rotation={[0, Math.PI / 2, 0]}/>
          <TopCover position={[10, 10, 10]} rotation={[0, 0, 0]}/>

          {/* ❄️ */}
          <Snow悖謬 position={[-15, 0, -15]} rotation={[0, 0, 0]}/>
          <Snow幽潮 position={[-8, 0, -15]} rotation={[0, 0, 0]}/>
          <Snow朝翼 position={[-1, 0, -15]} rotation={[0, 0, 0]}/>
          <Snow羽蜕 position={[6, 0, -15]} rotation={[0, 0, 0]}/>

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
        <>
        <mesh position={[0, -1, 0]} receiveShadow>
        <boxGeometry args={[100, 2, 100]} />
        <meshStandardMaterial
          map={texture}
          color={0xFAEBD7}
        />
      </mesh>
    </>
  );
}

function WhiteWall({ position, }: { position: [number, number, number] }) {
  const texture = useTexture(
    '/texture/old-plank-flooring1_roughness.png',
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
    }
  );
  return (
    <>
      <ambientLight intensity={0.7} />
      {/* 添加环境光 */}
      <mesh position={position} >
        <boxGeometry args={[2, 100, 100]} />
        <meshStandardMaterial map={texture} color={0xffffff} />
      </mesh>
    </>
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

