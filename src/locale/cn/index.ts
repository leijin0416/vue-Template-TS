/** 全局JSON
 * 
 *  用户列表模块
 */
import zhUser from './User/userAudit.json';
import zhUserBehavior from './User/userBehavior.json';
import userGrade from './User/userGrade.json';
import userGradesList from './User/userGradesList.json';
import userList from './User/userList.json';
import userRegister from './User/userRegister.json';

// 用户资产模块
import assetRecordsList from './UserAssets/assetRecordsList.json';
import userAssetsStatistics from './UserAssets/userAssetsStatistics.json';
import userCarry from './UserAssets/userCarry.json';
import userRecharge from './UserAssets/userRecharge.json';
import userTurn from './UserAssets/userTurn.json';

// 全局模块 首页/登录
import home from './Home/index.json';
// 系统日志模块
import editionList from './Allocation/editionList.json';
// 推广图模块
import extension from './Extension/index.json';
// 推广图模块
import coupon from './Coupon/index.json';
// 资讯模块 公告/轮播
import bannerList from './Informations/bannerList.json';
// 管理员模块
import administrators from './System/administrators.json';
import roleList from './System/roleList.json';
import route from './System/route.json';
// 合约模块
import activityList from './Contract/activityList.json';
import contractList from './Contract/contractList.json';
import contractStatistics from './Contract/contractStatistics.json';
import contractTackList from './Contract/contractTackList.json';

// 商家模块
import businessAudit from './UserBusiness/businessAudit.json';
import businessList from './UserBusiness/businessList.json';
import commissionList from './UserBusiness/commissionList.json';
import userApplyList from './UserBusiness/userApplyList.json';

// 重复消费模块
import repeatConsumption from './Repeat/index.json';

export default {
  m: {
    "message": "你好 i18n !!",
    "test": "测试",
  },
  Hlin: {
    ...home,
  },
  Aelt: {
    ...editionList,
  },
  Aeon: {
    ...extension,
  },
  Acon: {
    ...coupon,
  },
  Balt: {
    ...businessAudit,
  },
  Bslt: {
    ...businessList,
  },
  Bclt: {
    ...commissionList,
  },
  Buat: {
    ...userApplyList,
  },
  Calt: {
    ...activityList,
  },
  Ctlt: {
    ...contractList,
  },
  Cslt: {
    ...contractStatistics,
  },
  Ctkt: {
    ...contractTackList,
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
  Rclt: {
    ...repeatConsumption,
  },
  Ubr: {
    ...zhUserBehavior,
  },
  Uge: {
    ...userGrade
  },
  Ugt: {
    ...userGradesList
  },
  Ult: {
    ...userList
  },
  Ureg: {
    ...userRegister
  },
  Uart: {
    ...assetRecordsList
  },
  Uass: {
    ...userAssetsStatistics
  },
  Uacy: {
    ...userCarry
  },
  Uarg: {
    ...userRecharge
  },
  Uatn: {
    ...userTurn
  },
  ...zhUser
}