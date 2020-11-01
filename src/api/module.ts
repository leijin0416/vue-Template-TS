import service from '@/common/httpService';

/**
 * 短信区号
 */
export const webGetSelectAreaCode = params => service.post('/api/areaCode/selectAreaCode', params);

export const webGetUserLogin = params => service.post('/api/admin/login', params);

export const webGetUserfindRoleById = params => service.post('/api/admin/findRoleById', params);