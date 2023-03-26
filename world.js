import { cube, ring } from "./simpleObjectLibrary.js";
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
          this.camera.turnLeft(Math.PI / 12 /* 30 */);
          break;
        case "KeyL":
        case "KeyE":
        case "ArrowRight":
          this.camera.turnRight(Math.PI / 12 /* 30 */);
          break;
      }
      this.draw(); //delete this after animation is implemented
    });
  }

  createObjects() {
    const gl = this.gl;

    {
      const {
        vertexPositions: vertices,
        vertexNormals: normals,
        indices: indices,
      } = cube(2);

      let modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);
      mat4.rotateX(modelViewMatrix, modelViewMatrix, (30 / 180) * Math.PI);
      mat4.rotateY(modelViewMatrix, modelViewMatrix, (30 / 180) * Math.PI);

      let modelWorldMatrix = mat4.create();

      const materialColor = [0.8, 0.2, 0.1];

      this.helper.bufferData(
        vertices,
        normals,
        indices,
        "vertPosition",
        "vertNormal"
      );

      this.objects.push(
        new GlObject(
          vertices,
          normals,
          indices,
          modelViewMatrix,
          modelWorldMatrix,
          materialColor,
          obj => {}
        )
      );
    }
  }

  draw() {
    const gl = this.gl;
    const helper = this.helper;

    // clear the canvas
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const projectionMatrix = mat4.create();
    {
      const fieldOfView = (45 * Math.PI) / 180;
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 100.0;
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    }
    const { position, latitude, longitude } = this.camera;
    const [x, y, z] = position;
    const cameraMatrix = mat4.create();
    mat4.rotateX(cameraMatrix, cameraMatrix, -latitude);
    mat4.rotateY(cameraMatrix, cameraMatrix, longitude);
    mat4.translate(cameraMatrix, cameraMatrix, [-x, -y, -z]);

    mat4.multiply(projectionMatrix, projectionMatrix, cameraMatrix);

    helper.setUniform("projMatrix", projectionMatrix);
    helper.setUniform("ambientLightColor", [0.6, 0.6, 0.6]);
    helper.setUniform("diffuseLightColor", [0.8, 0.8, 0.8]);
    helper.setUniform("lightDirection", [1, 2, 5]);

    for (const glObject of this.objects) {
      helper.setUniform("viewMatrix", glObject.modelViewMatrix);
      helper.setUniform("modelToWorldMatrix", glObject.modelWorldMatrix);
      helper.setUniform("materialColor", glObject.materialColor);
      helper.drawElements(glObject.indices.length);
    }
  }
}

function main() {
  const world = new World();
  world.init();
  world.createObjects();
  world.addControllers();
  world.draw();
}

if (document.readyState !== "loading") {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}
