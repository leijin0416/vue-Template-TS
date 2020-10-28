import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import CryptoJS from './cryptoJS';
import { getRealJsonData } from '@/assets/js/jsonData'; // 格式化返回数据
import { sessionData } from '@/filters/storage';

// 超时重新请求配置
// const VUE_APP_URL = process.env.VUE_APP_URL;
const axiosConfig: AxiosRequestConfig = {
    baseURL: '',
    timeout: 10000,
    // 跨域是否带Token
    withCredentials: true,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
};

// 修改axios配置信息
const service = axios.create(axiosConfig);

// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        const token = sessionData('get', 'getSessionToken', null);
        // console.log('token：' + token);
        // tslint:disable-next-line:no-unused-expression
        token && (config.headers.token = token);
        config.data = {
            // 文本数据交换格式
            data: CryptoJS.Encrypt(JSON.stringify(config.data))
        };
        return config;
    },
    (err) => {
        return Promise.reject(err);
    },
);

// 返回状态判断(添加响应拦截器)
service.interceptors.response.use(
    (response) => {
        response.data = getRealJsonData(CryptoJS.Decrypt(response.data.data));
        return response;

    },
    (error) => {
        if (error && error.response) {
            const RESPONSE_CODE = {
                400: '请求参数错误',
                403: '拒绝访问',
                404: '请求超时',
                500: '服务器内部错误',
                501: '服务未实现',
                502: '网关错误',
                503: '服务不可用',
                504: '网关超时',
                505: 'HTTP版本不受支持',
            };
            error.message = RESPONSE_CODE[error.response.status] || '服务器开小差！！';
        }
        return Promise.reject(error);
    },
);
export default service;
