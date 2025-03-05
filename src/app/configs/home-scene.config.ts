import { SceneConfig } from "@interfaces/three.interface";
import { BaseScene } from "./base-scene.config";
import { BackSide, Color, CylinderGeometry, Mesh, ShaderMaterial } from "three";

export class HomeScene extends BaseScene {
  private tunnel: Mesh;
  private tunnelMaterial: ShaderMaterial;
  private config: SceneConfig;

  constructor(domEl: HTMLElement) {
    super();


    this.config = {
      background: 0xffffff,
    };


    this.initializeScene({
      domEl,
      config: this.config
    })


    this.objsPaths = this.get3dPaths();
    this.setupScene();
  }

  public get3dPaths() {
    return ["assets/3d/digimon_greymon.glb"];
  }

  private setupScene() {
    if (this.config?.background !== undefined) {
      this.scene.background = new Color(this.config.background);
    }

    this.addDigitalTunnel();
  }

  private addDigitalTunnel() {
    const geometry = new CylinderGeometry(5, 5, 50, 32, 32, true);
    geometry.rotateX(Math.PI / 2);

    this.tunnelMaterial = new ShaderMaterial({
      side: BackSide,
      uniforms: {
        time: { value: 0.0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;

        void main() {
          float speed = time * 2.0;
          float lines = sin((vUv.y * 20.0 + speed)) * 0.5 + 0.5; // Linee digitali in movimento
          float circuits = step(0.7, mod(vUv.x * 10.0 + speed, 1.0)); // Circuiti spezzati

          vec3 color = vec3(0.0, lines * circuits, 1.0); // Azzurro digitale

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    this.tunnel = new Mesh(geometry, this.tunnelMaterial);
    this.scene.add(this.tunnel);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    if (this.tunnelMaterial) {
      // this.tunnelMaterial.uniforms['time'].value += 0.02;
    }

    // this.camera.position.z -= 0.1;
  }
}
