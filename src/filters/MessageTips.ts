import { Message } from 'element-ui';

/**
 * Message 消息提示
 * @res 数据
 * @success true | false 是否需要
 * @error true | false  是否需要
 * @text 提示文本
 * @successFun  成功回调
 * @errorFun    失败回调
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
};