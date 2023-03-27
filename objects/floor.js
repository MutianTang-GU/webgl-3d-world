import { mat4 } from "gl-matrix";
import GlObject from "../object-helper.js";

const vertices = new Float32Array([
  -10.0, 0.0, -10.0,

  10.0, 0.0, -10.0,

  10.0, 0.0, 10.0,

  -10.0, 0.0, 10.0,
]);

const normals = new Float32Array([
  0.0, 1.0, 0.0,

  0.0, 1.0, 0.0,

  0.0, 1.0, 0.0,

  0.0, 1.0, 0.0,
]);

const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

let modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [0, -1, 0]);

let modelWorldMatrix = mat4.create();

const materialColor = [0.15, 0.6, 0.15];

const floor = new GlObject(
  vertices,
  normals,
  indices,
  modelViewMatrix,
  modelWorldMatrix,
  materialColor,
  (obj, deltaTime) => {
    // do nothing
  }
);

export { floor };
