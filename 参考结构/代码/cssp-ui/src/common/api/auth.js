/**
 * @file 权限相关接口
 */

import axios from './index';

export function loadPermission () {
    return axios({
        url: '/api/system_manage/',
        method: 'get',
        params: {
            action: 'get_user_perm'
        }
    });

    // return {
    //     data: {
    //         data: {
    //             permission: {
    //                 dc_home_page: 'read',
    //                 dc_alarm_event: 'read',
    //                 dc_dev_collector: 'read',
    //                 dc_dev_plugin: 'read',
    //                 dc_log_search: 'read',
    //                 dc_report_form: 'read',
    //                 dc_audit_strategy: 'read',
    //                 dc_sys_external_storage: 'read',
    //                 dc_sys_log_back: 'read',
    //                 dc_sys_log_recover: 'read',
    //                 dc_sys_log_set: 'read',
    //                 dc_sys_opr_log: 'read'
    //             }
    //         }
    //     }
    // };
}