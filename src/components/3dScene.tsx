import { useRef, useEffect } from 'react';
import { SceneManager, CameraController, SceneHelper, Gallery } from '@/utils/3dClass';

export default function Scene() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;

    let requestAnimationFrameId: number;

    const sceneManager = new SceneManager(canvas.current);
    const cameraController = new CameraController(sceneManager.camera);
    const helper = new SceneHelper(sceneManager.scene);
    const gallery = new Gallery(sceneManager.scene);

    function animate() {
      requestAnimationFrameId = requestAnimationFrame(animate);
      cameraController.update();
      sceneManager.render();
    }
    animate();

    return () => cancelAnimationFrame(requestAnimationFrameId);
  }, [canvas]);

  return (
    <canvas ref={canvas} />
  );
}

// // 主应用类，负责初始化和运行整个应用
// class App {
//   sceneManager: SceneManager;
//   cameraController: CameraController;
//   helper: SceneHelper;
//   gallery: Gallery;

//   constructor() {
//     this.sceneManager = new SceneManager(); // 创建场景管理器
//     this.cameraController = new CameraController(this.sceneManager.camera); // 创建相机控制器
//     this.helper = new SceneHelper(this.sceneManager.scene); // 创建场景辅助工具
//     this.gallery = new Gallery(this.sceneManager.scene); // 创建画廊

//     // 开始动画循环
//     this.animate();
//   }

//   // 动画函数，不断更新渲染
//   animate() {
//     requestAnimationFrame(this.animate.bind(this)); // 每次渲染时请求下一帧
//     this.cameraController.update(); // 更新相机位置
//     this.sceneManager.render(); // 渲染场景
//   }
// }

// // 初始化应用
// new App();