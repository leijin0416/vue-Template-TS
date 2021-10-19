import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';
import { sessionData } from '@/filters/storage';

// 方式二
import zhLocaleI18n from './cn';
import enLocaleI18n from './en';

Vue.use(VueI18n)

/**
 * @description: 语言包
 * @param {*} https://segmentfault.com/a/1190000020297356?utm_source=tag-newest TS中使用
 * @return {*}
 */
let messages = {
  en: {
    ...enLocaleI18n,
  },
  zh: {
    ...zhLocaleI18n,
  }
}

/**
 * @description: 选择语言包
 * @param {*} getLocaleI18n 当前语言
 * @return {*}
 */
let getLocaleI18n = sessionStorage.getItem('accessLocaleI18n');
let localeI18n = '';
if (getLocaleI18n === null || getLocaleI18n == 'zh-CN') localeI18n = 'zh' 
else localeI18n = 'en'

/**
 * @description: 挂载 this.$i18n.locale()
 * @param {*} fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'zh',
 * @return {*}
 */
const i18n = new VueI18n({
  locale: localeI18n == '' ? 'zh' : localeI18n,
  messages
})


export default i18n
