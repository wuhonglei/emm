/**
 * 日志管理路由模块
 */

import { ROUTER_NAMES } from 'src/utils/const';

export default {
    path: '/log',
    name: 'log',
    redirect: { name: 'userLog' },
    meta: {
        name: ROUTER_NAMES.logManage,
        perm: 'log',
        showInNavigation: true
    },
    component: () =>
        import(
            /* webpackChunkName: "log" */ 'src/page_index/views/log/index.vue'
        ),
    children: [
        {
            path: 'userLog',
            name: 'userLog',
            meta: {
                name: ROUTER_NAMES.userLog,
                perm: 'userLog'
            },
            component: () =>
                import(
                    /* webpackChunkName: "log" */ 'src/page_index/views/log/user_log/index.vue'
                )
        },
        {
            path: 'adminLog',
            name: 'adminLog',
            meta: {
                name: ROUTER_NAMES.adminLog,
                perm: 'adminLog'
            },
            component: () =>
                import(
                    /* webpackChunkName: "log" */ 'src/page_index/views/log/admin_log/index.vue'
                )
        },
        {
            path: 'systemLog',
            name: 'systemLog',
            meta: {
                name: ROUTER_NAMES.systemLog,
                perm: 'systemLog'
            },
            component: () =>
                import(
                    /* webpackChunkName: "log" */ 'src/page_index/views/log/system_log/index.vue'
                )
        }
    ]
};
