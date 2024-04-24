class CubismMatrix44 {
  get tr(): Float32Array {
    return this._tr;
  }

  set tr(value: Float32Array) {
    this._tr = value;
  }

  private _tr: Float32Array;

  constructor() {
    this._tr = new Float32Array(16); //
    this.identity();
  }

  static mul(a: number[] | Float32Array, b: number[] | Float32Array, dst: number[] | Float32Array) {
    const c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const n = 4;
    let i, j, k;
    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        for (k = 0; k < n; k++) {
          c[i + j * 4] += a[i + k * 4] * b[k + j * 4];
        }
      }
    }
    for (i = 0; i < 16; i++) {
      dst[i] = c[i];
    }
  }

  multiplyByMatrix(m: CubismMatrix44) {
    CubismMatrix44.mul(m.getArray(), this.tr, this.tr)
  }

  identity() {
    for (let i = 0; i < 16; i++)
      this.tr[i] = ((i % 5) == 0) ? 1 : 0;
  }

  translate(x: number, y: number) {
    this.tr[12] = x;
    this.tr[13] = y;
  }

  translateX(x: number) {
    this.tr[12] = x;
  }

  translateY(y: number) {
    this.tr[13] = y;
  }

  getScaleX() {
    return this.tr[0];
  }

  getScaleY() {
    return this.tr[5];
  }

  getArray() {
    return this.tr;
  }

  getCopyMatrix() {
    return new Float32Array(this.tr);
  }

  setMatrix(tr: number[]) {
    if (this.tr == null || this.tr.length != this.tr.length) return;
    for (let i = 0; i < 16; i++) this.tr[i] = tr[i];
  }

  transformX(src: number) {
    return this.tr[0] * src + this.tr[12];
  }

  transformY(src: number) {
    return this.tr[5] * src + this.tr[13];
  }

  invertTransformX(src: number) {
    return (src - this.tr[12]) / this.tr[0];
  }

  invertTransformY(src: number) {
    return (src - this.tr[13]) / this.tr[5];
  }

  multTranslate(shiftX: number, shiftY: number) {
    const tr1 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, shiftX, shiftY, 0, 1];
    CubismMatrix44.mul(tr1, this.tr, this.tr);
  }

  scale(scaleX: number, scaleY: number) {
    this.tr[0] = scaleX;
    this.tr[5] = scaleY;
  }

  multScale(scaleX: number, scaleY: number) {
    const tr1 = [scaleX, 0, 0, 0, 0, scaleY, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    CubismMatrix44.mul(tr1, this.tr, this.tr);
  }
}

export default CubismMatrix44