/**
 * 系统管理路由模块
 */

import { ROUTER_NAMES } from 'src/utils/const';
export default {
    path: '/system',
    name: 'system',
    redirect: { name: 'logConfig' },
    meta: {
        name: ROUTER_NAMES.systemManage,
        perm: 'system',
        showInNavigation: true
    },
    component: () =>
        import(
            /* webpackChunkName: "system" */ 'src/page_index/views/system/index.vue'
        ),
    children: [
        {
            path: 'logConfig',
            name: 'logConfig',
            meta: {
                name: ROUTER_NAMES.logConfig,
                perm: 'logConfig'
            },
            component: () =>
                import(
                    /* webpackChunkName: "system" */ 'src/page_index/views/system/log_config/index.vue'
                )
        },
        {
            path: 'systemSet',
            name: 'systemSet',
            meta: {
                name: ROUTER_NAMES.systemSet,
                perm: 'systemSet'
            },
            component: () =>
                import(
                    /* webpackChunkName: "system" */ 'src/page_index/views/system/system_setting/index.vue'
                )
        }
    ]
};
