/**
 * 格式化小数位
 * {{ 3.1111 | formatFloat }} -用法
 * @param val 传入的值
 * @param pos 保留的小数位
 */
const formatFloat = (val: any, pos = 2) => {
    let f = parseFloat(val);
    if (isNaN(f)) {
        return false;
    }
    f = Math.round(val * Math.pow(10, pos)) / Math.pow(10, pos); // pow 幂
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + pos) {
        s += '0';
    }
    return s;
};

/**
 * 手机号格式化
 * @param String phone | 180****9230
 */
const formatPhone = (phone: any) => {
    // tslint:disable-next-line:no-parameter-reassignment
    phone = phone.toString();
    return phone.substr(0, 3) + '****' + phone.substr(7, 11);
};

/**
 * 4位一空格（格式化银行卡）
 * @param String val
 */
const formatBank = (val: any) => {
    if (val) {
        return val.toString().replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
    }
};

/**
 * 千分位格式化
 * @param val 数字  1,279,878,236 | (123456789).toLocaleString('en-US')
 */
const toThousands = (val: any) => {
    // tslint:disable-next-line:one-variable-per-declaration
    let num = (val || 0).toString(),
        result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
};

/**
 * 格式化时长
 */
const realFormatSecond = (second: any) => {
    let secondType = typeof second;

    if (secondType === 'number' || secondType === 'string') {
        // tslint:disable-next-line: radix
        let parseInts = parseInt(second);
        // tslint:disable-next-line:no-parameter-reassignment
        second = parseInts;

        let hours = Math.floor(second / 3600);
        // tslint:disable-next-line:no-parameter-reassignment
        second = second - hours * 3600;
        let mimute = Math.floor(second / 60);
        // tslint:disable-next-line:no-parameter-reassignment
        second = second - mimute * 60;

        return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2);
    } else {
        return '0:00:00';
    }
};

/**
 * 暴露函数
 *
 * 去除HTML tag
 */
export function removeHTMLTag(str: any) {
    // tslint:disable-next-line:no-parameter-reassignment
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    // tslint:disable-next-line:no-parameter-reassignment
    str = str.replace(/\s+/g, ''); //去除多余空行
    // tslint:disable-next-line:no-parameter-reassignment
    str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;
    return str;
}

/**
 * 上传图片，去除base64前缀
 * @return file
 */
export function getUrlBase64(file: any) {
    // tslint:disable-next-line:only-arrow-functions
    return new Promise(function (resolve, reject) {
        let files = file;
        let reader = new FileReader();
        let imgResult;
        if (typeof files !== 'object') return;
        reader.readAsDataURL(files);
        // tslint:disable-next-line:only-arrow-functions
        reader.onload = function () {
            imgResult = reader.result;
        };
        // tslint:disable-next-line:only-arrow-functions
        reader.onerror = function (error) {
            reject(error);
        };
        // tslint:disable-next-line:only-arrow-functions
        reader.onloadend = function () {
            resolve(imgResult);
        };
    });
}

/**
 * 保存图片
 * @param data url
 * @param filename 名称
 * https://www.jianshu.com/p/6620eac670da
 * https://blog.csdn.net/bamboozjy/article/details/81631487
 * https://www.cnblogs.com/FACESCORE/p/11804177.html
 */
export function saveFile(data, filename) {
    const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;

    const event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
}

export default {
    formatFloat,
    formatPhone,
    formatBank,
    toThousands,
    realFormatSecond
};