/**
 * @file 系统中心路由配置
 */

export default {
    path: 'system_center',
    name: 'sysCenter',
    meta: {
        navOptions: {
            text: '设置',
            name: 'sysCenter',
            icon: 'sys-settings'
        }
    },
    redirect: {
        name: 'sysCenterExternStorage'
    },
    component: () => 
        import(/* webpackChunkName: "sysCenter" */ 'src/view/mod_sys_center'),
    children: [{
        path: 'external_storage',
        name: 'sysCenterExternStorage',
        meta: {
            navOptions: {
                text: '外置存储'
            }
        },
        component: () => 
            import(/* webpackChunkName: "sysCenter" */ 'src/view/mod_sys_center/external_storage')
    }, {
        path: 'log_backup',
        name: 'sysCenterLogBack',
        meta: {
            navOptions: {
                text: '日志备份'
            }
        },
        component: () => 
            import(/* webpackChunkName: "sysCenter" */ 'src/view/mod_sys_center/log_backup')
    }, {
        path: 'log_recover',
        name: 'sysCenterLogRecover',
        meta: {
            navOptions: {
                text: '日志恢复'
            }
        },
        component: () => 
            import(/* webpackChunkName: "sysCenter" */ 'src/view/mod_sys_center/log_recover')
    }, {
        path: 'log_settings',
        name: 'sysCenterLogSettings',
        meta: {
            navOptions: {
                text: '日志设置'
            }
        },
        component: () => 
            import(/* webpackChuckName: "sysCenter" */ 'src/view/mod_sys_center/log_settings')
    }, {
        path: 'log_operations',
        name: 'sysCenterLogOperations',
        meta: {
            navOptions: {
                text: '操作日志'
            }
        },
        component: () => 
        import(/* webpackChuckName: "sysCenter" */ 'src/view/mod_sys_center/operation')
    }]
};