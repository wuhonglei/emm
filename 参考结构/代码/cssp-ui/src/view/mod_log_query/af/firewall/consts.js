/**
 * firewall常量
 */

export const COLUMNS = [
    { value: 'time', text: '时间', default: true },
    { value: 'serv_app', text: '服务/应用', default: true },
    { value: 'protocol', text: '协议', default: true },
    { value: 'src_zone', text: '源区域', default: true },
    { value: 'grp_name', text: '所属组', default: false },
    { value: 'user_name', text: '源IP/用户', default: true },
    { value: 'src_port', text: '源端口', default: true },
    { value: 'dst_zone', text: '目的区域', default: false },
    { value: 'dst_ip', text: '目的IP', default: true },
    { value: 'dst_port', text: '目的端口', default: true },
    { value: 'policy_name', text: '匹配策略名', default: false },
    { value: 'depict', text: '描述', default:false },
    { value: 'net_action', text: '动作', default: true }
];