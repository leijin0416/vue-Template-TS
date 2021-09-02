/**
 * @description: 防抖   -到达规定的时间执行一次
 * @param {*} fn    函数
 * @param {*} wait  时间
 * @return {*}
 */
const FTisDebounce = (fn, wait) => {
  let time: any = null;
  return function (...args) {
    // 每一次点击判断有延迟执行的任务就停止
    time && clearTimeout(time);
    // 否则就开启延时任务
    time = setTimeout(() => {
      fn(...args)
    }, wait);
  }
};

/** 
 * @description: 扁平数据结构转Tree  https://juejin.cn/post/6983904373508145189
 * @param {*} pid 0
 * @param {Object} arr [{id: 1, pid: 0},{id: 2, pid: 0},{id: 3, pid: 1},{id: 4, pid: 2}]
 * @returns 
 */
const nestArrToTree = (pid, arr) => {
  return arr.filter(item => item.pid === pid).map( item => ({
    ...item,
    children: nestArrToTree(item.id, arr)  // 切换ID
  }))
};

/** 
 * @description: 排序/去重
 * @param {Object} arr    数组
 * @param {String} order  asc表示升序，desc为降序
 * @param {String} type   名称 price或者sales，可以排日期 time '2021-09-05 14:20:00'
 * @returns https://segmentfault.com/a/1190000011188930?utm_source=sf-similar-article　https://www.cnblogs.com/taohuaya/p/10048496.html
 */
const FTisES6CompareSort = (arr, order, type) => {
  if(order == 'asc'){
    arr.sort( (a, b)=> a[type] - b[type] );

  } else if(order == 'desc'){
    arr.sort( (a, b)=> b[type] - a[type] );

  }
  
  return arr
}

export {
  FTisES6CompareSort
}