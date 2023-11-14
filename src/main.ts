import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { toggleFullScreen } from './helpers/fullscreen';
import { resizeRendererToDisplaySize } from './helpers/responsiveness';
import './style.css';

const CANVAS_ID = 'scene';

let canvas: HTMLElement;
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let cameraControls: OrbitControls;
let axesHelper: THREE.AxesHelper;
let gui: GUI;

init();
animate();

function init() {
  // ===== 🖼️ CANVAS, RENDERER, & SCENE =====
  canvas = document.querySelector(`canvas#${CANVAS_ID}`)!;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  scene.background = new THREE.Color("#7EC2F0");

  // ===== 💡 LIGHTS =====
  const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(30);
  scene.add(dirLight);

  dirLight.castShadow = true;

  const d = 50;

  dirLight.shadow.camera.left = - d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = - d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;

  // ===== 🎥 CAMERA =====
  camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(1.9, 1.5, 0);

  // ===== 🕹️ CONTROLS =====
  cameraControls = new OrbitControls(camera, canvas);
  cameraControls.enableDamping = true;
  cameraControls.autoRotate = false;
  cameraControls.update();

  // Full screen
  window.addEventListener('dblclick', (event) => {
    if (event.target === canvas) {
      toggleFullScreen(canvas);
    }
  });

  // ===== 🪄 HELPERS =====
  axesHelper = new THREE.AxesHelper(4);
  axesHelper.visible = true;
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(20, 20);
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  scene.add(hemiLightHelper);

  const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
  scene.add(dirLightHelper);

  const lightsHelper = {
    toggleHemisphericLight: () => {
      hemiLightHelper.visible = !hemiLightHelper.visible;
      hemiLight.visible = !hemiLight.visible;
    },
    toggleDirectionalLight: () => {
      dirLightHelper.visible = !dirLightHelper.visible;
      dirLight.visible = !dirLight.visible;
    }
  };

  // ==== 🐞 DEBUG GUI ====
  gui = new GUI({ title: '🐞 Debug GUI', width: 300 });

  const helpersFolder = gui.addFolder('Helpers');
  helpersFolder.add(axesHelper, 'visible').name('axes');

  const cameraFolder = gui.addFolder('Camera');
  cameraFolder.add(cameraControls, 'autoRotate');

  const lightsFolder = gui.addFolder('Lights');
  lightsFolder.add(lightsHelper, 'toggleHemisphericLight').name('Toggle Hemispheric Light');
  lightsFolder.add(lightsHelper, 'toggleDirectionalLight').name('Toggle Directional Light');
  lightsFolder.add(dirLight.shadow.camera, 'left', -100, 100, 0.1).name('DirLight Left').onChange(() => dirLight.shadow.camera.updateProjectionMatrix());
  lightsFolder.add(dirLight.shadow.camera, 'right', -100, 100, 0.1).name('DirLight Right').onChange(() => dirLight.shadow.camera.updateProjectionMatrix());
  lightsFolder.add(dirLight.shadow.camera, 'top', -100, 100, 0.1).name('DirLight Top').onChange(() => dirLight.shadow.camera.updateProjectionMatrix());
  lightsFolder.add(dirLight.shadow.camera, 'bottom', -100, 100, 0.1).name('DirLight Bottom').onChange(() => dirLight.shadow.camera.updateProjectionMatrix());
  lightsFolder.add(dirLight.shadow, 'bias', -0.01, 0.01, 0.0001).name('DirLight Bias').onChange(() => dirLight.shadow.camera.updateProjectionMatrix());
  lightsFolder.add(dirLight.shadow.camera, 'near', 0, 100, 0.1).name('DirLight Near').onChange(() => dirLight.shadow.camera.updateProjectionMatrix());
  lightsFolder.add(dirLight.shadow.camera, 'far', 0, 1000, 0.1).name('DirLight Far').onChange(() => dirLight.shadow.camera.updateProjectionMatrix());
  lightsFolder.add(dirLight.position, 'x', -100, 100, 0.01);
  lightsFolder.add(dirLight.position, 'y', -100, 100, 0.01);
  lightsFolder.add(dirLight.position, 'z', -100, 100, 0.01);

  // persist GUI state in local storage on changes
  gui.onFinishChange(() => {
    const guiState = gui.save();
    localStorage.setItem('guiState', JSON.stringify(guiState));
  });

  // load GUI state if available in local storage
  const guiState = localStorage.getItem('guiState');
  if (guiState) gui.load(JSON.parse(guiState));

  // reset GUI state button
  const resetGui = () => {
    localStorage.removeItem('guiState');
    gui.reset();
  };
  gui.add({ resetGui }, 'resetGui').name('RESET');

  gui.close();
}

function animate() {
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cameraControls.update();

  renderer.render(scene, camera);
}
