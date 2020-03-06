/**
 * edr 操作日志
 */

export const TABLE_COLUMNS = [
    { value: 'user_name', text: '用户', 'min-width': '70px', default: true },
    { value: 'src_ip', text: 'IP地址', 'min-width': '150px', default: true },
    { value: 'opr', text: '操作类型', 'min-width': '150px', default: true },
    { value: 'module', text: '操作对象', 'min-width': '150px', default: true },
    { value: 'desc', text: '操作描述', 'min-width': '450px', default: true },
    { value: 'success', text: '操作结果', 'min-width': '70px', default: true },
    { value: 'time', text: '操作时间', 'min-width': '150px', default: true }
];

export const NAMES = {
    srcIp: 'IP地址',
    userName: '用户'
};