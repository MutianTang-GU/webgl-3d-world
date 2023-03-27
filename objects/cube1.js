import { cube } from "../simpleObjectLibrary.js";
import { mat4 } from "gl-matrix";
import GlObject from "../object-helper.js";

const {
  vertexPositions: vertices,
  vertexNormals: normals,
  indices: indices,
} = cube(0.2);

let modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);

let modelWorldMatrix = mat4.create();

const materialColor = [0.8, 0.2, 0.1];

const cube1 = new GlObject(
  vertices,
  normals,
  indices,
  modelViewMatrix,
  modelWorldMatrix,
  materialColor,
  (obj, deltaTime) => {
    mat4.rotateY(obj.modelViewMatrix, obj.modelViewMatrix, 0.001 * deltaTime);
  }
);

export { cube1 };
