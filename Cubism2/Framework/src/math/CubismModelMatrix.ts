import CubismMatrix44 from "./CubismMatrix44";

/**
 * 模型矩阵
 */
class CubismModelMatrix extends CubismMatrix44 {
  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  private _height: number;

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  private _width: number;

  constructor(w: number, h: number) {
    super();
    this._width = w;
    this._height = h;
  }

  setPosition(x: number, y: number) {
    this.translate(x, y)
  }

  setCenterPosition(x: number, y: number) {
    const w = this.width * this.getScaleX();
    const h = this.height * this.getScaleY();
    this.translate(x - w / 2, y - h / 2);
  }

  top(y: number) {
    this.setY(y);
  }

  bottom(y: number) {
    const h = this.height * this.getScaleY();
    this.translateY(y - h);
  }

  left(x: number) {
    this.setX(x);
  }

  right(x: number) {
    const w = this.width * this.getScaleX();
    this.translateX(x - w);
  }

  centerX(x: number) {
    const w = this.width * this.getScaleX();
    this.translateX(x - w / 2);
  }

  centerY(y: number) {
    const h = this.height * this.getScaleY();
    this.translateY(y - h / 2);
  }

  setX(x: number) {
    this.translateX(x);
  }

  setY(y: number) {
    this.translateY(y);
  }

  setHeight(h: number) {
    const scaleX = h / this.height;
    const scaleY = -scaleX;
    this.scale(scaleX, scaleY);
  }

  setWidth(w: number) {
    const scaleX = w / this.width;
    const scaleY = -scaleX;
    this.scale(scaleX, scaleY);
  }
}

export default CubismModelMatrix