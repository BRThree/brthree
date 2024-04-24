const EYE_STATE = {
  STATE_FIRST: "STATE_FIRST",
  STATE_INTERVAL: "STATE_INTERVAL",
  STATE_CLOSING: "STATE_CLOSING",
  STATE_CLOSED: "STATE_CLOSED",
  STATE_OPENING: "STATE_OPENING"
}

//============================================================
//============================================================
//  class CubismEyeBlink          
//============================================================
//============================================================
class CubismEyeBlink {
  get eyeID_R(): string {
    return this._eyeID_R;
  }

  set eyeID_R(value: string) {
    this._eyeID_R = value;
  }

  private _eyeID_R: string;

  get eyeID_L(): string {
    return this._eyeID_L;
  }

  set eyeID_L(value: string) {
    this._eyeID_L = value;
  }

  private _eyeID_L: string;

  get closeIfZero(): boolean {
    return this._closeIfZero;
  }

  set closeIfZero(value: boolean) {
    this._closeIfZero = value;
  }

  private _closeIfZero: boolean;

  get openingMotionMsec(): number {
    return this._openingMotionMsec;
  }

  set openingMotionMsec(value: number) {
    this._openingMotionMsec = value;
  }

  private _openingMotionMsec: number;

  get closedMotionMsec(): number {
    return this._closedMotionMsec;
  }

  set closedMotionMsec(value: number) {
    this._closedMotionMsec = value;
  }

  private _closedMotionMsec: number;

  get closingMotionMsec(): number {
    return this._closingMotionMsec;
  }

  set closingMotionMsec(value: number) {
    this._closingMotionMsec = value;
  }

  private _closingMotionMsec: number;

  get blinkIntervalMsec(): number {
    return this._blinkIntervalMsec;
  }

  set blinkIntervalMsec(value: number) {
    this._blinkIntervalMsec = value;
  }

  private _blinkIntervalMsec: number;

  get eyeState(): string {
    return this._eyeState;
  }

  set eyeState(value: string) {
    this._eyeState = value;
  }

  private _eyeState: string;

  get stateStartTime(): number {
    return this._stateStartTime;
  }

  set stateStartTime(value: number) {
    this._stateStartTime = value;
  }

  private _stateStartTime: number;

  get nextBlinkTime(): number {
    return this._nextBlinkTime;
  }

  set nextBlinkTime(value: number) {
    this._nextBlinkTime = value;
  }

  private _nextBlinkTime: number;

  constructor() {
    this._nextBlinkTime = 0 /* TODO NOT INIT */; //
    this._stateStartTime = 0 /* TODO NOT INIT */; //
    this._eyeState = EYE_STATE.STATE_FIRST;
    this._blinkIntervalMsec = 4000;
    this._closingMotionMsec = 100;
    this._closedMotionMsec = 50;
    this._openingMotionMsec = 150;
    this._closeIfZero = true;
    this._eyeID_L = "PARAM_EYE_L_OPEN";
    this._eyeID_R = "PARAM_EYE_R_OPEN";
  }

  //============================================================
//    CubismEyeBlink # calcNextBlink()
//============================================================
  calcNextBlink() {
    const time /*long*/ = (window as any).UtSystem.getUserTimeMSec();
    const r /*Number*/ = Math.random();
    return  /*(long)*/ (time + r * (2 * this.blinkIntervalMsec - 1));
  }

//============================================================
//    CubismEyeBlink # setInterval()
//============================================================
  setInterval(blinkIntervalMsec :number) {
    this.blinkIntervalMsec = blinkIntervalMsec;
  }

//============================================================
//    CubismEyeBlink # setEyeMotion()
//============================================================
  setEyeMotion(closingMotionMsec:number, closedMotionMsec:number, openingMotionMsec:number) {
    this.closingMotionMsec = closingMotionMsec;
    this.closedMotionMsec = closedMotionMsec;
    this.openingMotionMsec = openingMotionMsec;
  }

//============================================================
//    CubismEyeBlink # updateParam()
//============================================================
  updateParam(model: Live2DModelWebGL) {
    const time /*:long*/ = (window as any).UtSystem.getUserTimeMSec();
    let eyeParamValue /*:Number*/;
    let t /*:Number*/ = 0;
    switch (this.eyeState) {
      case EYE_STATE.STATE_CLOSING:
        t = (time - this.stateStartTime) / this.closingMotionMsec;
        if (t >= 1) {
          t = 1;
          this.eyeState = EYE_STATE.STATE_CLOSED;
          this.stateStartTime = time;
        }
        eyeParamValue = 1 - t;
        break;
      case EYE_STATE.STATE_CLOSED:
        t = (time - this.stateStartTime) / this.closedMotionMsec;
        if (t >= 1) {
          this.eyeState = EYE_STATE.STATE_OPENING;
          this.stateStartTime = time;
        }
        eyeParamValue = 0;
        break;
      case EYE_STATE.STATE_OPENING:
        t = (time - this.stateStartTime) / this.openingMotionMsec;
        if (t >= 1) {
          t = 1;
          this.eyeState = EYE_STATE.STATE_INTERVAL;
          this.nextBlinkTime = this.calcNextBlink();
        }
        eyeParamValue = t;
        break;
      case EYE_STATE.STATE_INTERVAL:
        if (this.nextBlinkTime < time) {
          this.eyeState = EYE_STATE.STATE_CLOSING;
          this.stateStartTime = time;
        }
        eyeParamValue = 1;
        break;
      case EYE_STATE.STATE_FIRST:
      default:
        this.eyeState = EYE_STATE.STATE_INTERVAL;
        this.nextBlinkTime = this.calcNextBlink();
        eyeParamValue = 1;
        break;
    }
    if (!this.closeIfZero) eyeParamValue = -eyeParamValue;
    model.setParamFloat(this.eyeID_L, eyeParamValue);
    model.setParamFloat(this.eyeID_R, eyeParamValue);
  }
}

export default CubismEyeBlink