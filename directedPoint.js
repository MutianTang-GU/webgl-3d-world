/**
 * @class DirectedPoint
 * @property {Array.<number>} position
 * @property {number} longitude
 * @property {number} latitude
 */
export default class DirectedPoint {
  constructor() {
    this.position = [0, 0, 0];
    this.longitude = 0; // point to -z axis
    this.latitude = 0;
  }

  get direction() {
    return [
      Math.sin(this.longitude) * Math.cos(this.latitude),
      Math.sin(this.latitude),
      -Math.cos(this.longitude) * Math.cos(this.latitude),
    ];
  }
  reset() {
    this.position = [0, 0, 0];
    this.longitude = 0;
    this.latitude = 0;
  }
  forward(d) {
    this.position[0] += d * Math.sin(this.longitude) * Math.cos(this.latitude);
    this.position[1] += d * Math.sin(this.latitude);
    this.position[2] -= d * Math.cos(this.longitude) * Math.cos(this.latitude);
  }
  backward(d) {
    this.position[0] -= d * Math.sin(this.longitude) * Math.cos(this.latitude);
    this.position[1] -= d * Math.sin(this.latitude);
    this.position[2] += d * Math.cos(this.longitude) * Math.cos(this.latitude);
  }
  left(d) {
    this.position[0] -= d * Math.cos(this.longitude);
    this.position[2] -= d * Math.sin(this.longitude);
  }
  right(d) {
    this.position[0] += d * Math.cos(this.longitude);
    this.position[2] += d * Math.sin(this.longitude);
  }
  up(d) {
    this.position[1] += d;
  }
  down(d) {
    this.position[1] -= d;
  }
  turnLeft(angle) {
    this.longitude -= angle;
  }
  turnRight(angle) {
    this.longitude += angle;
  }
  tiltUp(angle) {
    this.latitude += angle;
    if (this.latitude > Math.PI / 2) {
      this.latitude = Math.PI / 2;
      return false;
    }
    return true;
  }
  tiltDown(angle) {
    this.latitude -= angle;
    if (this.latitude < -Math.PI / 2) {
      this.latitude = -Math.PI / 2;
      return false;
    }
    return true;
  }
}
