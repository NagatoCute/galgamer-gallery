import * as THREE from "three";


class SceneManager {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff); // 设置背景颜色为白色
    this.canvas = canvas;

    // 创建WebGL渲染器，并设置画布和抗锯齿
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true, // 开启抗锯齿
      alpha: true, // 启用透明背景
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小为浏览器窗口大小

    // 创建透视相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 30); // 设置相机位置

    // 设置灯光
    this.setupLights();

    // 设置事件监听器
    this.setupEventListeners();
  }

  // 设置场景中的灯光
  setupLights() {
    // 添加环境光，增强场景的照明
    const ambientLight = new THREE.AmbientLight(0x606060);
    this.scene.add(ambientLight);

    // 添加平行光，模拟太阳光
    const directionalLight = new THREE.DirectionalLight(0xbcd2ee);
    directionalLight.position.set(1, 0.75, 0.5).normalize(); // 设置光源方向
    this.scene.add(directionalLight);
  }

  // 设置窗口大小改变事件监听器
  setupEventListeners() {
    window.addEventListener("resize", () => {
      // 更新相机的长宽比和投影矩阵
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      // 更新渲染器大小
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // 渲染场景
  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

// 相机控制器类，负责处理相机的移动和旋转
class CameraController {
  camera: THREE.PerspectiveCamera;
  leftPress: boolean;
  front: boolean;
  mashiro: boolean;
  left: boolean;
  right: boolean

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.leftPress = false; // 鼠标左键是否按下
    this.front = false; // 是否向前移动
    this.mashiro = false; // 是否向后移动
    this.left = false; // 是否向左移动
    this.right = false; // 是否向右移动

    // 设置事件监听器
    this.setupEventListeners();
  }

  // 设置事件监听器
  setupEventListeners() {
    window.addEventListener("mousemove", this.handleMouseMove.bind(this)); // 处理鼠标移动事件
    window.addEventListener("mousedown", () => (this.leftPress = true)); // 处理鼠标按下事件
    window.addEventListener("mouseup", () => (this.leftPress = false)); // 处理鼠标松开事件
    window.addEventListener("keydown", this.handleKeyDown.bind(this)); // 处理键盘按下事件
    window.addEventListener("keyup", this.handleKeyUp.bind(this)); // 处理键盘松开事件
  }

  // 处理鼠标移动事件，实现相机旋转
  handleMouseMove(event: MouseEvent) {
    if (this.leftPress) {
      this.camera.rotateOnWorldAxis(
        new THREE.Vector3(0, 1, 0),
        event.movementX / 500
      );
      this.camera.rotateOnAxis(
        new THREE.Vector3(1, 0, 0),
        event.movementY / 500
      );
    }
  }

  // 处理键盘按下事件，实现第一人称视角移动
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key.toLowerCase()) {
      case "w":
        this.front = true;
        break; // 向前移动
      case "s":
        this.mashiro = true;
        break; // 向后移动
      case "a":
        this.left = true;
        break; // 向左移动
      case "d":
        this.right = true;
        break; // 向右移动
    }
  }

  // 处理键盘松开事件，停止视角移动
  handleKeyUp(event: KeyboardEvent) {
    switch (event.key.toLowerCase()) {
      case "w":
        this.front = false;
        break;
      case "s":
        this.mashiro = false;
        break;
      case "a":
        this.left = false;
        break;
      case "d":
        this.right = false;
        break;
    }
  }

  // 更新相机位置
  update() {
    let vect = this.camera.getWorldDirection(new THREE.Vector3());

    if (this.front) {
      this.camera.position.z += vect.dot(new THREE.Vector3(0, 0, 15)) * 0.01;
      this.camera.position.x += vect.dot(new THREE.Vector3(15, 0, 0)) * 0.01;
    }
    if (this.mashiro) {
      this.camera.position.z -= vect.dot(new THREE.Vector3(0, 0, 15)) * 0.01;
      this.camera.position.x -= vect.dot(new THREE.Vector3(15, 0, 0)) * 0.01;
    }
    if (this.left) {
      let rightVect = new THREE.Vector3(1, 0, 0).applyQuaternion(
        this.camera.quaternion
      );
      this.camera.position.x -= rightVect.x * 0.1;
      this.camera.position.z -= rightVect.z * 0.1;
    }
    if (this.right) {
      let rightVect = new THREE.Vector3(1, 0, 0).applyQuaternion(
        this.camera.quaternion
      );
      this.camera.position.x += rightVect.x * 0.1;
      this.camera.position.z += rightVect.z * 0.1;
    }

    // 设置左墙和右墙的边界
    const leftWallX = -50;
    const rightWallX = 50;

    // 限制相机的 x 坐标在左墙和右墙之间
    this.camera.position.x = Math.max(
      leftWallX + 5,
      Math.min(rightWallX - 5, this.camera.position.x)
    );
  }
}

