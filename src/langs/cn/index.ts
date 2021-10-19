/** 全局JSON
 * 
 *  用户列表模块
 */
import userList from './User/index.json';

// 管理员模块
import administrators from './System/administrators.json';
import roleList from './System/roleList.json';
import route from './System/route.json';

// 全局模块 首页/登录
import home from './Home/index.json';
// 系统日志模块
import editionList from './Setup/editionList.json';
// 资讯模块 公告/轮播
import bannerList from './NoticeBanner/bannerList.json';

export default {
  m: {
    "message": "你好 i18n !!",
    "test": "测试",
  },
  Hlin: {
    ...home,
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
  Aelt: {
    ...editionList,
  },
  Iblt: {
    ...bannerList,
  },
  User: {
    ...userList
  },
}