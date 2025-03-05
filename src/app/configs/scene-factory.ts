import { BaseScene } from "./base-scene.config";
import { HomeScene } from "./home-scene.config";

export type SceneIds = 'home'

export const Scenes: Record<SceneIds, new (el: HTMLElement) => BaseScene> = {
  home: HomeScene
}