/**
 * edr 安全日志四张表
 */

export const TABLE_COLUMNS = [
    { value: 'user_name', text: '用户名', default: true},
    { value: 'grp_name', text: '组名', default: true },
    { value: 'src_ip', text: '源IP', default: false },
    { value: 'tm_name', text: '终端类型', default: false },
    { value: 'site_name', text: '位置', default: false },
    { value: 'serv_name', text: '应用类型', default: true },
    { value: 'app_name', text: '应用名称', default: true },
    { value: 'virus', text: '病毒名称', default: true },
    { value: 'net_action', text: '访问控制', default: true },
    { value: 'time', text: '时间', default: true }
];
