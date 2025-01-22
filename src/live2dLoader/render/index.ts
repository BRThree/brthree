import { CubismModel } from '@Cubism4/framework/model/cubismmodel.ts';
import { CubismRenderer_WebGL } from '@Cubism4/framework/rendering/cubismrenderer_webgl.ts';

export const createRenderer = (
    maskBufferCount = 1,
    model: CubismModel
): CubismRenderer_WebGL => {
    const renderer = new CubismRenderer_WebGL();
    renderer.initialize(model, maskBufferCount);
    return renderer;
};
