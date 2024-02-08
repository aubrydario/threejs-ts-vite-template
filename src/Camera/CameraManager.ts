import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class CameraManager {
    private camera: PerspectiveCamera;
    private cameraControls: OrbitControls;
    
    constructor(canvas: HTMLCanvasElement) {
        this.camera = new PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        this.camera.position.set(5, 3, 0);
    
        this.cameraControls = new OrbitControls(this.camera, canvas);
        this.cameraControls.enableDamping = true;
        this.cameraControls.autoRotate = false;
        this.cameraControls.update();
    }
    
    public getCamera() {
        return this.camera;
    }
    
    public getCameraControls() {
        return this.cameraControls;
    }
}