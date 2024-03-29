import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Message } from 'element-ui';
import { sessionData } from '@/filters/storage';

import CryptoJS from './cryptoJS';                       // 加密
import { getRealJsonData } from '@/assets/js/jsonData';  // 格式化返回数据

/**
 * @description: IP信息
 * @param {*} "185.251.230"
 * @return {*}
 */
let baseUrl = '';
switch (process.env.NODE_ENV) {
  case "development":
    baseUrl = "https://xxxxxxx.com"
    break
  case "production":
    baseUrl = "https://xxxxxxx.com"
    break
}

/**
 * @description: 请求配置
 * @param {*} const VUE_APP_URL = process.env.VUE_APP_URL;
 * @return {*}
 */
const axiosConfig: AxiosRequestConfig = {
  baseURL: baseUrl,
  timeout: 30 * 1000, 
  withCredentials: true,
}

// 修改axios配置信息
const service = axios.create(axiosConfig);

/**
 * @description: request 拦截器实现, 传给后台的
 * @param {*} config.data.hash = md5((new Date()).valueOf() + config.data.func);  // Encrypt加密  
 * @param {*} config.data = { data: CryptoJS.ECBEncrypt(JSON.stringify(config.data))  // 文本数据交换格式 }
 * @return {*}
 */
service.interceptors.request.use(
  config => {
    const token = sessionData('get', 'HasSessionToken', '');
    // console.log(token);
    
    token && (config.headers.Authorization = token);  // token
    config.headers.AuthType = 'WHALE_ADMIN';
    config.headers['content-Type'] = "application/json;charset=utf-8";
    config.headers['Accept-Language'] = sessionStorage.getItem('accessLocaleI18n') || 'zh-CN';

    // config.data = CryptoJS.RSAEncrypt(JSON.stringify(config.data))  // 文本数据交换格式
    return config

  }, (err) => {
    return Promise.reject(err)
  }
)

/**
 * @description: response 拦截器实现, 拿后台返回的
 * @param {*} getRealJsonData -去掉双引号，转化json格式
 * @param {*} if(response.data !== null) response.data = CryptoJS.RSADecrypt(response.data); // Decrypt解密
 * @return {*} 
 */
service.interceptors.response.use(
  response => {
    if(response.data.code === 401120) {
      sessionData('clean', 'HasSessionToken', '');
      sessionData('clean', 'HasSessionUserId', '');
      sessionData('clean', 'HasSessionRouterMap', '');
      sessionData('clean', 'HasSessionMenuItemId', '');
      sessionData('clean', 'HasSessionMenuItem', '');
      sessionData('clean', 'HasSessionTagsMap', '');

      Message.error({
        message: window['vm'].$t('Hlin.您的登录信息已失效'),
        duration: 3000,
        onClose: () => {
          window.location.reload();
        }
      })
    }

    return response
    
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
      error.message = RESPONSE_CODE[error.response.status] || '服务器开小差!!';
      Message({
        message: error.message,
        type: 'error',
        showClose: true,
        onClose: () => {}
      })
    }
    return Promise.reject(error)
  }
)

export default service
