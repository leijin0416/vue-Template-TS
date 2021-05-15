import enUser from './User/userAudit.json';
import enUserBehavior from './User/userBehavior.json';

export default {
  m: {
    "message": "你好 i18n !!",
    "test": "测试",
  },
  Ubr: {
    ...enUserBehavior,
  },
  ...enUser
}