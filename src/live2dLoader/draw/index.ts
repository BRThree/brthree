import { CubismModel } from '@Cubism4/framework/model/cubismmodel.ts';
import { CubismPhysics } from '@Cubism4/framework/physics/cubismphysics.ts';
import { CubismPose } from '@Cubism4/framework/effect/cubismpose.ts';
import { CubismEyeBlink } from '@Cubism4/framework/effect/cubismeyeblink.ts';
import { CubismBreath } from '@Cubism4/framework/effect/cubismbreath.ts';
import { ICubismModelSetting } from '@Cubism4/framework/icubismmodelsetting.ts';
import { render, startRandomMotion } from '../motion';
import { expressionManager } from '../expression';
import { CubismMotionManager } from '@Cubism4/framework/motion/cubismmotionmanager.ts';
import { csmMap } from '@Cubism4/framework/type/csmmap.ts';
import { ACubismMotion } from '@Cubism4/framework/motion/acubismmotion.ts';
import { csmVector } from '@Cubism4/framework/type/csmvector.ts';
import { CubismId } from '@Cubism4/framework/id/cubismid.ts';
import { CubismFramework } from '@Cubism4/framework/live2dcubismframework.ts';
import { CubismDefaultParameterId } from '@Cubism4/framework/cubismdefaultparameterid.ts';
import { CubismModelMatrix } from '@Cubism4/framework/math/cubismmodelmatrix.ts';
import { CubismMatrix44 } from '@Cubism4/framework/math/cubismmatrix44.ts';
import { DRAG_MANAGER } from '../constant';

export let idParamAngleX: CubismId;
export let idParamAngleY: CubismId;
export let idParamAngleZ: CubismId;
export let idParamEyeBallX: CubismId;
export let idParamEyeBallY: CubismId;
export let idParamBodyAngleX: CubismId;
export const parameterInit = () => {
    idParamAngleX = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamAngleX
    );
    idParamAngleY = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamAngleY
    );
    idParamAngleZ = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamAngleZ
    );
    idParamEyeBallX = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamEyeBallX
    );
    idParamEyeBallY = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamEyeBallY
    );
    idParamBodyAngleX = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamBodyAngleX
    );
};

let s_currentFrame = 0.0;
let s_lastFrame = 0.0;
let s_deltaTime = 0.0;
/**
 * 更新函数
 * @param motionManager
 * @param motions
 * @param filePath
 * @param lipSyncIds
 * @param eyeBlinkIds
 * @param model
 * @param physics
 * @param pose
 * @param eyeBlink
 * @param breath
 * @param setting
 */
export const update = (
    motionManager: CubismMotionManager,
    motions: csmMap<string, ACubismMotion>,
    filePath: string,
    lipSyncIds: csmVector<CubismId>,
    eyeBlinkIds: csmVector<CubismId>,
    model: CubismModel,
    physics: CubismPhysics,
    pose: CubismPose,
    eyeBlink: CubismEyeBlink,
    breath: CubismBreath,
    setting: ICubismModelSetting
) => {
    const deltaTimeSeconds: number = s_deltaTime;

    DRAG_MANAGER.update(deltaTimeSeconds);
    const dragX = DRAG_MANAGER.getX();
    const dragY = DRAG_MANAGER.getY();

    // 参数是否通过运动更新
    let motionUpdated = false;

    //--------------------------------------------------------------------------
    model.loadParameters(); // 加载上次保存的状态
    if (motionManager.isFinished()) {
        // 如果没有动作播放，则从等待的动作随机播放。
        startRandomMotion(
            motionManager,
            motions,
            setting,
            'Idle',
            1,
            filePath,
            lipSyncIds,
            eyeBlinkIds
        );
    } else {
        motionUpdated = motionManager.updateMotion(model, deltaTimeSeconds); // 更新运动
    }
    model.saveParameters(); // 保存状态
    //--------------------------------------------------------------------------

    // 眨眼
    if (!motionUpdated) {
        if (eyeBlink != null) {
            // 当没有主运动更新时
            eyeBlink.updateParameters(model, deltaTimeSeconds); // 眼裂
        }
    }

    if (expressionManager != null) {
        expressionManager.updateMotion(model, deltaTimeSeconds); // 使用面部表情更新参数（相対変化）
    }

    // 拖动引起的更改
    // 通过拖动调整面部方向
    model.addParameterValueById(idParamAngleX, dragX * 30); // 将值从 -30 添加到 30
    model.addParameterValueById(idParamAngleY, dragY * 30);
    model.addParameterValueById(idParamAngleZ, dragX * dragY * -30);

    // 通过拖动调整身体方向
    model.addParameterValueById(idParamBodyAngleX, dragX * 10); // 将 -10 之间的值添加到 10

    // 通过拖动调整眼睛方向
    model.addParameterValueById(idParamEyeBallX, dragX); // 将值 -1 添加到 1
    model.addParameterValueById(idParamEyeBallY, dragY);

    // 呼吸
    if (breath != null) {
        breath.updateParameters(model, deltaTimeSeconds);
    }

    // 设置物理场
    if (physics != null) {
        physics.evaluate(model, deltaTimeSeconds);
    }

    // 姿势设置
    if (pose != null) {
        pose.updateParameters(model, deltaTimeSeconds);
    }

    model.update();
};

/**
 * 设置模型缩放
 * @param model
 * @param modelMatrix
 * @param width
 * @param height
 */
export const setModelScale = (
    model: CubismModel,
    modelMatrix: CubismModelMatrix,
    width: number,
    height: number
) => {
    const projection: CubismMatrix44 = new CubismMatrix44();

    if (model.getCanvasWidth() > 1.0 && width < height) {
        // 在垂直窗口中显示长水平模型时，请根据模型的水平大小计算比例。
        modelMatrix.setWidth(2.0);
        projection.scale(1.0, width / height);
    } else {
        projection.scale(height / width, 1.0);
    }

    projection.multiplyByMatrix(modelMatrix);
    render?.setMvpMatrix(projection);
};

/**
 * 画
 * @param canvas
 * @param frameBuffer
 */
const doDraw = (canvas: HTMLCanvasElement, frameBuffer: WebGLFramebuffer) => {
    const viewport: number[] = [0, 0, canvas.width, canvas.height];

    render?.setRenderState(frameBuffer, viewport);
    render?.drawModel();
};

/**
 * 帧循环函数
 * @param gl
 * @param canvas
 * @param frameBuffer
 * @param onUpdate
 */
export const loop = (
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
    frameBuffer: WebGLFramebuffer,
    onUpdate: () => void
): void => {
    s_currentFrame = Date.now();
    s_deltaTime = (s_currentFrame - s_lastFrame) / 1000;
    s_lastFrame = s_currentFrame;
    // 屏幕初始化
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    // 启用深度测试
    gl.enable(gl.DEPTH_TEST);

    // 附近的物体 远处的模糊物体
    gl.depthFunc(gl.LEQUAL);

    // 清除颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.clearDepth(1.0);

    // 透过设定
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    doDraw(canvas, frameBuffer);

    onUpdate();

    requestAnimationFrame(() => loop(gl, canvas, frameBuffer, onUpdate));
};
