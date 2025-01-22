import { CubismModel } from '@Cubism4/framework/model/cubismmodel.ts';
import { ICubismModelSetting } from '@Cubism4/framework/icubismmodelsetting.ts';
import { CubismMotionManager } from '@Cubism4/framework/motion/cubismmotionmanager.ts';
import { CubismMotion } from '@Cubism4/framework/motion/cubismmotion.ts';
import {
    ACubismMotion,
    FinishedMotionCallback,
} from '@Cubism4/framework/motion/acubismmotion.ts';
import { setupTextures } from '../textures';
import { createRenderer } from '../render';
import { csmMap } from '@Cubism4/framework/type/csmmap.ts';
import { csmVector } from '@Cubism4/framework/type/csmvector.ts';
import { CubismIdHandle } from '@Cubism4/framework/id/cubismid.ts';
import {
    CubismMotionQueueEntryHandle,
    InvalidMotionQueueEntryHandleValue,
} from '@Cubism4/framework/motion/cubismmotionqueuemanager.ts';
import { CubismRenderer_WebGL } from '@Cubism4/framework/rendering/cubismrenderer_webgl.ts';

export let render: CubismRenderer_WebGL | undefined;

/**
 * 预加载运动组
 * @param group
 * @param setting
 * @param model
 * @param gl
 * @param filePath
 * @param motionManager
 * @param motions
 * @param allMotionCount
 * @param eyeBlinkIds
 * @param lipSyncIds
 */
const preLoadMotionGroup = async (
    group: string,
    setting: ICubismModelSetting,
    model: CubismModel,
    gl: WebGLRenderingContext,
    filePath: string,
    motionManager: CubismMotionManager,
    motions: csmMap<string, ACubismMotion>,
    allMotionCount: number,
    eyeBlinkIds: csmVector<CubismIdHandle>,
    lipSyncIds: csmVector<CubismIdHandle>
): Promise<void> => {
    let motionCount = 0;
    for (let i = 0; i < setting.getMotionCount(group); i++) {
        const motionFileName = setting.getMotionFileName(group, i);

        // ex) idle_0
        const name = `${group}_${i}`;

        const response = await fetch(`${filePath}/${motionFileName}`);
        const arrayBuffer = await response.arrayBuffer();

        const tmpMotion: CubismMotion = CubismMotion.create(
            arrayBuffer,
            arrayBuffer.byteLength
        );

        let fadeTime = setting.getMotionFadeInTimeValue(group, i);
        if (fadeTime >= 0.0) {
            tmpMotion.setFadeInTime(fadeTime);
        }

        fadeTime = setting.getMotionFadeOutTimeValue(group, i);
        if (fadeTime >= 0.0) {
            tmpMotion.setFadeOutTime(fadeTime);
        }
        tmpMotion.setEffectIds(eyeBlinkIds, lipSyncIds);

        if (motions.getValue(name) != null) {
            ACubismMotion.delete(motions.getValue(name));
        }

        motions.setValue(name, tmpMotion);

        motionCount++;
        if (motionCount >= allMotionCount) {
            // 停止所有运动
            motionManager.stopAllMotions();
            const render = createRenderer(1, model);
            setupTextures(setting, gl, filePath, render);
            render.startUp(gl);
        }
    }
};

/**
 * 加载运动
 * @param model
 * @param setting
 * @param gl
 * @param filePath
 * @param eyeBlinkIds
 * @param lipSyncIds
 */
