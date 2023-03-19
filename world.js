import { cube, ring } from "./simpleObjectLibrary.js";
import { mat4 } from "gl-matrix";
import vsSourceExternal from "./world.vert";
import fsSourceExternal from "./world.frag";
import DirectedPoint from "./directedPoint.js";

class World {
  constructor() {
    this.camera = new DirectedPoint();
  }

  init() {
    const canvas = document.getElementById("glcanvas");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl2");
    if (gl === null) {
      alert(
        "Unable to initialize WebGL. Your browser or machine may not support it."
      );
      return;
    }
    gl.clearColor(0.9, 0.9, 0.9, 1);
    const shaderProgram = this.createShaderProgram(
      gl,
      vsSourceExternal,
      fsSourceExternal
    );
    this.gl = gl;
    this.shaderProgram = shaderProgram;
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
      // console.log(
      //   this.camera.position,
      //   this.camera.longitude,
      //   this.camera.latitude
      // );
      this.draw(); //delete this after animation is implemented
    });
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {string} vsSource vertex shader source
   * @param {string} fsSource fragment shader source
   * @returns {WebGLProgram} shader program
   */
  createShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (vertexShader === null) {
      throw new Error("Unable to create vertex shader");
    }
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (fragmentShader === null) {
      throw new Error("Unable to create fragment shader");
    }
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    const shaderProgram = gl.createProgram();
    if (shaderProgram === null) {
      throw new Error("Unable to create shader program");
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    return shaderProgram;
  }

  createBuffer() {
    const gl = this.gl;
    this.buffers = [];
    {
      const { vertexPositions: vertex, indices: index } = cube(0.25);

      const pointBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);

      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);

      const length = index.length;

      this.buffers.push({ pointBuffer, indexBuffer, length });
    }
    {
      const { vertexPositions: vertex, indices: index } = cube(0.25)
      const pointBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);

      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);

      const length = index.length;

      this.buffers.push({ pointBuffer, indexBuffer, length });
    }
  }
  draw() {
    const gl = this.gl;
    const shaderProgram = this.shaderProgram;

    const buffers = this.buffers;

    // clear the canvas
    this.gl.clearDepth(1.0); // Clear everything
    this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
    this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const projectionMatrix = mat4.create();
    {
      const fieldOfView = (45 * Math.PI) / 180;
      const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 100.0;
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    }
    const { position, latitude, longitude } = this.camera;
    const [x, y, z] = position;
    mat4.rotateX(projectionMatrix, projectionMatrix, -latitude);
    mat4.rotateY(projectionMatrix, projectionMatrix, longitude-3 * Math.PI / 2 );
    mat4.translate(projectionMatrix, projectionMatrix, [-x, -y, -z]);
    
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);

    for (const { pointBuffer, indexBuffer, length } of buffers) {
      this.draw_elements(
        pointBuffer,
        indexBuffer,
        null,
        length,
        modelViewMatrix,
        projectionMatrix
      );
    }
  }

  /**
   *
   * @param {WebGLBuffer} positionBuffer
   * @param {WebGLBuffer} indexBuffer
   * @param {WebGLBuffer} colorBuffer
   * @param {number} length
   * @param {mat4} modelView
   * @param {mat4} projectionMatrix
   */
  draw_elements(
    positionBuffer,
    indexBuffer,
    colorBuffer,
    length,
    modelView,
    projectionMatrix
  ) {
    const gl = this.gl;
    const shaderProgram = this.shaderProgram;

    gl.uniformMatrix4fv(
      gl.getUniformLocation(shaderProgram, "u_projection"),
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      gl.getUniformLocation(shaderProgram, "u_model_view"),
      false,
      modelView
    );

    const positionAttributeLocation = gl.getAttribLocation(
      shaderProgram,
      "a_position"
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    {
      const size = 3;
      const type = gl.FLOAT;
      const normalized = false;
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalized,
        stride,
        offset
      );
    }
    gl.enableVertexAttribArray(positionAttributeLocation);

    // const colorAttributeLocation = gl.getAttribLocation(
    //   shaderProgram,
    //   "a_color"
    // );
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // {
    //   const size = 4;
    //   const type = gl.FLOAT;
    //   const normalized = false;
    //   const stride = 0;
    //   const offset = 0;
    //   gl.vertexAttribPointer(
    //     colorAttributeLocation,
    //     size,
    //     type,
    //     normalized,
    //     stride,
    //     offset
    //   );
    // }
    // gl.enableVertexAttribArray(colorAttributeLocation);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    {
      const count = length;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, count, type, offset);
    }
  }
}

function main() {
  const world = new World();
  world.init();
  world.createBuffer();
  world.addControllers();
  world.draw();
}

if (document.readyState !== "loading") {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}
