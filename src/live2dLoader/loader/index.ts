import { ICubismModelSetting } from '@Cubism4/framework/icubismmodelsetting.ts';
import { CubismModelSettingJson } from '@Cubism4/framework/cubismmodelsettingjson.ts';
import { CubismModel } from '@Cubism4/framework/model/cubismmodel.ts';
import { CubismMoc } from '@Cubism4/framework/model/cubismmoc.ts';
import { CubismPhysics } from '@Cubism4/framework/physics/cubismphysics.ts';
import { CubismPose } from '@Cubism4/framework/effect/cubismpose.ts';
import { CubismEyeBlink } from '@Cubism4/framework/effect/cubismeyeblink.ts';
import {
    BreathParameterData,
    CubismBreath,
} from '@Cubism4/framework/effect/cubismbreath.ts';
import { csmVector } from '@Cubism4/framework/type/csmvector.ts';
import { CubismFramework } from '@Cubism4/framework/live2dcubismframework.ts';
import { CubismDefaultParameterId } from '@Cubism4/framework/cubismdefaultparameterid.ts';
import { CubismId, CubismIdHandle } from '@Cubism4/framework/id/cubismid.ts';
import { CubismModelMatrix } from '@Cubism4/framework/math/cubismmodelmatrix.ts';
import { csmMap } from '@Cubism4/framework/type/csmmap.ts';

/**
 * 加载model3.json配置文件
 * @param filePath
 */
export const loadSetting = async (
    filePath: string
): Promise<ICubismModelSetting> => {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    return new CubismModelSettingJson(arrayBuffer, arrayBuffer.byteLength);
};

/**
 * 加载模型（moc3）
 * @param setting
 * @param filePath
 */
export const loadModel = async (
    setting: ICubismModelSetting,
    filePath: string
): Promise<CubismModel> => {
    const response = await fetch(filePath + '/' + setting.getModelFileName());
    const arrayBuffer = await response.arrayBuffer();
    const moc: CubismMoc = CubismMoc.create(arrayBuffer, false);

    return moc.createModel();
};

/**
 * 加载物理
 * @param setting
 * @param filePath
 */
export const loadCubismPhysics = async (
    setting: ICubismModelSetting,
    filePath: string
): Promise<CubismPhysics> => {
    const physicsFileName = setting.getPhysicsFileName();

    const response = await fetch(`${filePath}/${physicsFileName}`);
    const arrayBuffer = await response.arrayBuffer();
    return CubismPhysics.create(arrayBuffer, arrayBuffer.byteLength);
};

/**
 * 加载姿势
 * @param setting
 * @param filePath
 */
export const loadCubismPose = async (
    setting: ICubismModelSetting,
    filePath: string
): Promise<CubismPose | null> => {
    const poseFileName = setting.getPoseFileName();

    if (!poseFileName) return null;

    const response = await fetch(`${filePath}/${poseFileName}`);
    const arrayBuffer = await response.arrayBuffer();

    return CubismPose.create(arrayBuffer, arrayBuffer.byteLength);
};

/**
 * 加载眨眼
 * @param setting
 */
export const setupEyeBlink = (
    setting: ICubismModelSetting
): CubismEyeBlink | null => {
    if (setting.getEyeBlinkParameterCount() <= 0) return null;

    return CubismEyeBlink.create(setting);
};

/**
 * 设置呼吸
 * @param idParamAngleX
 * @param idParamAngleY
 * @param idParamAngleZ
 * @param idParamBodyAngleX
 */
export const setupBreath = (
    idParamAngleX: CubismId,
    idParamAngleY: CubismId,
    idParamAngleZ: CubismId,
    idParamBodyAngleX: CubismId
): CubismBreath => {
    const breath = CubismBreath.create();
    const breathParameters: csmVector<BreathParameterData> = new csmVector();
    breathParameters.pushBack(
        new BreathParameterData(idParamAngleX, 0.0, 15.0, 6.5345, 0.5)
    );
    breathParameters.pushBack(
        new BreathParameterData(idParamAngleY, 0.0, 8.0, 3.5345, 0.5)
    );
    breathParameters.pushBack(
        new BreathParameterData(idParamAngleZ, 0.0, 10.0, 5.5345, 0.5)
    );
    breathParameters.pushBack(
        new BreathParameterData(idParamBodyAngleX, 0.0, 4.0, 15.5345, 0.5)
    );
    breathParameters.pushBack(
        new BreathParameterData(
            CubismFramework.getIdManager().getId(
                CubismDefaultParameterId.ParamBreath
            ),
            0.5,
            0.5,
            3.2345,
            1
        )
    );

    breath.setParameters(breathParameters);
    return breath;
};

/**
 * 设置口型同步
 * @param setting
 */
export const setupLipSyncIds = (
    setting: ICubismModelSetting
): csmVector<CubismIdHandle> => {
    const lipSyncIds = new csmVector<CubismIdHandle>();
    const lipSyncIdCount = setting.getLipSyncParameterCount();

    for (let i = 0; i < lipSyncIdCount; ++i) {
        lipSyncIds.pushBack(setting.getLipSyncParameterId(i));
    }

    return lipSyncIds;
};

/**
 * 设置布局
 * @param setting
 * @param modelMatrix
 */
export const setupLayout = (
    setting: ICubismModelSetting,
    modelMatrix: CubismModelMatrix
): void => {
    const layout: csmMap<string, number> = new csmMap<string, number>();

    if (setting == null || modelMatrix == null) {
        console.log('Failed to setupLayout().');
        return;
    }

    setting.getLayoutMap(layout);
    modelMatrix.setupFromLayout(layout);
};
