import service from '@/common/httpService';

/**
 * 短信区号
 */
export const webGetSelectAreaCode = params => service.post('/api/areaCode/selectAreaCode', params);