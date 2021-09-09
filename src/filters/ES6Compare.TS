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
 * @param {Object} arr -格式[{id: 1, pid: 0},{id: 2, pid: 0},{id: 3, pid: 1},{id: 4, pid: 2}]
 * @returns 
 */
const nestArrToTree = (pid, arr) => {
  return arr.filter(item => item.pid === pid).map( item => ({
    ...item,
    children: nestArrToTree(item.id, arr)  // 切换ID
  }))
};

/** 
 * @description: 排序/去重  https://www.cnblogs.com/taohuaya/p/10048496.html
 * @param {Object} arr    -数组
 * @param {String} order  -asc表示升序，desc为降序
 * @param {String} type   -名称 price或者sales，可以排日期 time '2021-09-05 14:20:00'
 * @returns {*} https://segmentfault.com/a/1190000011188930?utm_source=sf-similar-article　
 */
const FTisES6CompareSort = (arr, order, type) => {
  if(order === 'asc') {
    arr.sort( (a, b) => a[type] - b[type] );

  } else if(order === 'desc'){
    arr.sort( (a, b) => b[type] - a[type] );
  }
  
  return arr
};

/** 
 * @description: 排序/去重
 * @param {Object} arr    -数组
 * @param {String} type   -名称 price或者sales，可以排日期 time '2021-09-05 14:20:00'
 * @returns {*} 如果第一个参数小，则应为负数（应放在结果数组中的第二个参数之前）,如果第一个参数更大，则为正数（应该放在第二个参数之后）,0 则这两个元素相等
 */
const FTisES6PlaceCompareSort = (arr, type) => {
  arr.sort((a, b) => {
    if(a[type] < b[type]) {return -1;} 
    if(a[type] > b[type]) {return 1;} 
    return 0;
  });
  
  return arr
};

/** 
 * @description: 数组递归 -大白话就是 一个函数不断的调用自己。出栈和入栈
 * @param {Object} arr  -数组
 * @returns {*}  https://segmentfault.com/a/1190000015826387?utm_source=sf-similar-article
 * @returns {*}  https://segmentfault.com/a/1190000015813977?utm_source=tag-newest -获取节点的所有叶子节点个数
 */
const factsTree = (num) => {
  if (num === 1) {  // 1.避免无限循环
    return 1;
  }
  return num * factsTree(num-1); // 2.递归条件，出栈和入栈
}

export {
  FTisES6CompareSort,
  FTisES6PlaceCompareSort
}