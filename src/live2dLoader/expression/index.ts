import {csmMap} from "@Cubism4/framework/type/csmmap.ts";
import {ACubismMotion} from "@Cubism4/framework/motion/acubismmotion.ts";
import {CubismExpressionMotion} from "@Cubism4/framework/motion/cubismexpressionmotion.ts";
import {ICubismModelSetting} from "@Cubism4/framework/icubismmodelsetting.ts";
import {CubismMotionManager} from "@Cubism4/framework/motion/cubismmotionmanager.ts";

export const expressionManager = new CubismMotionManager();

/**
 * 加载模型表情列表
 * @param setting
 * @param filePath
 */
export const loadCubismExpression = async (
  setting: ICubismModelSetting,
  filePath: string
): Promise<csmMap<string, ACubismMotion> | null> => {
  if (setting.getExpressionCount() <= 0) return null;
  const expressions = new csmMap<string, ACubismMotion>();
  const count: number = setting.getExpressionCount();

  for (let i = 0; i < count; i++) {
    const expressionName = setting.getExpressionName(i);
    const expressionFileName =
      setting.getExpressionFileName(i);

    const response = await fetch(`${filePath}/${expressionFileName}`);
    const arrayBuffer = await response.arrayBuffer();
    const motion: ACubismMotion = CubismExpressionMotion.create(arrayBuffer, arrayBuffer.byteLength);

    if (expressions.getValue(expressionName) != null) {
      ACubismMotion.delete(
        expressions.getValue(expressionName)
      );
    }

    expressions.setValue(expressionName, motion);
  }

  return expressions
};

/**
 * 设置表情
 * @param expressions
 * @param expressionId
 */
export const setExpression = (
  expressions: csmMap<string, ACubismMotion>,
  expressionId: string
): void => {
  if (expressions.getSize() <= 0) return;
  const motion: ACubismMotion = expressions.getValue(expressionId);

  if (motion != null) {
    expressionManager.startMotionPriority(
      motion,
      false,
      3
    );
  }
}