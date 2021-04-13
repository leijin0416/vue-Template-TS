import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';
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

/**
 * 切换：this.$i18n.locale
 * fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'zh',
 */
const locale: any =  sessionData('get', 'accessLocaleI18n', '') || 'en';
const i18n = new VueI18n({
  locale: locale,
  messages
});


export default i18n;
