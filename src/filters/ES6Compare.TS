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
 * @description: [split()] -将字符串分割成字符串数组
 * @param {Object} arr    -数组
 * @param {String} type   -名称 '_'
 * @returns {*} 
 */
const FTisES6CompareSplit = (arr, type) => {
  let str = arr.split(type);
  return str
};

/** 
 * @description: 排序  https://www.cnblogs.com/taohuaya/p/10048496.html
 * @param {Object} arr    -数组
 * @param {String} order  -asc表示升序，desc为降序
 * @param {String} type   -名称 price或者sales，可以排日期 time '2021-09-05 14:20:00'
 * @returns {*} https://segmentfault.com/a/1190000011188930?utm_source=sf-similar-article　
 */
const FTisES6CompareSort = (arr, order, type) => {
  if(order === 'asc') {
    arr.sort( (a, b) => a[type] - b[type] )

  } else if(order === 'desc'){
    arr.sort( (a, b) => b[type] - a[type] )

  } else{
    arr.sort( (a, b) => b[0] - a[0] )  // 二维数组
  }
  
  return arr
};

/** 
 * @description: 排序
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
 * @description: 【1】扁平数据结构转Tree  https://juejin.cn/post/6983904373508145189
 * @param {*} pid - ID值0
 * @param {Object} arr -格式[{id: 1, pid: 0},{id: 2, pid: 0},{id: 3, pid: 1},{id: 4, pid: 2}]
 * @returns {*} https://blog.csdn.net/huangsting/article/details/110002682  -递归利用reduce处理tree树形  https://segmentfault.com/a/1190000023949947?utm_source=tag-newest
 */
const arrNestToTree = (pid = 0, arr) => {
  return arr.filter(item => item.pid === pid).map( item => ({
    ...item,
    children: arrNestToTree(item.id, arr)  // 切换ID
  }))
};

const array2Tree = (array, id = 1) => {
  return array.filter(node => node.pid === id).map(node => ({ 
    item: node, 
    children: array2Tree(array, node.id) 
  }))
}

/** 
 * @description: 【2】数组递归 -大白话就是 一个函数不断的调用自己。出栈和入栈
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

/** 
 * @description: reduce()方法  -是数组的归并方法，可同时将前面数组项遍历产生的结果与当前遍历项进行运算
 * @param {Object} arr     -原数组
 * @param {Object} prev    -表示上一次调用回调时的返回值，或者计算结束后的返回值;  [常用]
 * @param {Object} cur     -表示当前正在处理的数组元素；                   [常用]
 * @param {Object} index   -表示当前正在处理的数组元素的索引，若提供 init 值，则索引为0，否则索引为1；
 * @param {Object} init    -表示初始值;
 * @returns {*}  https://www.jianshu.com/p/e375ba1cfc47
 */
const arrsReduce = (arr) => arr.reduce((prev, cur) => prev + cur);  // 求和
/** 
 * @description: reduce()方法  -数组去重，不断叠加数组中的每一项，并返回出来
 * @param {Object} arr   -原数组
 * @param {Object} []    -arr 的类型和初始值
 * @param {*} includes   -检测数组 arr 是否包含 cur ，如果是返回 true，否则 false； =====>>>>>  对标 [indexOf()]，下标属性来查询，其不够语义化
 * @param {*} concat     -用于连接 两个或多个 数组，返回副本
 * @param {*} Map        -结构的 [has()] 方法，是用来查找键名的
 * @returns {*}
 */
const FTisES6ReduceIncludes = (arr) => arr.reduce((pre, cur) => {
  if(!pre.includes(cur)) {
    pre.push(cur) // pre.concat(cur)
  }
  return pre

}, []);

/** 
 * @description: reduce()方法  -数组对象去重，不重复的值会打印 undefined
 * @param {Object} arr   -原数组
 * @param {Object} []    -arr 的类型和初始值
 * @param {Object} newobj     -缓存 arr对象数组 里的某一个属性
 * @returns {*} https://blog.csdn.net/AS_TS/article/details/108060856  https://www.cnblogs.com/Peter2014/p/13187008.html -深度优先遍历和广度优先遍历
 */
const FTisES6ReduceObjectNum = (arr, newobj = {}) => arr.reduce((preVal, curVal) => {
  // newobj[curVal.id] 查看是否有 id 属性值相同的一项，没有则将当前项 curVal 加入数组 preVal ，然后返回修改后数组，作为下一次的初始值进行遍历
  newobj[curVal.id] ? '' : newobj[curVal.id] = true && preVal.push(curVal); 
	return preVal
  
}, []);

export {
  FTisES6CompareSort,
  FTisES6PlaceCompareSort,
  FTisES6ReduceIncludes,
  FTisES6ReduceObjectNum,
}