export const loadCubismMotion = async (
    model: CubismModel,
    setting: ICubismModelSetting,
    gl: WebGLRenderingContext,
    filePath: string,
    eyeBlinkIds: csmVector<CubismIdHandle>,
    lipSyncIds: csmVector<CubismIdHandle>
) => {
    const motionManager = new CubismMotionManager();
    const motions = new csmMap<string, ACubismMotion>();
    let allMotionCount = 0;

    model.saveParameters();

    const group: string[] = [];

    const motionGroupCount: number = setting.getMotionGroupCount();

    for (let i = 0; i < motionGroupCount; i++) {
        group[i] = setting.getMotionGroupName(i);
        allMotionCount += setting.getMotionCount(group[i]);
    }

    for (let i = 0; i < motionGroupCount; i++) {
        await preLoadMotionGroup(
            group[i],
            setting,
            model,
            gl,
            filePath,
            motionManager,
            motions,
            allMotionCount,
            eyeBlinkIds,
            lipSyncIds
        );
    }

    if (motionGroupCount == 0) {
        // 停止所有运动
        motionManager.stopAllMotions();
        render = createRenderer(1, model);
        setupTextures(setting, gl, filePath, render);
        render.startUp(gl);
    }

    return {
        motionManager,
        motions,
    };
};

/**
 * 开始播放动画
 * @param motionManager
 * @param motions
 * @param setting
 * @param group
 * @param no
 * @param priority
 * @param filePath
 * @param eyeBlinkIds
 * @param lipSyncIds
 * @param onFinishedMotionHandler
 */
const startMotion = (
    motionManager: CubismMotionManager,
    motions: csmMap<string, ACubismMotion>,
    setting: ICubismModelSetting,
    group: string,
    no: number,
    priority: number,
    filePath: string,
    eyeBlinkIds: csmVector<CubismIdHandle>,
    lipSyncIds: csmVector<CubismIdHandle>,
    onFinishedMotionHandler?: FinishedMotionCallback
): CubismMotionQueueEntryHandle => {
    if (priority == 3) {
        motionManager.setReservePriority(priority);
    } else if (!motionManager.reserveMotion(priority)) {
        return InvalidMotionQueueEntryHandleValue;
    }

    const motionFileName = setting.getMotionFileName(group, no);

    const name = `${group}_${no}`;
    let motion: CubismMotion = motions.getValue(name) as CubismMotion;
    let autoDelete = false;

    if (motion == null) {
        fetch(`${filePath}/${motionFileName}`)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => {
                motion = CubismMotion.create(
                    arrayBuffer,
                    arrayBuffer.byteLength,
                    onFinishedMotionHandler
                );
                let fadeTime: number = setting.getMotionFadeInTimeValue(
                    group,
                    no
                );

                if (fadeTime >= 0.0) {
                    motion.setFadeInTime(fadeTime);
                }

                fadeTime = setting.getMotionFadeOutTimeValue(group, no);
                if (fadeTime >= 0.0) {
                    motion.setFadeOutTime(fadeTime);
                }

                motion.setEffectIds(eyeBlinkIds, lipSyncIds);
                autoDelete = true;
            });
    } else {
        motion.setFinishedMotionHandler(onFinishedMotionHandler!);
    }

    //voice
    // const voice = setting.getMotionSoundFileName(group, no);
    // if (voice.localeCompare('') != 0) {
    //   let path = voice;
    //   path = BASE_URL + '/' + path;
    //   wavFileHandler.start(path);
    // }

    return motionManager.startMotionPriority(motion, autoDelete, priority);
};

/**
 *
 * @param motionManager
 * @param motions
 * @param setting
 * @param group
 * @param priority
 * @param filePath
 * @param eyeBlinkIds
 * @param lipSyncIds
 * @param onFinishedMotionHandler
 */
export const startRandomMotion = (
    motionManager: CubismMotionManager,
    motions: csmMap<string, ACubismMotion>,
    setting: ICubismModelSetting,
    group: string,
    priority: number,
    filePath: string,
    eyeBlinkIds: csmVector<CubismIdHandle>,
    lipSyncIds: csmVector<CubismIdHandle>,
    onFinishedMotionHandler?: FinishedMotionCallback
): CubismMotionQueueEntryHandle => {
    if (setting.getMotionCount(group) == 0) {
        return InvalidMotionQueueEntryHandleValue;
    }

    const no: number = Math.floor(
        Math.random() * setting.getMotionCount(group)
    );

    return startMotion(
        motionManager,
        motions,
        setting,
        group,
        no,
        priority,
        filePath,
        eyeBlinkIds,
        lipSyncIds,
        onFinishedMotionHandler
    );
};
