/** 
 *  以小驼峰且 webGet + Admin + 文件名
 *  接口信息定义: 以当前接口请求头作为别名,并将相关接口放置在该文件下
 */
import service from '@/common/https/httpService'

// 登录
export const webGetAdminUserLogin = params => service.post('/whale-swim/api/auth-admin/login', params);
// 获取公钥
export const webGetAdminRSAAuthKey = params => service.post('/api/ping-open/getAuthKey', params);

// 首页用户注册统计
export const webGetAdminUserHomeStatisticEchartsLines = params => service.post('/whale-swim/api/index/indexMemberStatistics', params);
// 首页各类型人数统计
export const webGetAdminUserHomeStatisticEchartsPies = params => service.post('/whale-swim/api/index/statistic', params);

// 权限ID查询菜单
export const webGetAdminUserFindRoleById = params => service.post('/whale-swim/api/auth-menu/findAuthMenuByAdminId', params);
// 创建管理员
export const webGetAdminRegisterAdd = params => service.post('/whale-swim/api/auth-admin/register', params);
// 管理员列表
export const webGetAdminPageList = params => service.post('/whale-swim/api/auth-admin/pageList', params);
// 更改管理员账号状态
export const webGetAdminPageDisable = params => service.post('/whale-swim/api/auth-admin/disable', params);

// 添加路由
export const webGetAdminMenuAdd = params => service.post('/whale-swim/api/auth-menu/addAuthMenu', params);
// 修改路由
export const webGetAdminMenuUpdate = params => service.post('/whale-swim/api/auth-menu/updateAuthMenu', params);
// 删除路由
export const webGetAdminMenuDelte = params => service.post('/whale-swim/api/auth-menu/delAuthMenu', params);
// 路由树列表
export const webGetAdminMenuTreeList = params => service.post('/whale-swim/api/auth-menu/findMenuTree', params);
// 路由列表
export const webGetAdminMenuRightList = params => service.post('/whale-swim/api/auth-menu/findAuthMenus', params);

// 添加角色
export const webGetAdminRoleAdd = params => service.post('/whale-swim/api/auth-menu/addAuthRole', params);
// 修改角色
export const webGetAdminRoleUpdate = params => service.post('/whale-swim/api/auth-menu/updateAuthRole', params);
// 删除角色
export const webGetAdminRoleDelte = params => service.post('/whale-swim/api/auth-menu/delAuthRole', params);
// 角色列表
export const webGetAdminMenuRoleList = params => service.post('/whale-swim/api/auth-menu/findAuthRoleList', params);
// 按钮权限列表
export const webGetAdminRoleButtonList = params => service.post('/whale-swim/api/auth-menu/findRoleMenuList', params);
// 按钮权限 -修改
export const webGetAdminRoleButtonUpdate = params => service.post('/whale-swim/api/auth-menu/roleMenuButton', params);

// 公告列表
export const webGetAdminUserNoticeList = params => service.post('/whale-swim/api/ping-notice/list', params);
// 添加公告
export const webGetAdminUserNoticeAdd = params => service.post('/whale-swim/api/ping-notice/add', params);
// 修改公告状态
export const webGetAdminUserNoticeUpdateStatus = params => service.post('/whale-swim/api/ping-notice/updateStatus', params);
// 修改公告
export const webGetAdminUserNoticeUpdate = params => service.post('/whale-swim/api/ping-notice/update', params);

// 轮播图列表
export const webGetAdminUserBannerList = params => service.post('/whale-swim/api/ping-banner/list', params);
// 添加轮播图
export const webGetAdminUserBannerAdd = params => service.post('/whale-swim/api/ping-banner/add', params);
// 修改轮播图状态
export const webGetAdminUserBannerUpdateStatus = params => service.post('/whale-swim/api/ping-banner/updateStatus', params);
// 修改轮播图
export const webGetAdminUserBannerUpdate = params => service.post('/whale-swim/api/ping-banner/update', params);

// 系统日志列表
export const webGetAdminPageSysJournalList = params => service.post('/whale-swim/api/box-sys-log/pageSysLogList', params);
// 版本列表
export const webGetAdminEditionList = params => service.post('/whale-swim/api/ping-version/list', params);
// 修改版本
export const webGetAdminEditionUpdate = params => service.post('/whale-swim/api/ping-version/update', params);
