/**
 * https://www.cnblogs.com/bert227/p/10260424.html
 * https://www.cnblogs.com/baiyang2292/p/11166650.html
 * ( num * value ).toFixed(4); -四舍五入
 * parseFloat(this.otcList.sell_lave_count); -转换为数值
 *
 * 特殊字符 -!regExpZF.test(num)
 *
 **/
export const regExPatrn = /[`~!#$%^&*()_\-+=<>?:"{}|,\/;'\\[\]·~！#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
export const regBlank = /^\S*$/;  // 不能包含空格

/**
 * 邮箱格式
 */
export const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
export const regEmailMin = /\@/g;

/**
 * 手机格式
 */
export const regIphone = /^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;

/**
 * 纯数字 https://www.cnblogs.com/fanshuyao/p/12705663.html
 */
export const regNumber = /^[0-9]*$/;
export const regNumberMin = /^[\w]{6,}$/;

/**
 * 整数
 */
export const regIntegerMin = /^\+?[1-9][0-9]*$/;
export const regInteger = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;

/**
 *  /^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i
 *  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{7,17}$/
 *  /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{7,17}$/
 *
 *  1- 含字母+数字+特殊两个组合 -做两次（先2后1）判断
 */
export const regZm = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z!@#$%^&*?]{7,17}$/;
// 2- 包含数字和字符
export const regZmNum = /^[0-9\W!@#$%^&*?]{7,17}$/;

// 验证数字，大写字母，小写字母，特殊字符四选三组成的密码强度，且长度在8到30个数之间
export const AzPattern = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{7,17}$/;

// 用户名正则，4到16位（字母，数字，下划线，减号）：-9_-
export const uPattern = /^[a-zA-Z0-9]{6,18}$/;

// 密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
export const pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
