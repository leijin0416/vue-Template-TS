import service from '@/common/https/httpService';

// 用户列表
export const webGetAdminPageUserList = params => service.post('/whale-swim/api/cn-member/memberList', params);
// 购买附加配套列表
export const webGetAdminPageUserMemberAdditionalAdd = params => service.post('/whale-swim/api/cn-package/buyPackage', params);
// 用户配套列表
export const webGetAdminPageUserMemberPackageList = params => service.post('/whale-swim/api/cn-package/packageList', params);


// 时段列表
export const webGetAdminPageCoachDayTimeList = params => service.post('/whale-swim/api/cn-schedule-time/timeList', params);
// 泳道列表
export const webGetAdminPageCoachLaneList = params => service.post('/whale-swim/api/cn-lane-config/laneList', params);
// 课程列表
export const webGetAdminPageCoachsCourseList = params => service.post('/whale-swim/api/cn-class-type/classList', params);
// 排班列表 -日期
export const webGetAdminPageCoachSchedulingWeeksDate = params => service.post('/whale-swim/api/cn-schedule/getWeekDate', params);
// 排班课程列表
export const webGetAdminPageCoachsCourseListInfo = params => service.post('/whale-swim/api/cn-schedule/getSchedulingInfo', params);
