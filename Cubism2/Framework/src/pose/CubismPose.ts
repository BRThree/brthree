//============================================================
//============================================================
//  class CubismPose              
//============================================================
//============================================================
import L2DPartsParam from "../PartsParam/L2DPartsParam";

class CubismPose {
  get partsGroups(): any[] {
    return this._partsGroups;
  }

  set partsGroups(value: any[]) {
    this._partsGroups = value;
  }

  private _partsGroups: any[];

  get lastModel(): Live2DModelWebGL | null {
    return this._lastModel;
  }

  set lastModel(value: Live2DModelWebGL | null) {
    this._lastModel = value;
  }

  private _lastModel: Live2DModelWebGL | null;

  get lastTime(): number {
    return this._lastTime;
  }

  set lastTime(value: number) {
    this._lastTime = value;
  }

  private _lastTime: number;

  constructor() {
    this._lastTime = 0;
    this._lastModel = null; //ALive2DModel
    this._partsGroups = []; //ArrayList<L2DPartsParam[]>
  }

  //============================================================
//    static CubismPose.load()
//============================================================
  static load(json: Cubism2Spec.PoseJSON) {
    const ret = new CubismPose();
    const poseListInfo = json.parts_visible; //Value
    const poseNum = poseListInfo.length;
    for (let i_pose = 0; i_pose < poseNum; i_pose++) {
      const poseInfo = poseListInfo[i_pose]; //Value
      const idListInfo = poseInfo.group; //Value
      const idNum = idListInfo.length;
      const partsGroup = [];
      for (let i_group = 0; i_group < idNum; i_group++) {
        const partsInfo = idListInfo[i_group]; //Value
        const parts = new L2DPartsParam(partsInfo.id); //L2DPartsParamL2DPartsParam
        partsGroup[i_group] = parts;
        if (partsInfo.link == null) continue;
        const linkListInfo = partsInfo.link; //Value
        const linkNum = linkListInfo.length;
        parts.link = []; //ArrayList<L2DPartsParam>
        for (let i_link = 0; i_link < linkNum; i_link++) {
          const linkParts = new L2DPartsParam(linkListInfo[i_link]); //L2DPartsParamL2DPartsParam
          parts.link.push(linkParts);
        }
      }
      ret.partsGroups.push(partsGroup);
    }

    return ret;
  }

//============================================================
//    CubismPose # updateParam()
//============================================================
  updateParam(model: Live2DModelWebGL) {
    if (model == null) return;

    if (!(model == this.lastModel)) {
      this.initParam(model);
    }
    this.lastModel = model;

    const curTime = (window as any).UtSystem.getUserTimeMSec();
    let deltaTimeSec = ((this.lastTime == 0) ? 0 : (curTime - this.lastTime) / 1000.0);
    this.lastTime = curTime;
    if (deltaTimeSec < 0) deltaTimeSec = 0;
    for (let i = 0; i < this.partsGroups.length; i++) {
      this.normalizePartsOpacityGroup(model, this.partsGroups[i], deltaTimeSec);
      this.copyOpacityOtherParts(model, this.partsGroups[i]);
    }
  }

//============================================================
//    CubismPose # initParam()
//============================================================
  initParam(model: Live2DModelWebGL) {
    if (model == null) return;
    for (let i = 0; i < this.partsGroups.length; i++) {
      const partsGroup = this.partsGroups[i]; //L2DPartsParam
      for (let j = 0; j < partsGroup.length; j++) {
        partsGroup[j].initIndex(model);
        const partsIndex = partsGroup[j].partsIndex;
        const paramIndex = partsGroup[j].paramIndex;
        if (partsIndex < 0) continue;
        const v/*:Boolean*/ = (model.getParamFloat(paramIndex) != 0);
        model.setPartsOpacity(partsIndex, (v ? 1.0 : 0.0));
        model.setParamFloat(paramIndex, (v ? 1.0 : 0.0));
        if (partsGroup[j].link == null) continue;
        for (let k = 0; k < partsGroup[j].link.length; k++) {
          partsGroup[j].link[k].initIndex(model);
        }
      }
    }
  }

//============================================================
//    CubismPose # normalizePartsOpacityGroup()
//============================================================
  normalizePartsOpacityGroup(model: Live2DModelWebGL, partsGroup: L2DPartsParam[], deltaTimeSec: number) {
    let visibleParts = -1;
    let visibleOpacity = 1.0;
    const CLEAR_TIME_SEC = 0.5;
    const phi = 0.5;
    const maxBackOpacity = 0.15;
    for (let i = 0; i < partsGroup.length; i++) {
      const partsIndex = partsGroup[i].partsIndex;
      const paramIndex = partsGroup[i].paramIndex;
      if (partsIndex < 0) continue;
      if (model.getParamFloat(paramIndex) != 0) {
        if (visibleParts >= 0) {
          break;
        }
        visibleParts = i;
        visibleOpacity = model.getPartsOpacity(partsIndex);
        visibleOpacity += deltaTimeSec / CLEAR_TIME_SEC;
        if (visibleOpacity > 1) {
          visibleOpacity = 1;
        }
      }
    }
    if (visibleParts < 0) {
      visibleParts = 0;
      visibleOpacity = 1;
    }
    for (let i = 0; i < partsGroup.length; i++) {
      const partsIndex = partsGroup[i].partsIndex;
      if (partsIndex < 0) continue;
      if (visibleParts == i) {
        model.setPartsOpacity(partsIndex, visibleOpacity);
      } else {
        let opacity = model.getPartsOpacity(partsIndex);
        let a1;
        if (visibleOpacity < phi) {
          a1 = visibleOpacity * (phi - 1) / phi + 1;
        } else {
          a1 = (1 - visibleOpacity) * phi / (1 - phi);
        }
        const backOp = (1 - a1) * (1 - visibleOpacity);
        if (backOp > maxBackOpacity) {
          a1 = 1 - maxBackOpacity / (1 - visibleOpacity);
        }
        if (opacity > a1) {
          opacity = a1;
        }
        model.setPartsOpacity(partsIndex, opacity);
      }
    }
  }

//============================================================
//    CubismPose # copyOpacityOtherParts()
//============================================================
  copyOpacityOtherParts(model: Live2DModelWebGL, partsGroup: L2DPartsParam[]) {
    for (let i_group = 0; i_group < partsGroup.length; i_group++) {
      const partsParam = partsGroup[i_group]; //L2DPartsParam
      if (partsParam.link == null) continue;
      if (partsParam.partsIndex < 0) continue;
      const opacity = model.getPartsOpacity(partsParam.partsIndex);
      for (let i_link = 0; i_link < partsParam.link.length; i_link++) {
        const linkParts = partsParam.link[i_link]; //L2DPartsParam
        if (linkParts.partsIndex < 0) continue;
        model.setPartsOpacity(linkParts.partsIndex, opacity);
      }
    }
  }
}

export default CubismPose
