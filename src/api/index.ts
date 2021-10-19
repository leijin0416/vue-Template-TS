import service from '@/common/https/httpService';

export * from './module';

// 用户列表
export const webGetAdminPageUserList = params => service.post('/back/open-user/pageList', params);
