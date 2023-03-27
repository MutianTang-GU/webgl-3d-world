import { cube } from "../simpleObjectLibrary.js";
import { mat4 } from "gl-matrix";
import GlObject from "../object-helper.js";

const {
  vertexPositions: vertices,
  vertexNormals: normals,
  indices: indices,
} = cube(0.2);

let modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [2, 0, -6]);

let modelWorldMatrix = mat4.create();

const materialColor = [0.1, 0.2, 0.8];

const cube2 = new GlObject(
  vertices,
  normals,
  indices,
  modelViewMatrix,
  modelWorldMatrix,
  materialColor,
  (obj, deltaTime) => {
    mat4.rotateY(obj.modelViewMatrix, obj.modelViewMatrix, -0.001 * deltaTime);
  }
);

export { cube2 };
