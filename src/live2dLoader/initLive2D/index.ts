import {Option, LogLevel, CubismFramework} from '@Cubism4/framework/live2dcubismframework';
import {AssetsResult, EyeBlinkInitResult, Live2DInitOpt} from "../type/Live2DLoaderType";
import {
  loadCubismPhysics,
  loadCubismPose,
  loadModel,
  loadSetting,
  setupBreath,
  setupEyeBlink,
  setupLayout,
  setupLipSyncIds
} from "../loader";
import {loadCubismExpression, setExpression} from "../expression";
import {csmMap} from "@Cubism4/framework/type/csmmap.ts";
import {ACubismMotion} from "@Cubism4/framework/motion/acubismmotion.ts";
import {ICubismModelSetting} from "@Cubism4/framework/icubismmodelsetting.ts";
import {CubismPose} from "@Cubism4/framework/effect/cubismpose.ts";
import {CubismEyeBlink} from "@Cubism4/framework/effect/cubismeyeblink.ts";
import {csmVector} from "@Cubism4/framework/type/csmvector.ts";
import {CubismIdHandle} from "@Cubism4/framework/id/cubismid.ts";
import {CubismModelMatrix} from "@Cubism4/framework/math/cubismmodelmatrix.ts";
import {loadCubismMotion} from "../motion";
import {
  idParamAngleX,
  idParamAngleY,
  idParamAngleZ,
  idParamBodyAngleX,
  loop,
  parameterInit,
  setModelScale,
  update
} from "../draw";

/**
 * cubism初始化
 */
const cubismFrameworkInit = () => {
  const cubismOption: Option = {
    logFunction: (message: string) => {
      console.log(message);
    },
    loggingLevel: LogLevel.LogLevel_Verbose
  };

  CubismFramework.startUp(cubismOption);
  CubismFramework.initialize();
};

/**
 * 默认表情切换事件
 * @param expressions
 */
const onChangeExpression = (expressions: csmMap<string, ACubismMotion>) => {
  if (expressions.getSize() == 0) {
    return;
  }

  const no: number = Math.floor(Math.random() * expressions.getSize());

  for (let i = 0; i < expressions.getSize(); i++) {
    if (i == no) {
      const name: string = expressions._keyValues[i].first;
      setExpression(expressions, name);
      return;
    }
  }
};

/**
 * 初始化各种静态文件
 * @param setting
 * @param filePath
 */
const assetsInit = async (setting: ICubismModelSetting, filePath: string): Promise<AssetsResult> => {
  const expressions =
    await loadCubismExpression(setting, filePath) as csmMap<string, ACubismMotion>;
  const physics = await loadCubismPhysics(setting, filePath);
  const pose = await loadCubismPose(setting, filePath) as CubismPose;

  return {
    expressions,
    physics,
    pose
  }
};

/**
 * 眨眼初始化
 * @param setting
 */
const eyeBlinkInit = (setting: ICubismModelSetting): EyeBlinkInitResult => {
  const eyeBlink = setupEyeBlink(setting) as CubismEyeBlink;

  const eyeBlinkIdCount: number =
    setting.getEyeBlinkParameterCount();

  const eyeBlinkIds = new csmVector<CubismIdHandle>();

  for (let i = 0; i < eyeBlinkIdCount; ++i) {
    eyeBlinkIds.pushBack(
      setting.getEyeBlinkParameterId(i)
    );
  }

  return {
    eyeBlink,
    eyeBlinkIds
  };
};

const init = async (opt: Live2DInitOpt) => {
  const {
    jsonPath,
    canvas,
    size,
    switchExpression
  } = opt
  // 初始化WebGL
  const live2dContainer: HTMLCanvasElement = canvas || document.createElement('canvas');
  const gl: WebGLRenderingContext = live2dContainer.getContext('webgl') as WebGLRenderingContext;
  const frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
  cubismFrameworkInit();
  parameterInit()

  const BASE_URL = jsonPath.slice(0, jsonPath.lastIndexOf('/'));

  // 加载模型
  const setting = await loadSetting(jsonPath);
  const model = await loadModel(setting, BASE_URL);

  // 保存参数
  model.saveParameters();

  // 设置画布大小
  live2dContainer.width = model.getCanvasWidth() * (size || 300);
  live2dContainer.height = model.getCanvasHeight() * (size || 300);

  const {
    expressions,
    physics,
    pose
  } = await assetsInit(setting, BASE_URL);

  const {eyeBlinkIds, eyeBlink} = eyeBlinkInit(setting);

  const lipSyncIds = setupLipSyncIds(setting);

  // 用于模型坐标设置的 4 x 4 矩阵
  const modelMatrix = new CubismModelMatrix(
    model.getCanvasWidth(),
    model.getCanvasHeight()
  );
  setupLayout(setting, modelMatrix);

  const breath = setupBreath(
    idParamAngleX,
    idParamAngleY,
    idParamAngleZ,
    idParamBodyAngleX
  );

  const {
    motionManager,
    motions
  } = await loadCubismMotion(model, setting, gl, BASE_URL, eyeBlinkIds, lipSyncIds);

  live2dContainer.onclick = () => {
    switchExpression ?
      switchExpression(expressions as csmMap<string, ACubismMotion>) :
      onChangeExpression(expressions as csmMap<string, ACubismMotion>);
  };

  loop(
    gl,
    live2dContainer,
    frameBuffer,
    () => {
      setModelScale(model, modelMatrix, live2dContainer.width, live2dContainer.height);

      update(
        motionManager,
        motions,
        BASE_URL,
        lipSyncIds,
        eyeBlinkIds,
        model,
        physics,
        pose,
        eyeBlink,
        breath,
        setting
      );
    });

  return {
    gl,
    live2dContainer,
    setting,
    model
  };
};

export default init;