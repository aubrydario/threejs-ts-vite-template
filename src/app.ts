import {
  WebGLRenderer,
  ReinhardToneMapping,
  PCFSoftShadowMap,
} from 'three'
import { toggleFullScreen } from './helpers/fullscreen'
import { resizeRendererToDisplaySize } from './helpers/responsiveness'

import './style.css'
import { CameraManager } from './Camera/CameraManager';
import { DebugManager } from './Debug/DebugManager';
import { SceneManager } from './Scene/SceneManager';

let canvas: HTMLCanvasElement
let renderer: WebGLRenderer
let cameraManager: CameraManager
let sceneManager: SceneManager

init()
animate()

function init() {
  canvas = document.querySelector('canvas#app')!
  renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.toneMapping = ReinhardToneMapping;
  renderer.toneMappingExposure = 2.3;
  renderer.shadowMap.type = PCFSoftShadowMap
  
  sceneManager = new SceneManager()
  cameraManager = new CameraManager(canvas);

  // Full screen
  window.addEventListener('dblclick', (event) => {
    if (event.target === canvas) {
      toggleFullScreen(canvas)
    }
  })

  new DebugManager(sceneManager.getScene(), cameraManager);
}

function animate() {
  requestAnimationFrame(animate)
  const camera = cameraManager.getCamera();

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }

  cameraManager.getCameraControls().update()

  renderer.render(sceneManager.getScene(), camera)
}
