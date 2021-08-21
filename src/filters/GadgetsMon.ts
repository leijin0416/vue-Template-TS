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

}

/**
 * @description: 下载图片 https://blog.csdn.net/quhongqiang/article/details/105552872
 * @param {String} selectorUrl  -url
 * @param {String} name -名称
 * @return {*}
 */
const SaveDownloadIamge = (selectorUrl, name) => {
  let image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function () {
    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    let context: any = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    let url = canvas.toDataURL('image/png');
    let a = document.createElement('a');
    // 创建一个单击事件
    let event = new MouseEvent('click');
    a.download = name || '下载图片名称';
    a.href = url;

    // 触发a的单击事件
    a.dispatchEvent(event);
  }
  image.src = selectorUrl;
  MessageTextTips('success', '下载成功~');
}

/**
 * 
 * @description:   保存图片
 * @param {String} data     -url
 * @param {String} filename -名称
 * @return {*}
 * https://www.jianshu.com/p/6620eac670da
 * https://blog.csdn.net/bamboozjy/article/details/81631487
 * https://www.cnblogs.com/FACESCORE/p/11804177.html
 */
const SaveDownloadImageFile = (data: any, fileName: any) => {
  const save_link: any = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = fileName;

  const event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
}

/**
 * 
 * @description:  上传图片，去除base64前缀
 * @param {String} file 
 * @return {*}
 */
const SaveImageUrlBase64 = (file: any) => {
  return new Promise(function (resolve, reject) {
    let files = file;
    let reader = new FileReader();
    let imgResult;
    
    if (typeof files !== 'object') return;
    reader.readAsDataURL(files);
    reader.onload = function () {
      imgResult = reader.result;
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.onloadend = function () {
      resolve(imgResult);
    };
  })
}

export { 
  ClipBoardCopyText,
  SaveDownloadIamge,
  SaveDownloadImageFile,
  SaveImageUrlBase64,
}