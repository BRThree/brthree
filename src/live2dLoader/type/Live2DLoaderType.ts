import {CubismId, CubismIdHandle} from "@Cubism4/framework/id/cubismid.ts";
import {csmMap} from "@Cubism4/framework/type/csmmap.ts";
import {ACubismMotion} from "@Cubism4/framework/motion/acubismmotion.ts";
import {CubismPhysics} from "@Cubism4/framework/physics/cubismphysics.ts";
import {CubismPose} from "@Cubism4/framework/effect/cubismpose.ts";
import {CubismEyeBlink} from "@Cubism4/framework/effect/cubismeyeblink.ts";
import {csmVector} from "@Cubism4/framework/type/csmvector.ts";

export interface TextureInfo {
  img: HTMLImageElement;
  id: WebGLTexture;
  width: number;
  height: number;
  usePremultply: boolean;
  fileName: string;
}

export interface IdParameter {
  idParamAngleX: CubismId,
  idParamAngleY: CubismId,
  idParamAngleZ: CubismId,
  idParamEyeBallX: CubismId,
  idParamEyeBallY: CubismId,
  idParamBodyAngleX: CubismId
}

export interface Live2DInitOpt {
  jsonPath: string
  canvas?: HTMLCanvasElement
  size?: number
  switchExpression?: (expressions: csmMap<string, ACubismMotion>) => void
}

export interface AssetsResult {
  expressions: csmMap<string, ACubismMotion>
  physics: CubismPhysics
  pose: CubismPose
}

export interface EyeBlinkInitResult {
  eyeBlink: CubismEyeBlink
  eyeBlinkIds: csmVector<CubismIdHandle>
}