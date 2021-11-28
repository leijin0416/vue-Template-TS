class mains {
  timer: any;
  flag: any;
	constructor() {
		this.timer, this.flag = true;
	}
	/**
	 * 函数防抖（立即执行版与延迟执行）
	 * @param {Function}  func  需要执行的函数
	 * @param {Number} delay 延迟/等待时间
	 * @param {Array} args 调用方法的参数
	 * @param {Boolean}  runNow 是否立即执行
	 * @param other 温馨提示：无参更改runNow市args传[]  即可
	 */
	debounce(func, delay, args = [], runNow = false) {
		clearTimeout(this.timer);
		runNow ? (() => {
			if (this.flag) {
				this.flag = false;
				func(...args);
			}
			this.timer = setTimeout(() => {
				this.flag = true;
			}, delay);
		})() : (() => {
			this.timer = setTimeout(() => {
				func(...args);
			}, delay);
		})()
	}
	/**
	 * 函数节流（立即执行版与延迟执行）
	 * @param {Function}  func  需要执行的函数
	 * @param {Number} delay 延迟/等待时间
	 * @param {Array} args 调用方法的参数
	 * @param {Boolean}  runNow 是否立即执行
	 */
	throttling(func, delay, args = [], runNow = true) {
		if (this.flag) {
			this.flag = false;
			clearTimeout(this.timer);
			runNow ? (() => {
				func(...args);
				this.timer = setTimeout(() => {
						this.flag = true;
					},
					delay);
			})() : (() => {
				this.timer = setTimeout(() => {
						this.flag = true;
						func(...args);
					},
					delay);
			})();
		}
	}
}

const debounceUtils = new mains();

export default debounceUtils;