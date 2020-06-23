/**
 *  local操作
 *  @param String method  get获取，set存入或覆盖，clean清除
 *  @param String name    localStorage 名称
 *  @param obj          存入的内容，可以是任意类型
 *
 *  @param localData('set', 'localeCut', val);  -调用方式
 */
const localData = (method, name, obj) => {
    /*
     * 参数说明：
     * localStorage.getItem(key):    获取指定key本地存储的值
     * localStorage.setItem(key,value)： 将value存储到key字段
     * localStorage.removeItem(key): 删除指定key本地存储的值
     * */
    switch (method) {
        case 'get':
            if (localStorage.getItem(name + '_obj')) {
                return localStorage.getItem(name + '_obj');
            } else if (localStorage.getItem(name + '_str')) {
                return localStorage.getItem(name + '_str');
            } else {
                return null;
            }
        case 'set':
            if (typeof obj === 'object') {
                localStorage.setItem(name + '_obj', JSON.stringify(obj));
            } else {
                localStorage.setItem(name + '_str', obj);
            }
            return true;
        case 'clean':
            localStorage.removeItem(name + '_obj');
            localStorage.removeItem(name + '_str');
            return true;
    }
};

/**
 *  session操作
 *  @param String method  get获取，set存入或覆盖，clean清除
 *  @param String name    session 名称
 *  @param obj          存入的内容，可以是任意类型
 *
 *  @param sessionData('set', 'localeCut', val);  -调用方式
 */
const sessionData = (method, name, obj) => {
    switch (method) {
        case 'get':
            if (sessionStorage.getItem(name + '_obj')) {
                return sessionStorage.getItem(name + '_obj');
            } else if (sessionStorage.getItem(name + '_str')) {
                return sessionStorage.getItem(name + '_str');
            } else {
                return null;
            }
        case 'set':
            // sessionData('clean', name);
            if (typeof obj === 'object') {
                sessionStorage.setItem(name + '_obj', JSON.stringify(obj));
            } else {
                sessionStorage.setItem(name + '_str', obj);
            }
            return true;
        case 'clean':
            sessionStorage.removeItem(name + '_obj');
            sessionStorage.removeItem(name + '_str');
            return true;
    }
};

export { localData, sessionData };
