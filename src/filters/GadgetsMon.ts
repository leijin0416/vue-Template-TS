import Clipboard from "clipboard";
import { MessageTextTips } from './MessageTips';

/**
 * @description: 复制链接
 * @param {*} id ID标识
 * @return {*} :data-clipboard-text="address"
 */
const ClipBoardCopyText = (id: string) => {
  const clipboard: any = new Clipboard(id);
  
  clipboard.on('success', function(e) {
    MessageTextTips('success', '复制成功~');
    e.clearSelection();
    // 释放内存  
    clipboard.destroy();
  });
  // 失败回调
  clipboard.on('error', function(e) {
    MessageTextTips('error', '复制失败~');
    console.log('error');
    // 释放内存  
    clipboard.destroy();
  });

};

export { 
  ClipBoardCopyText,
};