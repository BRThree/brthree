import {TextureInfo} from "../type/Live2DLoaderType.ts";
import {csmVector, iterator} from "@Cubism4/framework/type/csmvector.ts";
import {ICubismModelSetting} from "@Cubism4/framework/icubismmodelsetting.ts";
import {CubismRenderer_WebGL} from "@Cubism4/framework/rendering/cubismrenderer_webgl.ts";

const createTextureFromPngFile = (
  fileName: string,
  usePremultiply: boolean,
  callback: (textureInfo: TextureInfo) => void,
  gl: WebGLRenderingContext,
  textures: csmVector<TextureInfo>
): void => {
  // search loaded texture already
  for (
    let ite: iterator<TextureInfo> = textures.begin();
    ite.notEqual(textures.end());
    ite.preIncrement()
  ) {
    if (
      ite.ptr().fileName == fileName &&
      ite.ptr().usePremultply == usePremultiply
    ) {
      ite.ptr().img = new Image();
      ite.ptr().img.onload = (): void => callback(ite.ptr());
      ite.ptr().img.src = fileName;
      return;
    }
  }

  // 触发数据加载
  const img = new Image();
  img.onload = (): void => {
    // 创建纹理对象
    const tex: WebGLTexture = gl.createTexture() as WebGLTexture;

    // 选择纹理
    gl.bindTexture(gl.TEXTURE_2D, tex);

    // 将像素写入纹理
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    if (usePremultiply) {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    }

    // 将像素写入纹理
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    // 生成 Mipmap
    gl.generateMipmap(gl.TEXTURE_2D);

    // 绑定纹理
    gl.bindTexture(gl.TEXTURE_2D, null);

    const textureInfo: TextureInfo = {
      fileName: fileName,
      width: img.width,
      height: img.height,
      id: tex,
      img: img,
      usePremultply: usePremultiply
    };
    textures.pushBack(textureInfo);

    callback(textureInfo);
  };
  img.src = fileName;
}

export const setupTextures = (
  setting: ICubismModelSetting,
  gl: WebGLRenderingContext,
  filePath: string,
  render: CubismRenderer_WebGL
): csmVector<TextureInfo> => {
  // 打字稿使用预乘的 Alpha 来提高 iphone 上的 alpha 质量
  const usePremultiply = true;

  // 用于纹理加载
  const textureCount: number = setting.getTextureCount();
  
  const textures = new csmVector<TextureInfo>();

  for (
    let modelTextureNumber = 0;
    modelTextureNumber < textureCount;
    modelTextureNumber++
  ) {
    // 如果纹理名称为空，请跳过加载绑定过程
    if (setting.getTextureFileName(modelTextureNumber) == '') {
      console.log('getTextureFileName null');
      continue;
    }

    // 将纹理加载到 Web GL 中的纹理单元中
    let texturePath =
      setting.getTextureFileName(modelTextureNumber);
    texturePath = filePath + '/' + texturePath;

    // 加载完成时调用的回调函数
    const onLoad = (textureInfo: TextureInfo): void => {
      render.bindTexture(modelTextureNumber, textureInfo.id);
    };

    // 负荷
    createTextureFromPngFile(texturePath, usePremultiply, onLoad, gl, textures);
    render.setIsPremultipliedAlpha(usePremultiply);
  }

  return textures;
}