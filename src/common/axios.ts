import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Message } from 'element-ui';
import { sessionData } from '@/filters/storage';

import { RSAEncryptKey } from './JSEncrypt';  // 加密
import { getRealJsonData } from '@/assets/js/jsonData'; // 格式化返回数据

let baseUrl = '';
switch (process.env.NODE_ENV) {
  case "development":
    baseUrl = "http://192.168.1.xxx:10086"
    break
  case "production":
    baseUrl = "http://185.251.248.xxx:10086"
    break
}
/**
 *  const VUE_APP_URL = process.env.VUE_APP_URL;
 *  axiosConfig.headers.AuthType = 'WEB';
 *  超时重新请求配置 230
 */
const axiosConfig: AxiosRequestConfig = {
  baseURL: baseUrl,
  timeout: 30 * 1000,
  withCredentials: true,
};

// 修改axios配置信息
const service = axios.create(axiosConfig);

/**
 *  1、在 request 拦截器实现, 传给后台的
 */
service.interceptors.request.use( config => {
    const token = sessionData('get', 'HasSessionToken', '');
    const key = sessionData('get', 'HasSessionAuthKey', '');
    const langs = sessionStorage.getItem('accessLocaleI18n');

    token && (config.headers.Authorization = token)         // token
    key && (config.headers['AuthKey'] = RSAEncryptKey(key)) // key
    config.headers.AuthType = 'WEB';
    config.headers['content-Type'] = "application/json;charset=utf-8";
    config.headers['Accept-Language'] = langs || 'zh-CN';
    

    return config;

  }, (err) => {
    return Promise.reject(err);
  }
);

/**
 *  2、再在 response 拦截器实现, 拿后台返回的
 */
service.interceptors.response.use( response => {
    // if(response.data !== null) response.data = CryptoJS.RSADecrypt(response.data);
    // console.log(CryptoJS.RSADecrypt(response.data));
    
    if (response.data.code === 401120) {
      sessionData('clean', 'HasSessionToken', '');
      sessionData('clean', 'HasSessionUserId', '');
      sessionData('clean', 'HasSessionRouterMap', '');
      sessionData('clean', 'HasSessionMenuItemId', '');
      sessionData('clean', 'HasSessionMenuItem', '');
      sessionData('clean', 'HasSessionTagsMap', '');
      sessionData('clean', 'HasSessionAuthKey', '');

      Message.error({
        message: window['vm'].$t('Hlin.您的登录信息已失效'),
        duration: 3000,
        onClose: () => {
          window.location.reload();
        }
      })
    }

    return response;

  }, (error) => {
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
      Message({
        message: error.message,
        type: 'error',
        showClose: true,
        onClose: () => {
          console.log(error);
        }
      });
    }
    return Promise.reject(error);
  }
);

export default service;
