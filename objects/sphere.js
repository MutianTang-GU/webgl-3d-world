import { uvSphere } from "../simpleObjectLibrary.js";
import { mat4 } from "gl-matrix";
import GlObject from "../object-helper.js";

const {
  vertexPositions: vertices,
  vertexNormals: normals,
  indices: indices,
} = uvSphere(.2, 16, 8);

let modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [-2, 0, -6]);

let modelWorldMatrix = mat4.create();
mat4.translate(modelWorldMatrix, modelWorldMatrix, [1, 0, 0]);

const materialColor = [0.75, 0.75, 0.75];

const sphere = new GlObject(
  vertices,
  normals,
  indices,
  modelViewMatrix,
  modelWorldMatrix,
  materialColor,
  (obj, deltaTime) => {
    mat4.rotateY(obj.modelViewMatrix, obj.modelViewMatrix, 0.002 * deltaTime);
  }
);

export { sphere };
