import service from '@/common/service';

/**
 * 短信区号
 */
export const webGetSelectAreaCode = params => service.post('/api/areaCode/selectAreaCode', params);