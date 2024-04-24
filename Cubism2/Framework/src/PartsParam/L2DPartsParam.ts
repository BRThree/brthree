//============================================================
//============================================================
//  class L2DPartsParam
//============================================================
//============================================================
export default class L2DPartsParam {
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  private _id: string;

  get link(): Array<L2DPartsParam> | null {
    return this._link;
  }

  set link(value: Array<L2DPartsParam> | null) {
    this._link = value;
  }

  private _link: Array<L2DPartsParam> | null;

  get partsIndex(): number {
    return this._partsIndex;
  }

  set partsIndex(value: number) {
    this._partsIndex = value;
  }

  private _partsIndex: number;

  get paramIndex(): number {
    return this._paramIndex;
  }

  set paramIndex(value: number) {
    this._paramIndex = value;
  }

  private _paramIndex: number;

  constructor(id: string) {
    this._paramIndex = -1;
    this._partsIndex = -1;
    this._link = null;
    this._id = id;
  }


//============================================================//
//                 L2DPartsParam # initIndex()                //
//============================================================//
  initIndex(model: Live2DModelWebGL) {
    this.paramIndex = model.getParamIndex("VISIBLE:" + this.id);
    this.partsIndex = model.getPartsDataIndex(PartsDataID.getID(this.id));
    model.setParamFloat(this.paramIndex, 1);
  }
}