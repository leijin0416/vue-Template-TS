import { Message } from 'element-ui';

/**
 * Message 消息提示
 */
const MessageTextTips = (types: any, text: string) => {
  return new Promise((resolve, reject) => {
    Message({
      customClass: 'v-zindex',
      showClose: false,
      message: text,
      type: types,
      onClose: () => {
        resolve(true)
      }
    });
  })
};

/**
 * Message 消息提示
 * @param {*} res         后台数据
 * @param {*} success     true | false 是否需要
 * @param {*} error       true | false  是否需要
 * @param {*} text        提示文本
 * @param {*} successFun  成功回调
 * @param {*} errorFun    失败回调
 */
const MessageTips = (res: any, success: boolean, error: boolean, text: string, successFun: any, errorFun: any) => {
  if (res.data.code === 200) {
    if (!success) return true;
    else {
      Message({
        customClass: 'v-zindex',
        showClose: false,
        message: text === '' ? res.data.message : text,
        type: 'success',
        onClose: () => {
          if (successFun != null) successFun(res);
        }
      });
    }
  } else {
    if (!error) return false;
    else {
      Message({
        customClass: 'v-zindex',
        showClose: false,
        message: res.data.message ? res.data.message : 'error',
        type: 'error',
        onClose: () => {
          console.log(res);
          if (errorFun != null) errorFun(res);
        }
      });
    }
  }
};

export {
  MessageTips,
  MessageTextTips,
};