/**
 * @description: 保存文件 -出口
 * @param {*} href URL
 * @param {*} fileName 名称
 * @return {*} https://segmentfault.com/a/1190000038224393?utm_source=sf-similar-article
 */
export const saveAsLink = (href, fileName: string) => {
  const isBlob = href instanceof Blob;
  const aLink = document.createElement('a');
  aLink.href = isBlob ? window.URL.createObjectURL(href) : href;
  aLink.download = fileName;
  aLink.click();
  if (isBlob) setTimeout(() => URL.revokeObjectURL(aLink.href), 100);
}

/**
 * @description: 保存文件 -入口
 * @param {*} href URL
 * @param {*} options 参数配置
 * @return {*}
 */
export const xhrDownloadUrl = (url: string, options: any = {}) => {
  options = Object.assign({ method: 'get', headers: {} }, options);
  return new Promise((reslove, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob'; // options.responseType;
    if (options.headers) {
      for (const key in options.headers) xhr.setRequestHeader(key, options.headers[key]);
    }
    xhr.onload = () => {
      // 从 Content-Disposition 中获取文件名示例
      if(!options.fileName) {
        const cd: any = xhr.getResponseHeader('Content-Disposition');
        if (cd && cd.includes('fileName') && !options.fileName) options.fileName = cd.split('fileName=')[1];
      }
      options.fileName = decodeURIComponent(options.fileName || 'download-file');
      if (+xhr.status == 200) {
        saveAsLink(xhr.response, options.fileName);
        reslove(options.fileName);
      }
    };
    xhr.onerror = err => reject(err);
    xhr.addEventListener(
      'progress',
      event => {
        if (options.onProgress) options.onProgress(event.loaded, event.total, event);
      },
      false
    );
    xhr.open(options.method, url, true);
    xhr.send(options.body);
  });
}

/**
 * @description: 打开文件地址
 * @param {*} href URL
 * @return {*}
 */
export const aLinkDownloadUrl = (url: string) => {
  let elemIF = document.createElement("iframe");
  elemIF.src = url;
  elemIF.style.display = "none";
  document.body.appendChild(elemIF);
  
  let a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.click();
}

// const options = { fileName: 'download-file' }
// xhrDownloadUrl(downloadFileUrl, options)
//   .then(() => console.log('文件下载完成'))
//   .catch(err => console.log('文件下载失败', err));
