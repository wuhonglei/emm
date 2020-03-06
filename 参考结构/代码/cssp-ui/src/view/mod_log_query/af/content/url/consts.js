/**
 * url常量
 */

export const COLUMNS = [
    { value: 'time', text: '时间', default: true },
    { value: 'app_name', text: '网站类型', default: true },
    { value: 'virus_name', text: '病毒名称', default: true },
    { value: 'domain', text: '目标域名', default: true },
    { value: 'url', text: 'URL', default: true },
    { value: 'src_zone', text: '源区域', default: false },
    { value: 'user_name', text: '源IP/用户', default: true },
    { value: 'grp_name', text: '所属组', default: false },
    { value: 'dst_ip', text: '目的IP', default: false },
    { value: 'dst_zone', text: '目的区域', default: false },
    { value: 'policy_name', text: '匹配策略名', default: false },
    { value: 'depict', text: '描述', default:false },
    { value: 'net_action', text: '动作', default: true },
    { value: 'juzhen', text: '举证', default: true }
];