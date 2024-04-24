import CubismExpressionMotion from "../expressions/CubismExpressionMotion";

class MotionManager extends MotionQueueManager {
  set motionList(value: Record<string, Array<Live2DMotion | CubismExpressionMotion>>) {
    this._motionList = value;
  }

  get motionList(): Record<string, Live2DMotion[]> {
    return this._motionList;
  }

  get reservePriority(): number {
    return this._reservePriority;
  }

  set reservePriority(value: number) {
    this._reservePriority = value;
  }

  get currentPriority(): number {
    return this._currentPriority;
  }

  set currentPriority(value: number) {
    this._currentPriority = value;
  }

  private _currentPriority: number;
  private _reservePriority: number;
  private _motionList: Record<string, Live2DMotion[]>;

  constructor(motionList: Record<string, Live2DMotion[]>) {
    super();
    this._currentPriority = 0;
    this._reservePriority = 0;
    this._motionList = motionList;
  }

  getMotion(name: string, idx: number) {
    return this._motionList[name][idx];
  }

  getMotionNum(name: string) {
    return this._motionList[name].length;
  }

  reserveMotion(priority: number) {
    if (this.reservePriority >= priority) {
      return false;
    }
    if (this.currentPriority >= priority) {
      return false;
    }

    this.reservePriority = priority;

    return true;
  }

  setReservePriority(val: number) {
    this.reservePriority = val;
  }

  updateParam(model: Live2DModelWebGL) {
    const updated = MotionQueueManager.prototype.updateParam.call(this, model) as boolean;

    if (this.isFinished()) {
      this.currentPriority = 0;
    }

    return updated;
  }

  startMotionPrio(motion: Live2DMotion, priority: number) {
    if (priority == this.reservePriority) {
      this.reservePriority = 0;
    }
    this.currentPriority = priority;
    return this.startMotion(motion, false);
  }
}

export default MotionManager