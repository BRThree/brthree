import CubismMatrix44 from "./CubismMatrix44";

class CubismViewMatrix extends CubismMatrix44 {
  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
  }

  private _min: number;

  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
  }

  private _max: number;

  get maxBottom(): number {
    return this._maxBottom;
  }

  set maxBottom(value: number) {
    this._maxBottom = value;
  }

  private _maxBottom: number;

  get maxTop(): number {
    return this._maxTop;
  }

  set maxTop(value: number) {
    this._maxTop = value;
  }

  private _maxTop: number;

  get maxRight(): number {
    return this._maxRight;
  }

  set maxRight(value: number) {
    this._maxRight = value;
  }

  private _maxRight: number;

  get maxLeft(): number {
    return this._maxLeft;
  }

  set maxLeft(value: number) {
    this._maxLeft = value;
  }

  private _maxLeft: number;

  get screenBottom(): number {
    return this._screenBottom;
  }

  set screenBottom(value: number) {
    this._screenBottom = value;
  }

  private _screenBottom: number;

  get screenTop(): number {
    return this._screenTop;
  }

  set screenTop(value: number) {
    this._screenTop = value;
  }

  private _screenTop: number;

  get screenRight(): number {
    return this._screenRight;
  }

  set screenRight(value: number) {
    this._screenRight = value;
  }

  private _screenRight: number;

  get screenLeft(): number {
    return this._screenLeft;
  }

  set screenLeft(value: number) {
    this._screenLeft = value;
  }

  private _screenLeft: number;

  constructor() {
    super();
    this._screenLeft = 0;
    this._screenRight = 0;
    this._screenTop = 0;
    this._screenBottom = 0;
    this._maxLeft = 0;
    this._maxRight = 0;
    this._maxTop = 0;
    this._maxBottom = 0;
    this._max = Number.MAX_VALUE;
    this._min = 0;
  }

//============================================================
//    L2DViewMatrix # getMaxScale()
//============================================================
  getMaxScale() {
    return this.max;
  }

//============================================================
//    L2DViewMatrix # getMinScale()
//============================================================
  getMinScale() {
    return this.min;
  }

//============================================================
//    L2DViewMatrix # setMaxScale()
//============================================================
  setMaxScale(v: number) {
    this.max = v;
  }

//============================================================
//    L2DViewMatrix # setMinScale()
//============================================================
  setMinScale(v: number) {
    this.min = v;
  }

//============================================================
//    L2DViewMatrix # isMaxScale()
//============================================================
  isMaxScale() {
    return this.getScaleX() == this.max;
  }

//============================================================
//    L2DViewMatrix # isMinScale()
//============================================================
  isMinScale() {
    return this.getScaleX() == this.min;
  }

//============================================================
//    L2DViewMatrix # adjustTranslate()
//============================================================
  adjustTranslate(shiftX: number, shiftY: number) {
    if (this.tr[0] * this.maxLeft + (this.tr[12] + shiftX) > this.screenLeft)
      shiftX = this.screenLeft - this.tr[0] * this.maxLeft - this.tr[12];
    if (this.tr[0] * this.maxRight + (this.tr[12] + shiftX) < this.screenRight)
      shiftX = this.screenRight - this.tr[0] * this.maxRight - this.tr[12];
    if (this.tr[5] * this.maxTop + (this.tr[13] + shiftY) < this.screenTop)
      shiftY = this.screenTop - this.tr[5] * this.maxTop - this.tr[13];
    if (this.tr[5] * this.maxBottom + (this.tr[13] + shiftY) > this.screenBottom)
      shiftY = this.screenBottom - this.tr[5] * this.maxBottom - this.tr[13];

    const tr1 = [1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      shiftX, shiftY, 0, 1];
    CubismMatrix44.mul(tr1, this.tr, this.tr);
  }

//============================================================
//    L2DViewMatrix # adjustScale()
//============================================================
  adjustScale(cx: number, cy: number, scale: number) {
    const targetScale = scale * this.tr[0];
    if (targetScale < this.min) {
      if (this.tr[0] > 0) scale = this.min / this.tr[0];
    } else if (targetScale > this.max) {
      if (this.tr[0] > 0) scale = this.max / this.tr[0];
    }
    const tr1 = [1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      cx, cy, 0, 1];
    const tr2 = [scale, 0, 0, 0,
      0, scale, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1];
    const tr3 = [1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      -cx, -cy, 0, 1];
    CubismMatrix44.mul(tr3, this.tr, this.tr);
    CubismMatrix44.mul(tr2, this.tr, this.tr);
    CubismMatrix44.mul(tr1, this.tr, this.tr);
  }

//============================================================
//    L2DViewMatrix # setScreenRect()
//============================================================
  setScreenRect(left: number, right: number, bottom: number, top: number) {
    this.screenLeft = left;
    this.screenRight = right;
    this.screenTop = top;
    this.screenBottom = bottom;
  }

//============================================================
//    L2DViewMatrix # setMaxScreenRect()
//============================================================
  setMaxScreenRect(left: number, right: number, bottom: number, top: number) {
    this.maxLeft = left;
    this.maxRight = right;
    this.maxTop = top;
    this.maxBottom = bottom;
  }

//============================================================
//    L2DViewMatrix # getScreenLeft()
//============================================================
  getScreenLeft() {
    return this.screenLeft;
  }

//============================================================
//    L2DViewMatrix # getScreenRight()
//============================================================
  getScreenRight() {
    return this.screenRight;
  }

//============================================================
//    L2DViewMatrix # getScreenBottom()
//============================================================
  getScreenBottom() {
    return this.screenBottom;
  }

//============================================================
//    L2DViewMatrix # getScreenTop()
//============================================================
  getScreenTop() {
    return this.screenTop;
  }

//============================================================
//    L2DViewMatrix # getMaxLeft()
//============================================================
  getMaxLeft() {
    return this.maxLeft;
  }

//============================================================
//    L2DViewMatrix # getMaxRight()
//============================================================
  getMaxRight() {
    return this.maxRight;
  }

//============================================================
//    L2DViewMatrix # getMaxBottom()
//============================================================
  getMaxBottom() {
    return this.maxBottom;
  }

//============================================================
//    L2DViewMatrix # getMaxTop()
//============================================================
  getMaxTop() {
    return this.maxTop;
  }
}

export default CubismViewMatrix