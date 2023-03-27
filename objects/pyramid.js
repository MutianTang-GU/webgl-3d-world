import { uvCone } from "../simpleObjectLibrary.js";
import { mat4 } from "gl-matrix";
import GlObject from "../object-helper.js";

const {
  vertexPositions: vertices,
  vertexNormals: normals,
  indices: indices,
} = uvCone(0.3, 0.5, 12, false);

let modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [1, 0, -9]);
mat4.rotateX(modelViewMatrix, modelViewMatrix, -0.5 * Math.PI);

let modelWorldMatrix = mat4.create();

const materialColor = [0.9, 0.7, 0.0];

const pyramid = new GlObject(
  vertices,
  normals,
  indices,
  modelViewMatrix,
  modelWorldMatrix,
  materialColor,
  (obj, deltaTime, time) => {
    const height = 1 + Math.sin(0.001 * time);
    obj.modelWorldMatrix = mat4.create();
    mat4.translate(obj.modelWorldMatrix, obj.modelWorldMatrix, [0, 0, height]);
  }
);

export { pyramid };
