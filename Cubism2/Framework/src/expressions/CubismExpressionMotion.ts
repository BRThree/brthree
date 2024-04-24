import MotionQueueEnt = Live2DObfuscated.MotionQueueEnt;

class L2DExpressionParam {
  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }

  private _value: number;

  get type(): number {
    return this._type;
  }

  set type(value: number) {
    this._type = value;
  }

  private _type: number;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  private _id: string;

  constructor() {
    this._id = "";
    this._type = -1;
    this._value = 0;
  }
}

export default class CubismExpressionMotion extends AMotion {
  get paramList(): L2DExpressionParam[] {
    return this._paramList;
  }

  set paramList(value: L2DExpressionParam[]) {
    this._paramList = value;
  }

  private _paramList: L2DExpressionParam[];

  constructor() {
    super();
    this._paramList = [];
  }

  static EXPRESSION_DEFAULT = "DEFAULT";
  static TYPE_SET = 0;
  static TYPE_ADD = 1;
  static TYPE_MULT = 2;

//============================================================
//    static CubismExpressionMotion.loadJson()
//============================================================
  static loadJson(json: Cubism2Spec.ExpressionJSON) {
    const ret = new CubismExpressionMotion();

    ret.setFadeIn(json.fade_in > 0 ? json.fade_in : 1000);
    ret.setFadeOut(json.fade_out > 0 ? json.fade_out : 1000);

    if (json.params == null) {
      return ret;
    }

    let params = json.params;
    let paramNum = params.length;
    ret.paramList = []; //ArrayList<L2DExpressionParam>
    for (let i = 0; i < paramNum; i++) {
      let param = params[i];
      let paramID = param.id.toString();
      let value = param.val;
      let calcTypeInt = CubismExpressionMotion.TYPE_ADD;
      let calc = param.calc != null ? param.calc.toString() : "add";
      if (calc === "add") {
        calcTypeInt = CubismExpressionMotion.TYPE_ADD;
      } else if (calc === "mult") {
        calcTypeInt = CubismExpressionMotion.TYPE_MULT;
      } else if (calc === "set") {
        calcTypeInt = CubismExpressionMotion.TYPE_SET;
      } else {
        calcTypeInt = CubismExpressionMotion.TYPE_ADD;
      }
      if (calcTypeInt == CubismExpressionMotion.TYPE_ADD) {
        let defaultValue = param.def == null ? 0 : param.def;
        value = value - defaultValue;
      } else if (calcTypeInt == CubismExpressionMotion.TYPE_MULT) {
        let defaultValue = param.def == null ? 1 : param.def;
        if (defaultValue == 0) defaultValue = 1;
        value = value / defaultValue;
      }

      let item = new L2DExpressionParam();
      item.id = paramID;
      item.type = calcTypeInt;
      item.value = value;

      ret.paramList.push(item);
    }

    return ret;
  }


//============================================================
//    CubismExpressionMotion # updateParamExe()
//============================================================
  updateParamExe(model: Live2DModelWebGL, timeMSec: number, weight: number, motionQueueEnt: MotionQueueEnt) {
    for (let i = this.paramList.length - 1; i >= 0; --i) {
      let param = this.paramList[i]; //L2DExpressionParam
      // if (!param || !param.type) continue;
      if (param.type == CubismExpressionMotion.TYPE_ADD) {
        model.addToParamFloat(param.id, param.value, weight);
      } else if (param.type == CubismExpressionMotion.TYPE_MULT) {
        model.multParamFloat(param.id, param.value, weight);
      } else if (param.type == CubismExpressionMotion.TYPE_SET) {
        model.setParamFloat(param.id, param.value, weight);
      }
    }
  }
}