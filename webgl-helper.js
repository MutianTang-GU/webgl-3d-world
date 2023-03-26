export default class {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {string} vertexShaderSource
   * @param {string} fragmentShaderSource
   */
  constructor(gl, vertexShaderSource, fragmentShaderSource) {
    this.gl = gl;
    this.shaderProgram = this.createShaderProgram(
      vertexShaderSource,
      fragmentShaderSource
    );
  }

  /**
   * @param {string} vertexShaderSource
   * @param {string} fragmentShaderSource
   * @returns {WebGLProgram}
   * @description create shader program
   */
  createShaderProgram(vertexShaderSource, fragmentShaderSource) {
    const gl = this.gl;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new Error(
        "An error occurred compiling the shaders" +
          gl.getShaderInfoLog(vertexShader)
      );
    }
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error(
        "An error occurred compiling the shaders" +
          gl.getShaderInfoLog(fragmentShader)
      );
    }
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(program)
      );
    }
    gl.useProgram(program);
    return program;
  }

  /**
   * @param {Float32Array} vertices
   * @param {Float32Array} normals
   * @param {Uint16Array} indices
   * @param {string} positionAttributeName
   * @param {string} normalAttributeName
   */
  bufferData(
    vertices,
    normals,
    indices,
    positionAttributeName,
    normalAttributeName
  ) {
    const gl = this.gl;
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(
      this.shaderProgram,
      positionAttributeName
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
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
    const normalAttributeLocation = gl.getAttribLocation(
      this.shaderProgram,
      normalAttributeName
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    {
      const size = 3;
      const type = gl.FLOAT;
      const normalized = false;
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(
        normalAttributeLocation,
        size,
        type,
        normalized,
        stride,
        offset
      );
    }
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(normalAttributeLocation);
  }

  /**
   * @param {string} name
   * @param {Float32Array | number[] | number} value
   */
  setUniform(name, value) {
    const gl = this.gl;
    const location = gl.getUniformLocation(this.shaderProgram, name);
    if (value instanceof Float32Array) {
      gl.uniformMatrix4fv(location, false, value);
    } else if (value instanceof Array) {
      gl.uniform3fv(location, value);
    } else if (typeof value === "number") {
      gl.uniform1f(location, value);
    }
  }

  /**
   * @param {number} length
   */
  drawElements(length) {
    const gl = this.gl;
    gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
  }
}
