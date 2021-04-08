import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Message } from 'element-ui';
import { sessionData } from '@/filters/storage';
import CryptoJS from './cryptoJS';  // 加密
import { getRealJsonData } from '@/assets/js/jsonData'; // 格式化返回数据

/**
 *  const VUE_APP_URL = process.env.VUE_APP_URL;
 *  axiosConfig.headers.AuthType = 'WEB';
 *  超时重新请求配置
 */
const axiosConfig: AxiosRequestConfig = {
  baseURL: '',
  timeout: 5000,
  withCredentials: true,
};

// 修改axios配置信息
const service = axios.create(axiosConfig);

/**
 *  2、再在 request 拦截器实现, 传给后台的
 *  Encrypt加密
 *  config.data.hash = md5((new Date()).valueOf() + config.data.func);
 * 
 *  config.data = {
      data: CryptoJS.Encrypt(JSON.stringify(config.data))  // 文本数据交换格式
    }
 */
service.interceptors.request.use(
  config => {
    const token = sessionData('get', 'HasSessionToken', '');
    // tslint:disable-next-line:no-unused-expression
    token && (config.headers.Authorization = token);  // token
    config.headers.AuthType = 'WEB';

    return config;

  },
  (err) => {
      return Promise.reject(err);
  },
);

/**
 *  1、先在 response 拦截器实现, 拿后台返回的
 *     Decrypt解密
 *     getRealJsonData -去掉双引号，转化json格式
 * 
 *  response.data = getRealJsonData(CryptoJS.Decrypt(response.data.data));
 */
service.interceptors.response.use(
  response => {
    // console.log(response);
    if (response.data.code === 401120) {
      sessionData('clean', 'HasSessionToken', '');
      sessionData('clean', 'HasSessionUserId', '');
      sessionData('clean', 'HasSessionRouterMap', '');
      sessionData('clean', 'HasSessionMenuItemId', '');
      sessionData('clean', 'HasSessionMenuItem', '');
      sessionData('clean', 'HasSessionTagsMap', '');

      Message.error({
        message: '您的登录信息已失效，请重新登录',
        duration: 3000,
        onClose: () => {
          window.location.reload();
        }
      })
      // setTimeout(() => {
      //   window.location.reload();
      // }, 3000);
    }

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
      Message({
        message: error.message,
        type: 'error',
        showClose: true,
        onClose: () => {}
      });
    }
    return Promise.reject(error);
  },
);

export default service;
