import service from '@/common/httpService';


// 获取公钥
export const webGetAdminRSAAuthKey = params => service.post('/api/ping-open/getAuthKey', params);
// 发送通知
export const webGetAdminSendNotice = params => service.post('/api/ping-admin/sendNotice', params);

// 权限ID查询菜单
export const webGetAdminUserFindRoleById = params => service.post('/api/ping-auth-menu/findAuthMenuByAdminId', params);
// 创建管理员
export const webGetAdminRegisterAdd = params => service.post('/api/ping-admin/admin/register', params);
// 管理员列表
export const webGetAdminPageList = params => service.post('/api/ping-admin/admin/pageList', params);
// 更改管理员账号状态
export const webGetAdminPageDisable = params => service.post('/api/ping-admin/admin/disable', params);
// 系统日志列表
export const webGetAdminPageSysJournalList = params => service.post('/api/ping-sys-log/pageSysLogList', params);

// 添加路由
export const webGetAdminMenuAdd = params => service.post('/api/ping-auth-menu/addAuthMenu', params);
// 修改路由
export const webGetAdminMenuUpdate = params => service.post('/api/ping-auth-menu/updateAuthMenu', params);
// 删除路由
export const webGetAdminMenuDelte = params => service.post('/api/ping-auth-menu/delAuthMenu', params);
// 路由树列表
export const webGetAdminMenuTreeList = params => service.post('/api/ping-auth-menu/findMenuTree', params);
// 路由列表
export const webGetAdminMenuRightList = params => service.post('/api/ping-auth-menu/findAuthMenus', params);

// 添加角色
export const webGetAdminRoleAdd = params => service.post('/api/ping-auth-menu/addAuthRole', params);
// 修改角色
export const webGetAdminRoleUpdate = params => service.post('/api/ping-auth-menu/updateAuthRole', params);
// 删除角色
export const webGetAdminRoleDelte = params => service.post('/api/ping-auth-menu/delAuthRole', params);
// 角色列表
export const webGetAdminMenuRoleList = params => service.post('/api/ping-auth-menu/findAuthRoleList', params);

// 登录
export const webGetAdminUserLogin = params => service.post('/api/ping-admin/login', params);
// 首页用户统计
export const webGetAdminUserMemberStatistics = params => service.post('/api/ping-admin/homeMemberStatistics', params);
// 首页用户注册统计
export const webGetAdminUserRegistrationsStatistics = params => service.post('/api/ping-admin/userRegistrations', params);
// 首页资产统计
export const webGetAdminUserRegistrationsStatisticsList = params => service.post('/api/ping-admin/homeAssetsRecordStatistics', params);

// 用户列表
export const webGetAdminPageUserList = params => service.post('/api/ping-admin/pageUserList', params);
// 账号激活设置
export const webGetAdminPageUserAtive = params => service.post('/api/ping-admin/active', params);
// 账号状态设置
export const webGetAdminPageUserBlockedAccount = params => service.post('/api/ping-admin/blockedAccount', params);
// 账号注册
export const webGetAdminPageUserRegister = params => service.post('/api/ping-admin/register', params);
// 修改账号信息
export const webGetAdminPageUserUpdateUser = params => service.post('/api/ping-admin/updateUser', params);
// 用户购买合约
export const webGetAdminPageUserBuyContract = params => service.post('/api/ping-admin/buyUserContract', params);
// 用户任务列表
export const webGetAdminPageUserOpenTaskList = params => service.post('/api/ping-task/noOpenTaskList', params);
// 用户余额
export const webGetAdminPageUserRemainingAccount = params => service.post('/api/ping-task-investment/remainingAccount', params);
// 用户购买任务
export const webGetAdminPageUserInvestmentTaskBuy = params => service.post('/api/ping-admin/userInvestmentTask', params);


// 用户审核列表
export const webGetAdminPageUserAuditList = params => service.post('/api/ping-kyc/pageKycList', params);
// 用户审核
export const webGetAdminPageUserAuditAgree = params => service.post('/api/ping-kyc/checkKyc', params);


// 公告列表
export const webGetAdminUserNoticeList = params => service.post('/api/ping-notice/list', params);
// 添加公告
export const webGetAdminUserNoticeAdd = params => service.post('/api/ping-notice/add', params);
// 修改公告状态
export const webGetAdminUserNoticeUpdateStatus = params => service.post('/api/ping-notice/updateStatus', params);
// 修改公告
export const webGetAdminUserNoticeUpdate = params => service.post('/api/ping-notice/update', params);


// 轮播图列表
export const webGetAdminUserBannerList = params => service.post('/api/ping-banner/list', params);
// 添加轮播图
export const webGetAdminUserBannerAdd = params => service.post('/api/ping-banner/add', params);
// 修改轮播图状态
export const webGetAdminUserBannerUpdateStatus = params => service.post('/api/ping-banner/updateStatus', params);
// 修改轮播图
export const webGetAdminUserBannerUpdate = params => service.post('/api/ping-banner/update', params);
