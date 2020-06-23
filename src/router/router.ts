/**
 * meta 可配置参数
 * @param {boolean} icon 页面icon
 * @param {boolean} keepAlive 是否缓存页面
 * @param {string} title 页面标题
 */
export default [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('@/views/About.vue'),
        meta: {
            icon: '',
            keepAlive: true,
            title: 'index'
        }
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
            icon: '',
            keepAlive: true,
            title: 'home'
        }
    }
];