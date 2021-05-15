import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';
// 方式二
import zhLocaleI18n from './cn';
import enLocaleI18n from './en';
import { sessionData } from '@/filters/storage';

Vue.use(VueI18n);

/**
 * 方式一
 * @returns messages: loadLocaleMessages()
 */
function loadLocaleMessages(): LocaleMessages {
  const locales = require.context('./local', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: LocaleMessages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

/**
 * 方式二
 * https://segmentfault.com/a/1190000020297356?utm_source=tag-newest TS中使用
 * {{ $t('m.message') }}
 */
const messages = {
  en: {
    ...enLocaleI18n,
  },
  zh: {
    ...zhLocaleI18n,
  }
}

let getLocaleI18n = sessionStorage.getItem('accessLocaleI18n');
let localeI18n = '';
if(getLocaleI18n === null || getLocaleI18n == 'zh-CN') {
  localeI18n = 'zh'
} else {
  localeI18n = 'en'
}
// console.log(getLocaleI18n)
// console.log(localeI18n)

// this.$i18n.locale
// fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'zh',
const locale =  localeI18n;
const i18n = new VueI18n({
  locale: locale == '' ? 'zh' : locale,
  messages
});


export default i18n;
