import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 动态类名管理以及后样式覆盖前样式
 * @param inputs 样式列表
 */
export function styleMerge(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
