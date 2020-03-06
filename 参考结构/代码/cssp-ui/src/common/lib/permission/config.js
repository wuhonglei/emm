/**
 * @file 权限管理配置
 * 
 */

export default {

    // 标识了权限与路由的对应关系
    // permission代表该路由所需要的权限
    // role代表该路由所对应的角色（超管默认有所有role的权限），可以是数组，函数或者字符串
    // next代表路由权限判断不通过的下一跳，不填写则默认是数组的下一项
    routes: [
        { name: 'homePage', permission: 'dc_home_page' },
        { name: 'emergencyEvt', permission: 'dc_alarm_event' },
        { name: 'assetCenterManage', permission: 'dc_dev_collector' },
        { name: 'assetCenterCollector', permission: 'dc_dev_plugin' },
        { name: 'logQuery', permission: 'dc_log_search' },
        { name: 'report', permission: 'dc_report_form' },
        { name: 'auditStrategy', permission: 'dc_audit_strategy' },
        { name: 'sysCenterExternStorage', permission: 'dc_sys_external_storage' },
        { name: 'sysCenterLogBack', permission: 'dc_sys_log_back' },
        { name: 'sysCenterLogRecover', permission: 'dc_sys_log_recover' },
        { name: 'sysCenterLogSettings', permission: 'dc_sys_log_set' },
        { name: 'sysCenterLogOperations', permission: 'dc_sys_opr_log' }
    ],
    permissions: {
        forbidden: 'no',
        read: 'read',
        write: 'edit'
    }
};