import { Injectable, signal } from '@angular/core';
import { LoadingManager } from 'three/src/Three.Core.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { HomeScene } from '@configs/home-scene.config';
import { BaseScene } from '@configs/base-scene.config';
import { SceneIds, Scenes } from '@configs/scene-factory';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private loadManager = new LoadingManager();
  private gltfLoader = new GLTFLoader(this.loadManager);
  private scenes = new Map<SceneIds, BaseScene>();

  public ready = signal<boolean>(false);

  private loading() {
    this.loadManager.onProgress = (itemJustLoadPath: string, loaded: number, total: number) => {
      console.log(itemJustLoadPath);
      
    };
  }

  public async initSceneById(element: HTMLElement, sceneId: SceneIds): Promise<void> {
    if(this.scenes.has(sceneId)) return Promise.reject(`Scene ${sceneId} already instantiated!`);

    const SceneClass = Scenes[sceneId];
    if(!SceneClass) return Promise.reject(`Scene ${sceneId} not found!`);

    const sceneData = new SceneClass(element);
    this.scenes.set(sceneId, sceneData);
  }

  // public handleResizeScene(isMobile: boolean) {
  //   if (!this.renderer || !this.camera || !this.scene) return;
  //   const element = this.renderer.domElement.parentElement;
  //   if (element) {
  //     const { offsetWidth: width, offsetHeight: height } = element;
  //     this.camera.aspect = width / height;
  //     this.camera.fov = isMobile ? 60 : 75;
  //     this.camera.updateProjectionMatrix();
  //     this.renderer.setSize(width, height);
  //   }
  // }

  public uploadModels(sceneId: SceneIds) {
    const instance = this.scenes.get(sceneId);
    if(instance) {
      instance.objsPaths.forEach(obj => this.gltfLoader.load(
        obj, resp => { resp.scene.position.set(0,2,0); instance.scene.add(resp.scene); }
      ));
    }
  }
  
  public animate = (sceneId: SceneIds): void => {
    const instance = this.scenes.get(sceneId);
    if(instance) { instance.animate() }
  }

  public destroyScene(sceneId: SceneIds) {
    const instance = this.scenes.get(sceneId);
    if(instance) {
      cancelAnimationFrame(instance.animationFrameId);
      instance.destroy();
    }
  }
}
