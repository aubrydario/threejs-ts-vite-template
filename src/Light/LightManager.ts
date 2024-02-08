import { HemisphereLight, DirectionalLight, Scene, Light } from 'three';

export class LightManager {
    private lights: Map<string, Light> = new Map();

    private hemiLight: HemisphereLight;
    private dirLight: DirectionalLight;
    
    constructor() {
        this.hemiLight = new HemisphereLight(0xffeeb1, 0x080820, 4);
        this.hemiLight.position.set(0, 50, 0);
    
        this.dirLight = new DirectionalLight(0xffffff, 3);
        this.dirLight.color.setHSL(0.1, 1, 0.95);
        this.dirLight.position.set(50, 50, 35);
        this.dirLight.castShadow = true;

        this.lights.set('hemiLight', this.hemiLight);
        this.lights.set('dirLight', this.dirLight);
    }

    public render(scene: Scene) {
        scene.add(this.hemiLight);
        scene.add(this.dirLight);
    }
    
    public toggleHemisphericLight() {
        this.hemiLight.visible = !this.hemiLight.visible;
    }
    
    public toggleDirectionalLight() {
        this.dirLight.visible = !this.dirLight.visible;
    }
    
    public getHemiLight() {
        return this.hemiLight;
    }
    
    public getDirLight() {
        return this.dirLight;
    }
}