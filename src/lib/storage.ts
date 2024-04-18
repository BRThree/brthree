import { StorageEnum } from '@/enums/StorageEnum.ts';

/**
 * 获取处理后对象
 * @param key
 * @return T | null
 */
export const getItem = <T>(key: StorageEnum): T | null => {
  let value = null;
  try {
    const result = window.localStorage.getItem(key);
    if (result) {
      value = JSON.parse(result);
    }
  } catch (error) {
    console.error(error);
  }
  return value;
};

/**
 * 获取字符串
 * @param key
 * @return string | null
 */
export const getStringItem = (key: StorageEnum): string | null => {
  return localStorage.getItem(key);
};

/**
 * 设置item
 * @param key
 * @param value
 */
export const setItem = <T>(key: StorageEnum, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * 删除item
 * @param key
 */
export const removeItem = (key: StorageEnum): void => {
  localStorage.removeItem(key);
};

/**
 * 清除所有item
 */
export const clearItems = () => {
  localStorage.clear();
};
