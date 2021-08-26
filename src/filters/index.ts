/**
 * @description: 格式化小数位 {{ 3.1452 | formatFloat }}
 * @param val    传入的值
 * @param pos    保留的小数位
 * @param isNaN  检查是否是非数字值
 * @param Math   检查是否是整数
 * @return {*}
 */
const formatFloat = (val: any, pos: number = 2) => {
  let f = parseFloat(val);
  if (isNaN(f)) {
    return false
  }
  if (Math.floor(Number(val)) === Number(val)) {
    return val
  }
  f = Math.round(val * Math.pow(10, pos)) / Math.pow(10, pos); // pow 幂
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + pos) {
    s += '0';
  }
  return s
}

/**
 * @description: 手机号格式化
 * @param String phone | 180****9230
 * @return {*}
 */
const formatPhone = (phone: string | number) => {
  phone = phone.toString();
  return phone.substr(0, 3) + '****' + phone.substr(7, 11)
}

/**
 * @description: 4位一空格（格式化银行卡）
 * @param {String} val
 * @return {*}
 */
const formatBank = (val: any) => {
  if (val) {
    return val.toString().replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
  }
}

/**
 * @description: 千分位格式化
 * @param {*} val  数字  1,279,878,236 | (123456789).toLocaleString('en-US')
 * @return {*}
 */
const inFormatIntegerThousands = (val: any) => {
  if (Math.floor(Number(val)) === Number(val)) {
    return val
  }
  let num = (val || 0).toString(),
    result = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return result
}

/**
 * @description: 数字千位符格式化，保留小数位
 * @param {Number || String} num 
 * @return {*}
 */
const inFormatThousands = (num) => {
  num = num + '';
  if (!num.includes('.')) {
    num += '.'
  }
  return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
    return $1 + ',';      // 只将整数部分进行分割
  }).replace(/\.$/, '');  // 再将小数部分合并进来
}

/**
 * @description: 格式化时长
 * @param {Number} second
 * @return {*}
 * 
 */
const realFormatSecond = (second: any) => {
  let secondType = typeof second;

  if (secondType === 'number' || secondType === 'string') {
    let parseInts = parseInt(second);
    second = parseInts;

    let hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    let mimute = Math.floor(second / 60);
    second = second - mimute * 60;

    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)

  } else {
    return '0:00:00'
  }
}

/**
 * @description: 时间戳转日期
 * @param {String} fmt
 * @param {Number} time
 * @return {*}
 */
const FormatCurrentTime = (fmt, time) => {
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
}

/**
 * @description: 将科学计数法转换成小数  item.money | scientificToNumber
 * @param {Number} num 0E-10 数值类型
 * @return {*}
 */
const scientificToNumber = (num: number) => {
	let str = num.toString();
	let reg = /^(\d+)(e)([\-]?\d+)$/;
	let arr, len,
		zero = '';

	/*6e7或6e+7 都会自动转换数值*/
	if (!reg.test(str)) {
		return num;
	} else {
		/*6e-7 需要手动转换*/
		arr = reg.exec(str);
		len = Math.abs(arr[3]) - 1;
		for (let i = 0; i < len; i++) {
			zero += '0';
		}
		return '0.' + zero + arr[1]
	}
}

export default {
  formatFloat,
  formatPhone,
  formatBank,
  inFormatIntegerThousands,
  inFormatThousands,
  realFormatSecond,
  scientificToNumber
}