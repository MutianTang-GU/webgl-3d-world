export default class {
  /**
   *
   * @param {Float32Array} vertices
   * @param {Float32Array} normals
   * @param {Uint16Array} indices
   * @param {Iterable<number>} modelViewMatrix
   * @param {Iterable<number>} modelWorldMatrix
   * @param {Array.<number>} materialColor
   * @param {function(GlObject, DOMHighResTimeStamp): void} updateFunc
   */
  constructor(
    vertices,
    normals,
    indices,
    modelViewMatrix,
    modelWorldMatrix,
    materialColor,
    updateFunc
  ) {
    this.vertices = vertices;
    this.normals = normals;
    this.indices = indices;
    this.modelViewMatrix = modelViewMatrix;
    this.modelWorldMatrix = modelWorldMatrix;
    this.materialColor = materialColor;
    this.updateFunc = updateFunc ?? ((obj, deltaTime, time) => {});
  }

  /**
   * @param {DOMHighResTimeStamp} deltaTime
   */
  update(deltaTime, time) {
    this.updateFunc(this, deltaTime, time);
  }
}
