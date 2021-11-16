import Vue from 'vue';
import { sessionData } from '@/filters/storage';
import { TreeForeach } from '@/filters/common';

// 权限检查
const hasPermission = (val, item) => {
  // console.log(item);
  // 当前按钮列表，用本地缓存存储
  // let btnPermissionList = JSON.parse(sessionStorage.getItem('btnPermission') as any);
  let btnPermissionList = item;
  
  if (btnPermissionList === undefined || btnPermissionList == null) return false;
  
  // 因为后台返回的不是以按钮名的数组，所以需要过滤
  let eglishPermission = btnPermissionList.map((v, i) => {
    return v
  })
  // 全部显示
  if(eglishPermission.includes('total')) return true

  // 是否在权限数组里面
  let status = eglishPermission.includes(val);
  return status
};

// 全局自定义指令
Vue.directive('allow', {
  inserted: (el: any, binding: any, vnode: any) => {
    // let btnPermissions = vnode.context.$route.meta.btnPermissions.split(",");  // 拿不到动态的
    let sessionRouterMap: any = sessionData('get', 'HasSessionRouterMap', '');
    let treeData = JSON.parse(sessionRouterMap);  // 后台权限路由

    let route = vnode.context.$route;
    let permission = [];

    TreeForeach(treeData, tree => {
      if (tree.router === route.path) {
        let data = tree.permission.split(",");
        if(data.length > 0) permission = data;
        else permission = tree.permission;
      }
    });
    // console.log(vnode);
    
    if (!hasPermission(binding.value, permission)) {
      el.parentNode.removeChild(el);
    }
  }
});

/** 全局方法挂载
 *  https://www.cnblogs.com/yzyh/p/11550416.html
 *  https://blog.csdn.net/weixin_45393280/article/details/105061302?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-17.control&dist_request_id=&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-17.control
 * 
 *  v-if="$_has('add')"
 */
Vue.prototype.$_has = hasPermission