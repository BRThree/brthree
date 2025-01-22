import axios, { AxiosError, AxiosResponse } from 'axios';
import { getItem } from '@/lib/storage.ts';
import { StorageSpace } from '@/enums/storage.ts';
import { Result } from '@/types/request.ts';
import { ResultEnum } from '@/enums/request.ts';

// 创建 axios 实例
const axiosInstance = axios.create({
    timeout: 60000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

const TOKEN_PREFIX = 'Bearer';
// 请求拦截
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getItem<string>(StorageSpace.Token);
        if (token) {
            // 如果有token则携带token
            config.headers.Authorization = `${TOKEN_PREFIX} ${token}`;
        }
        return config;
    },
    (error) => {
        // 请求错误时做些什么
        return Promise.reject(error);
    }
);

// 响应拦截
axiosInstance.interceptors.response.use(
    (res: AxiosResponse<Result>) => {
        if (!res.data) throw new Error('服务器错误');

        const { code, data, message } = res.data;
        // 业务请求成功
        const hasSuccess =
            data &&
            Reflect.has(res.data, 'code') &&
            code === ResultEnum.SUCCESS;
        if (hasSuccess) {
            return data;
        }

        // 业务请求错误
        throw new Error(message || '请求失败');
    },
    async (error: AxiosError<Result>) => {
        return Promise.reject(error);
    }
);

// 只暴露方法，不暴露实例
export const get = <T = undefined, R = undefined>(
    url: string,
    payload: T
): Promise<AxiosResponse<Result<R>>> => {
    return axiosInstance.get(url, { params: payload });
};
export const post = <T = undefined, R = undefined>(
    url: string,
    payload: T
): Promise<AxiosResponse<Result<R>>> => {
    return axiosInstance.post(url, { data: payload });
};
export const put = <T = undefined, R = undefined>(
    url: string,
    payload: T
): Promise<AxiosResponse<Result<R>>> => {
    return axiosInstance.put(url, { data: payload });
};
export const del = <T = undefined, R = undefined>(
    url: string,
    payload: T
): Promise<AxiosResponse<Result<R>>> => {
    return axiosInstance.delete(url, { data: payload });
};
