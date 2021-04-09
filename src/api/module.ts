import service from '@/common/httpService';


// 创建管理员
export const webGetAdminRegisterAdd = params => service.post('/admin/api/ping-admin/admin/register', params);
// 管理员列表
export const webGetAdminPageList = params => service.post('/admin/api/ping-admin/admin/pageList', params);
// 更改管理员账号状态
export const webGetAdminPageDisable = params => service.post('/admin/api/ping-admin/admin/disable', params);


// 登录
export const webGetAdminUserLogin = params => service.post('/admin/api/ping-admin/login', params);
// 用户列表
export const webGetAdminPageUserList = params => service.post('/admin/api/ping-admin/pageUserList', params);
// 账号激活设置
export const webGetAdminPageUserAtive = params => service.post('/admin/api/ping-admin/active', params);
// 账号状态设置
export const webGetAdminPageUserBlockedAccount = params => service.post('/admin/api/ping-admin/blockedAccount', params);
// 账号注册
export const webGetAdminPageUserRegister = params => service.post('/admin/api/ping-admin/register', params);
// 修改账号信息
export const webGetAdminPageUserUpdateUser = params => service.post('/admin/api/ping-admin/updateUser', params);
// 用户购买合约
export const webGetAdminPageUserBuyContract = params => service.post('/admin/api/ping-admin/buyUserContract', params);
// 用户任务列表
export const webGetAdminPageUserOpenTaskList = params => service.post('/admin/api/ping-task/noOpenTaskList', params);
// 用户余额
export const webGetAdminPageUserRemainingAccount = params => service.post('/admin/api/ping-task-investment/remainingAccount', params);
// 用户购买任务
export const webGetAdminPageUserInvestmentTaskBuy = params => service.post('/admin/api/ping-admin/userInvestmentTask', params);
// 用户等级列表
export const webGetAdminPageUserLevelList = params => service.post('/admin/api/ping-user-level/pageUserLevelList', params);


// 用户审核列表
export const webGetAdminPageUserAuditList = params => service.post('/admin/api/ping-kyc/pageKycList', params);


// 合约列表
export const webGetAdminContractList = params => service.post('/admin/api/ping-contract/pageContractList', params);
// 添加合约列表
export const webGetAdminContractAdd = params => service.post('/admin/api/ping-contract/addContract', params);
// 修改合约列表
export const webGetAdminContractUpdate = params => service.post('/admin/api/ping-contract/updateContract', params);
// 删除合约列表
export const webGetAdminContractDelte = params => service.post('/admin/api/ping-contract/delContract', params);

// 合约任务列表
export const webGetAdminContractTaskList = params => service.post('/admin/api/ping-task/pageTaskList', params);
// 添加合约任务列表
export const webGetAdminContractTaskAdd = params => service.post('/admin/api/ping-task/addTask', params);
// 修改合约任务列表
export const webGetAdminContractTaskUpdate = params => service.post('/admin/api/ping-task/updateTask', params);
// 删除合约任务列表
export const webGetAdminContractTaskDelte = params => service.post('/admin/api/ping-task/delTask', params);

// 合约限时折扣列表
export const webGetAdminContractActivityList = params => service.post('/admin/api/ping-contract-activity/pageContractActivityVoList', params);
// 添加合约限时折扣列表
export const webGetAdminContractActivityAdd = params => service.post('/admin/api/ping-contract-activity/addContractActivity', params);
// 修改合约限时折扣列表
export const webGetAdminContractActivityUpdate = params => service.post('/admin/api/ping-contract-activity/updateContractActivity', params);
// 删除合约限时折扣列表
export const webGetAdminContractActivityDelte = params => service.post('/admin/api/ping-contract-activity/delContractActivity', params);
// 合约限时折扣ID列表
export const webGetAdminContractActivityId = params => service.post('/admin/api/ping-contract/contractList', params);


// 用户提币列表
export const webGetAdminAssetsCarryList = params => service.post('/admin/api/ping-withdraw-order/withdrawOrderList', params);
// 手动提币
export const webGetAdminAssetsCarryManual = params => service.post('/admin/api/ping-withdraw-order/manualWithdraw', params);
// 提币审核
export const webGetAdminAssetsCarryExamine = params => service.post('/admin/api/ping-withdraw-order/examine', params);

// 权限ID
export const webGetAdminUserFindRoleById = params => service.post('/api/admin/findRoleById', params);