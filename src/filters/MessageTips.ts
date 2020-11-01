import { Message } from 'element-ui';

/**
 * Message 消息提示
 * @return res
 */
const MessageTips = (res: any, success: boolean, error: boolean) => {
  if (res.data.code === 200) {
    if (!success) return true;
    Message({
      showClose: true,
      message: res.data.msg,
      type: 'success',
      onClose: () => {
        return true;
      }
    });
  } else {
    if (!error) return false;
    Message({
      showClose: true,
      message: res.data.msg ? res.data.msg : 'error',
      type: 'error',
      onClose: () => {
        return false;
      }
    });
  }
};

export {
  MessageTips,
};