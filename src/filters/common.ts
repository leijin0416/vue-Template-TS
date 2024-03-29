/**
 * @description scrollReveal 动画
 * @param {Number} duration   -动画的时长
 * @param {String} origin     -动画开始的位置，'bottom', 'left', 'top', 'right'
 * @param {Boolean} reset     -回滚的时候是否再次触发动画
 * @param {Boolean} mobile    -在移动端是否使用动画
 * @param {String} distance   -滚动的距离
 * @param {Number} delays     -延迟时间
 * @returns 
 */
 export function scrollRevealEffect(duration: number, origin: string, reset: boolean, mobile: boolean, distance: string, delays: number) {
  let item = {
    // 动画的时长
    duration: duration,
    // 延迟时间
    delay: delays || 0,
    // 动画开始的位置
    origin: origin,
    // 回滚的时候是否再次触发动画
    reset: reset,
    // 在移动端是否使用动画
    mobile: mobile,
    // 滚动的距离，单位可以用%，rem等
    distance: distance,
    // 其他可用的动画效果
    opacity: 0.001,
    easing: 'linear',
    scale: 1,
  };
  return item
};

/** 
 * @description: 深拷贝函数  接收目标target参数  https://juejin.cn/post/6986452564778680350
 * @param target 
 * @returns 
 */
 const deepCloneData = (target: any) => {
  // 定义一个变量
  let result;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        result.push(deepCloneData(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if(target === null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值    
    } else if(target.constructor === RegExp){
      result = target;
    }else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (let i in target) {
        result[i] = deepCloneData(target[i]);
      }
    }
   // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result
};

/** 
 * @description 时间戳转日期
 * @param {String} fmt    日期格式
 * @param {Number} time   时间戳   10位 * 1000
 * @param {*} Y  年
 * @param {*} m  月
 * @param {*} d  日
 * @param {*} H  时
 * @param {*} M  分
 * @param {*} S  秒
 * @returns 
 */
const FTisFormatCurrentTime = (fmt: string, time: string | number) => {
  if (!time) return '';
  let date = new Date(time)
  let ret;
  let opt = {
    "Y+": date.getFullYear().toString(),
    "m+": (date.getMonth() + 1).toString(),
    "d+": date.getDate().toString(),
    "H+": date.getHours().toString(),
    "M+": date.getMinutes().toString(),
    "S+": date.getSeconds().toString()
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt
};

/** 
 * @description 时间戳换算日期
 * @param {String} str  时间戳
 * @returns 
 */
const FTisFormatTimeTextDate = (str: string | number) => {
  if (!str) return '';
  let date = new Date(Number(str));
  let time = new Date().getTime() - date.getTime(); // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
    return '';
  } else if (time / 1000 < 30) {
    return '刚刚';
  } else if (time / 1000 < 60) {
    return parseInt(String(time / 1000)) + '秒前';
  } else if (time / 60000 < 60) {
    return parseInt(String(time / 60000)) + '分钟前';
  } else if (time / 3600000 < 24) {
    return parseInt(String(time / 3600000)) + '小时前';
  } else if (time / 86400000 < 31) {
    return parseInt(String(time / 86400000)) + '天前';
  } else if (time / 2592000000 < 12) {
    return parseInt(String(time / 2592000000)) + '月前';
  } else {
    return parseInt(String(time / 31536000000)) + '年前';
  }
};

/** 
 * @description: 递归遍历  https://juejin.cn/post/7002108799439863821
 * @param tree 
 * @param func 
 * @returns 
 */
const TreeForeach =  (tree, func) => {
  if (!tree || typeof tree !== 'object') return null
  tree.forEach((data: { children: any }) => {
    if (typeof data.children === 'object' && data.children.length > 0) {
      TreeForeach(data.children, func)   // 函数调用函数自身
    } else {
      func(data)                         // 递归出口
    }
  })
};

// 去重
const FormatArrMapHas = (tree) => {
  let map = new Map();
  for (let item of tree) {
    if (!map.has(item.title)) {
      map.set(item.title, item);
    }
  }
  return [...map.values()]
};

/**
 * @description: 去除HTML tag
 * @param {string} str  数值
 * @return {*}
 */
const FTisRemoveFormInput = (str) => {
  str = str.replace(/<\/?[^>]*>/g, ''); // 去除HTML tag
  str = str.replace(/\s+/g, '');        // 去除多余空行
  str = str.replace(/&nbsp;/ig, '');    // 去掉&nbsp;

  return str
};

/** 
 * @description: 去除HTML 前后空格  https://www.cnblogs.com/zhangnan35/p/8635059.html
 * @param {String} str  数值
 * @return {*}
 */
const FTisRemoveFormInputTrim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, "")
};

/**
 * @description: 小数点 数值精度计算   FTisRoundDecimaleeForm(3.1415926, 1)
 * @param {Number} num       数值
 * @param {Number} decimal   精度
 * @return {*}
 */
const FTisRoundDecimaleeForm = (num, decimal) => {
  let map = Math.round(num * 10 ** decimal) / 10 ** decimal;
  return map
};

/**
 * @description: 数字千位符格式化，保留小数位  http://openexchangerates.github.io/accounting.js/
 * @param {Number || String} num       数值
 * @return {*} 解析 https://www.cnblogs.com/vinfy2018/p/8469883.html
 */
const FormatThousands = (num) => {
  num = num + '';
  if (!num.includes('.')) {
    num += '.'
  }
  return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
    return $1 + ',';      // 只将整数部分进行分割
  }).replace(/\.$/, '');  // 再将小数部分合并进来
};


export { 
  deepCloneData,
  TreeForeach, 
  FormatArrMapHas, 
  FTisFormatCurrentTime,
  FTisFormatTimeTextDate,
  FTisRoundDecimaleeForm, 
  FTisRemoveFormInput, 
  FTisRemoveFormInputTrim, 
  FormatThousands,
}