import GUI from "lil-gui";
import { AxesHelper, GridHelper, Scene } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CameraManager } from "../Camera/CameraManager";

export class DebugManager {
    private scene: Scene;
    private gui: GUI;
    private axesHelper: AxesHelper;
    private gridHelper: GridHelper;
    private helpersFolder: any;
    private cameraFolder: any;
    
    constructor(scene: Scene, cameraManager: CameraManager) {
        this.scene = scene;
        
        this.gui = new GUI({ title: 'Debug GUI', width: 300 });
        this.helpersFolder = this.gui.addFolder('Helpers');
        this.cameraFolder = this.gui.addFolder('Camera');

        this.axesHelper = new AxesHelper(4)
        this.gridHelper = new GridHelper(20, 20)
        this.createHelpersFolder();
        this.createCameraFolder(cameraManager.getCameraControls());

        this.initGui();
    }

    private createHelpersFolder() {
        this.axesHelper.visible = true
        this.scene.add(this.axesHelper)

        this.gridHelper.position.y = -0.01
        this.scene.add(this.gridHelper)

        this.helpersFolder.add(this.axesHelper, 'visible').name('axes');
        this.helpersFolder.add(this.gridHelper, 'visible').name('grid');
    }

    private createCameraFolder(cameraControls: OrbitControls) {
        this.cameraFolder.add(cameraControls, 'autoRotate');
    }

    private initGui() {
        // persist GUI state in local storage on changes
        this.gui.onFinishChange(() => {
            const guiState = this.gui.save()
            localStorage.setItem('guiState', JSON.stringify(guiState))
        })

        // load GUI state if available in local storage
        const guiState = localStorage.getItem('guiState')
        if (guiState) this.gui.load(JSON.parse(guiState))

        // reset GUI state button
        const resetGui = () => {
            localStorage.removeItem('guiState')
            this.gui.reset()
        }
        this.gui.add({ resetGui }, 'resetGui').name('RESET')

        this.gui.close()
    }

    public getGui() {
        return this.gui;
    }
}