import { Message } from 'element-ui';

/**
 * Message 消息提示
 * @return res
 * @return true | false
 */
const MessageTips = (res: any, success: boolean, error: boolean, text: string, successFun: any, errorFun: any) => {
  if (res.data.code === 200) {
    if (!success) return true;
    else {
      Message({
        showClose: true,
        message: text === '' ? res.data.msg : text,
        type: 'success',
        onClose: () => {
          successFun(res);
        }
      });
    }
  } else {
    if (!error) return false;
    else {
      Message({
        showClose: true,
        message: res.data.msg ? res.data.msg : 'error',
        type: 'error',
        onClose: () => {
          errorFun(res);
        }
      });
    }
  }
};

export {
  MessageTips,
};