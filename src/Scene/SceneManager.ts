import { Color, Mesh, MeshPhongMaterial, Object3D, PlaneGeometry, Scene } from "three";
import { LightManager } from "../Light/LightManager";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class SceneManager {
  private scene: Scene
  private gltfLoader: GLTFLoader

  constructor() {
    this.scene = new Scene();
    this.scene.background = new Color("#7EC2F0");

    const lightManger = new LightManager();
    lightManger.render(this.scene);

    this.gltfLoader = new GLTFLoader();

    this.createPlane();
    this.createObject();
  }

  private createPlane() {
    const planeGeometry = new PlaneGeometry(20, 20);
    const plane = new Mesh(planeGeometry, new MeshPhongMaterial({ color: 0xbababa }));
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    this.scene.add(plane)
  }

  private createObject() {
    this.gltfLoader.load('/character.gltf', (gltf) => {
      const character = gltf.scene.children[0] as Object3D;
      character.rotateZ(Math.PI / 2);

      character.traverse((child) => {
        if ((child as Mesh).isMesh) {
          (child as Mesh).castShadow = true;
          (child as Mesh).receiveShadow = true;
        }
      });

      this.scene.add(character);
      
      }, undefined, (error) => {
        console.error(error);
    });
  }

  public getScene() {
    return this.scene;
  }
}