// 画框类，负责创建和管理单个画框
class Frame {
  scene: THREE.Scene;
  imageUrl: string;
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number };
  mesh: THREE.Mesh;

  constructor(
    scene: THREE.Scene, 
    imageUrl: string, 
    position: { x: number; y: number; z: number },
    dimensions: { width: number; height: number }
  ) {
    this.scene = scene;
    this.imageUrl = imageUrl;
    this.position = position;
    this.dimensions = dimensions;
    this.mesh = this.createFrame(); // 创建画框的网格
  }

  // 创建画框的网格
  createFrame() {
    const geometry = new THREE.PlaneGeometry(
      this.dimensions.width,
      this.dimensions.height
    );
    const texture = new THREE.TextureLoader().load(this.imageUrl);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const frame = new THREE.Mesh(geometry, material);

    frame.position.set(this.position.x, this.position.y, this.position.z);
    frame.rotation.y = Math.PI / 2; // 旋转画框，使其从垂直状态转为水平方向
    frame.scale.x = -1; // 左右镜像

    return frame;
  }
}

// 画廊类，负责创建和管理多个画框
class Gallery {
  scene: THREE.Scene;
  framesGroup: THREE.Group;
  imageWidth: number;
  imageHeight: number;
  frameCount: number;


  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.framesGroup = new THREE.Group();
    this.scene.add(this.framesGroup); // 将画框组添加到场景中

    // 图片尺寸和数量设置
    this.imageWidth = 600;
    this.imageHeight = 1080;
    this.frameCount = 7;

    // 创建画框
    this.createFrames();
  }

  // 创建画框
  createFrames() {
    const frameWidth = 9;
    const frameHeight = 15;
    const spacing = 3;

    const totalWidth = (frameWidth + spacing) * this.frameCount - spacing; // 总宽度减去最后一个间隔
    const startZ = -totalWidth / 2; // 起始位置

    for (let i = 0; i < this.frameCount; i++) {
      const imageUrl = `https://placehold.co/${this.imageWidth}x${this.imageHeight}/jpg`;
      const positionZ = startZ + i * (frameWidth + spacing);

      // 创建并添加画框到场景中
      const frame = new Frame(
        this.scene,
        imageUrl,
        { x: 50, y: 10, z: positionZ },
        { width: frameWidth, height: frameHeight }
      );

      this.framesGroup.add(frame.mesh);
    }
  }
}

// 场景辅助工具类，负责添加辅助工具（网格、坐标轴等）
class SceneHelper {
  scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.addGrid(); // 添加网格帮助器
    this.addAxes(); // 添加坐标轴帮助器
    this.addWallGrids(); // 添加两堵墙的网格帮助器
  }

  // 添加网格帮助器
  addGrid() {
    const grid = new THREE.GridHelper(100, 20, 0xff0000, 0x000000);
    grid.material.opacity = 0.1;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  // 添加坐标轴帮助器
  addAxes() {
    const axesHelper = new THREE.AxesHelper(30);
    this.scene.add(axesHelper);
  }

  // 添加两堵墙的网格帮助器
  addWallGrids() {
    const leftWallGrid = new THREE.GridHelper(100, 20, 0x00ff00, 0x000000);
    leftWallGrid.material.opacity = 0.3;
    leftWallGrid.material.transparent = true;
    leftWallGrid.position.set(-50, 50, 0);
    leftWallGrid.rotation.z = Math.PI / 2;
    this.scene.add(leftWallGrid);

    const rightWallGrid = new THREE.GridHelper(100, 20, 0x00ff00, 0x000000);
    rightWallGrid.material.opacity = 0.3;
    rightWallGrid.material.transparent = true;
    rightWallGrid.position.set(50, 50, 0);
    rightWallGrid.rotation.z = Math.PI / 2;
    this.scene.add(rightWallGrid);
  }
}

export { SceneManager, CameraController, Gallery, SceneHelper };

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