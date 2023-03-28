import worldObjects from "./objects/index.js";
import { mat4 } from "gl-matrix";
import Helper from "./webgl-helper.js";
import GlObject from "./object-helper.js";
import vertexShaderSource from "./world-vert.glsl";
import fragmentShaderSource from "./world-frag.glsl";
import DirectedPoint from "./directedPoint.js";

class World {
  constructor() {
    this.camera = new DirectedPoint();
    /**
     * @type {Array.<GlObject>}
     */
    this.objects = [];
  }

  init() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("glcanvas");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl2");
    if (gl === null) {
      alert(
        "Unable to initialize WebGL. Your browser or machine may not support it."
      );
      return;
    }
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.helper = new Helper(
      gl,
      vertexShaderSource.sourceCode,
      fragmentShaderSource.sourceCode
    );

    this.gl = gl;
  }

  addControllers() {
    const delta = 0.2;
    // add event listeners to the key press
    document.addEventListener("keydown", event => {
      switch (event.code) {
        case "KeyW":
          this.camera.forward(delta);
          break;
        case "KeyS":
          this.camera.backward(delta);
          break;
        case "KeyA":
          this.camera.left(delta);
          break;
        case "KeyD":
          this.camera.right(delta);
          break;
        case "keyI":
        case "Space":
          this.camera.up(delta);
          break;
        case "keyK":
        case "ShiftLeft":
        case "ControlLeft":
          this.camera.down(delta);
          break;
        case "KeyJ":
        case "KeyQ":
        case "ArrowLeft":
          this.camera.turnLeft(Math.PI / 24); // 15 degrees
          break;
        case "KeyL":
        case "KeyE":
        case "ArrowRight":
          this.camera.turnRight(Math.PI / 24); // 15 degrees
          break;
        case "ArrowUp":
          this.camera.tiltUp(Math.PI / 48); // 7.5 degrees
          break;
        case "ArrowDown":
          this.camera.tiltDown(Math.PI / 48); // 7.5 degrees
          break;
        case "KeyR":
          this.camera.reset();
          break;
      }
      event.preventDefault();
    });
  }

  createObjects() {
    const gl = this.gl;
    let vertices_concat = new Float32Array();
    let normals_concat = new Float32Array();
    let indices_concat = new Uint16Array();
    let offset = 0;

    for (let obj of worldObjects) {
      vertices_concat = new Float32Array([...vertices_concat, ...obj.vertices]);
      normals_concat = new Float32Array([...normals_concat, ...obj.normals]);
      indices_concat = new Uint16Array([
        ...indices_concat,
        ...obj.indices.map(index => index + offset),
      ]);
      offset += obj.vertices.length / 3;

      this.objects.push(obj);
    }

    this.helper.bufferData(
      vertices_concat,
      normals_concat,
      indices_concat,
      "vertPosition",
      "vertNormal"
    );
  }

  /**
   *
   * @param {DOMHighResTimeStamp} time
   */
  draw(time) {
    const gl = this.gl;
    const helper = this.helper;
    if (this.previousTime === undefined) {
      this.previousTime = time;
    }
    const deltaTime = time - this.previousTime;
    this.previousTime = time;

    helper.clear();

    const projectionMatrix = mat4.create();
    {
      const fieldOfView = (45 * Math.PI) / 180;
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 100.0;
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    }
    const { position, direction } = this.camera;
    const cameraMatrix = mat4.create();
    mat4.lookAt(
      cameraMatrix,
      position,
      [
        position[0] + direction[0],
        position[1] + direction[1],
        position[2] + direction[2],
      ],
      [0, 1, 0]
    );

    mat4.multiply(projectionMatrix, projectionMatrix, cameraMatrix);

    helper.setUniform("projMatrix", projectionMatrix);
    helper.setUniform("ambientLightColor", [0.6, 0.6, 0.6]);
    helper.setUniform("diffuseLightColor", [0.8, 0.8, 0.8]);
    helper.setUniform("lightDirection", [
      Math.sin(0.0005 * time),
      0.5,
      Math.cos(0.0005 * time),
    ]);

    for (const glObject of this.objects) {
      glObject.update(deltaTime, time);

      helper.setUniform("viewMatrix", glObject.modelViewMatrix);
      helper.setUniform("modelToWorldMatrix", glObject.modelWorldMatrix);
      helper.setUniform("materialColor", glObject.materialColor);
      helper.drawElements(glObject.indices.length);
    }

    requestAnimationFrame(time => this.draw(time));
  }
}

function main() {
  const world = new World();
  world.init();
  world.createObjects();
  world.addControllers();
  requestAnimationFrame(time => world.draw(time));
}

if (document.readyState !== "loading") {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}
