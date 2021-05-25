/** 全局JSON
 * 
 *  用户列表模块
 */
import zhUser from './User/userAudit.json';
import userList from './User/userList.json';
import userRegister from './User/userRegister.json';


// 全局模块 首页/登录
import home from './Home/index.json';
// 资讯模块 公告/轮播
import bannerList from './Informations/bannerList.json';
// 管理员模块
import administrators from './System/administrators.json';
import roleList from './System/roleList.json';
import route from './System/route.json';

export default {
  m: {
    "message": "你好 i18n !!",
    "test": "测试",
  },
  Hlin: {
    ...home,
  },
  Iblt: {
    ...bannerList,
  },
  Sats: {
    ...administrators,
  },
  Srls: {
    ...roleList,
  },
  Srte: {
    ...route,
  },
  Ult: {
    ...userList
  },
  Ureg: {
    ...userRegister
  },
  ...zhUser
}