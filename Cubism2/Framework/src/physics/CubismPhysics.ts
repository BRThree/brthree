class CubismPhysics {
  get startTimeMSec(): number {
    return this._startTimeMSec;
  }

  set startTimeMSec(value: number) {
    this._startTimeMSec = value;
  }

  private _startTimeMSec: number;

  get physicsList(): any[] {
    return this._physicsList;
  }

  set physicsList(value: any[]) {
    this._physicsList = value;
  }

  private _physicsList: any[];

  constructor() {
    this._physicsList = [];
    this._startTimeMSec = (window as any).UtSystem.getUserTimeMSec();
  }


//============================================================
//    static CubismPhysics.load()
//============================================================
  static load = function (json: Cubism2Spec.PhysicsJSON) {
    const ret = new CubismPhysics(); //L2DPhysicsL2DPhysics
    const params = json.physics_hair;
    const paramNum = params.length;
    for (let i = 0; i < paramNum; i++) {
      const param = params[i]; //Value
      const physics = new PhysicsHair(); //PhysicsHairPhysicsHair
      const setup = param.setup; //Value
      const length = (setup.length);
      const resist = (setup.regist);
      const mass = (setup.mass);
      physics.setup(length, resist, mass);
      const srcList = param.src; //Value
      const srcNum = srcList.length;
      for (let j = 0; j < srcNum; j++) {
        const src = srcList[j]; //Value
        const id = src.id; //String
        let type = PhysicsHair.Src.SRC_TO_X;
        const typeStr = src.ptype; //String
        if (typeStr === "x") {
          type = PhysicsHair.Src.SRC_TO_X;
        } else if (typeStr === "y") {
          type = PhysicsHair.Src.SRC_TO_Y;
        } else if (typeStr === "angle") {
          type = PhysicsHair.Src.SRC_TO_G_ANGLE;
        } else {
          (window as any).UtDebug.error("live2d", "Invalid parameter:PhysicsHair.Src");
        }
        const scale = (src.scale);
        const weight = (src.weight);
        physics.addSrcParam(type, id, scale, weight);
      }
      const targetList = param.targets; //Value
      const targetNum = targetList.length;
      for (let j = 0; j < targetNum; j++) {
        const target = targetList[j]; //Value
        const id = target.id; //String
        let type = PhysicsHair.Target.TARGET_FROM_ANGLE;
        const typeStr = target.ptype; //String
        if (typeStr === "angle") {
          type = PhysicsHair.Target.TARGET_FROM_ANGLE;
        } else if (typeStr === "angle_v") {
          type = PhysicsHair.Target.TARGET_FROM_ANGLE_V;
        } else {
          (window as any).UtDebug.error("live2d", "Invalid parameter:PhysicsHair.Target");
        }
        const scale = (target.scale);
        const weight = (target.weight);
        physics.addTargetParam(type, id, scale, weight);
      }
      ret.physicsList.push(physics);
    }
    return ret;
  }

//============================================================
//    CubismPhysics # updateParam()
//============================================================
  updateParam(model: Live2DModelWebGL) {
    const timeMSec = (window as any).UtSystem.getUserTimeMSec() - this.startTimeMSec;

    for (let i = 0; i < this.physicsList.length; i++) {
      this.physicsList[i].update(model, timeMSec);
    }
  }
}

export default CubismPhysics
