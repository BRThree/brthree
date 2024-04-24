/**
 * 立体派2.1核心库的非官方声明文件。
 *
 * @see {@link http://doc.live2d.com/api/core/cpp2.0j/}
 */

declare class Live2D {
    static setGL(gl: WebGLRenderingContext, index?: number): void;

    static getError(): unknown | undefined;
}

declare class Live2DModelWebGL {
    static loadModel(buffer: ArrayBuffer): Live2DModelWebGL;

    private constructor();

    drawParamWebGL: Live2DObfuscated.DrawParamWebGL;

    getModelContext(): Live2DObfuscated.ModelContext;

    /**
     * @return 模型的Live2D绘图画布的宽度，但不是html画布元素。
     */
    getCanvasWidth(): number;

    /**
     * @return 模型的Live2D绘图画布的高度，但不是html画布元素的高度。
     */
    getCanvasHeight(): number;

    setTexture(index: number, texture: WebGLTexture): void;

    setMatrix(matrix: ArrayLike<number>): void;

    setParamFloat(id: string | number, value: number, weight?: number): unknown;

    addToParamFloat(id: string | number, value: number, weight?: number): unknown;

    multParamFloat(id: string | number, value: number, weight?: number): unknown;

    setPartsOpacity(id: string | number, value: number): unknown;

    getPartsOpacity(id: string | number): number;

    getParamFloat(id: string | number): number;

    getParamIndex(id: string): number;

    getPartsDataIndex(id: string): number;

    getDrawDataIndex(id: string): number;

    getTransformedPoints(index: number): Float32Array;

    loadParam(): void;

    saveParam(): void;

    update(): void;

    draw(): void;

    isPremultipliedAlpha(): any
}

declare class AMotion {
    setFadeIn(time: number): unknown;

    setFadeOut(time: number): unknown;

    updateParam(model: Live2DModelWebGL, entry: Live2DObfuscated.MotionQueueEnt): void

    updateParamExe(model: Live2DModelWebGL, time: number, weight: number, MotionQueueEnt: unknown): unknown;
}

declare class Live2DMotion extends AMotion {
    private constructor();

    static loadMotion(buffer: ArrayBuffer): Live2DMotion;
}

declare class MotionQueueManager {
    motions: unknown[];

    /**
     * @return 内部运动数组的大小。
     */
    startMotion(motion: AMotion, neverUsedArg?: boolean): number;

    stopAllMotions(): void;

    isFinished(): boolean;

    /**
     * @return 如果参数被任何运动更新，则为True。
     */
    updateParam(model: Live2DModelWebGL): boolean;
}

declare class PhysicsHair {
    static Src: {
        SRC_TO_X: string;
        SRC_TO_Y: string;
        SRC_TO_G_ANGLE: string;
    };
    static Target: {
        TARGET_FROM_ANGLE: string;
        TARGET_FROM_ANGLE_V: string;
    };

    setup(length: number, regist: number, mass: number): unknown;

    addSrcParam(type: string, id: string, scale: number, weight: number): unknown;

    addTargetParam(type: string, id: string, scale: number, weight: number): unknown;

    update(model: Live2DModelWebGL, time: number): unknown;
}

declare class PartsDataID {
    static getID(id: string): string;
}

declare class DrawDataID {
    id: string;
}

/**
 * Members that have been obfuscated.
 */
declare namespace Live2DObfuscated {
    class MotionQueueEnt {
        isFinished(): boolean;
    }

    class DrawParamWebGL {
        gl: WebGLRenderingContext;
        glno: number;

        firstDraw: boolean;

        culling: boolean;

        setGL(gl: WebGLRenderingContext): void;
    }

    class ModelContext {
        clipManager: ClipManager;

        /**
         * 这基本上是' DrawData[] '，但不可靠，因为它是一个模糊的属性。
         * 使用前一定要检查类型!
         */
        _$aS?: unknown; // DrawData[]

        getDrawData(index: number): DrawData | null;
    }

    class IDrawData {
        getDrawDataID(): DrawDataID;
    }

    class DrawData extends IDrawData {
        getNumPoints?(): unknown;

        draw(aN: unknown, aK: unknown, aI: Unknown_aB): void;
    }

    class Unknown_aB {
        baseOpacity: number;
    }

    class ClipManager {
        curFrameNo: number;

        getMaskRenderTexture(): number;

        setupClip(modelContext: ModelContext, drawParam: DrawParamWebGL): void;
    }
}
