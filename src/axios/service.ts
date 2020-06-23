import axios from './config';

// 封装HTTP工具类
export default class Http {
    public static async request(params: any) {
        return axios(params);
    }

    /**
     * get
     * @param [url] 地址
     * @param [data] 数据
     * @returns Promise
     */
    public static get(req: any): any {
        return this.request({
            method: 'GET',
            url: req.url,
            params: req.data,
        });
    }

    /**
     * put
     * @param [url] 地址
     * @param [data] 数据
     * @returns Promise
     */
    public static put(reqUrl: any, reqData: any): any {
        return this.request({
            method: 'PUT',
            url: reqUrl,
            data: reqData,
        });
    }

    /**
     * post
     * @param [url] 地址
     * @param [data] 数据
     * @returns Promise
     */
    public static post(reqUrl: any, reqData: any): any {
        return this.request({
            method: 'post',
            url: reqUrl,
            data: reqData,
        });
    }

    /**
     * delete
     * @param [url] 地址
     * @param [data] 数据
     * @returns Promise
     */
    public static delete(req: any): any {
        return this.request({
            method: 'DELETE',
            url: req.url,
            params: req.data,
        });
    }
}