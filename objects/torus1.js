import { uvTorus } from "../simpleObjectLibrary.js";
import { mat4 } from "gl-matrix";
import GlObject from "../object-helper.js";

const {
  vertexPositions: vertices,
  vertexNormals: normals,
  indices: indices,
} = uvTorus(0.5, 0.2, 20, 20);

let modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [-2, 0, -6]);

let modelWorldMatrix = mat4.create();

const materialColor = [0.8, 0.8, 0.1];

const torus1 = new GlObject(
    vertices,
    normals,
    indices,
    modelViewMatrix,
    modelWorldMatrix,
    materialColor,
    (obj, deltaTime) => {}
);

export { torus1 };
