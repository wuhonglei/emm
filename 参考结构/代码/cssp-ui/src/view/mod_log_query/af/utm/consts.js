/**
 * utm常量
 */

export const COLUMNS = [
    { value: 'time', text: '时间', default: true },
    { value: 'attack_type', text: '类型', default: true },
    { value: 'protocol', text: '协议', default: false },
    { value: 'url', text: 'URL/目录', default: false },
    { value: 'src_zone', text: '源区域', default: false },
    { value: 'user_name', text: '源IP/用户', default: true },
    { value: 'grp_name', text: '所属组', default: false },
    { value: 'src_port', text: '源端口', default: false },
    { value: 'dst_zone', text: '目的区域', default: false },
    { value: 'dst_ip', text: '目的IP', default: true },
    { value: 'dst_ip_belong', text: '目的IP归属地', default: true },
    { value: 'dst_port', text: '目的端口', default: false },
    { value: 'policy_name', text: '匹配策略名', default: false },
    { 
        value: 'level', 
        text: '严重等级', 
        computed (rowData) {
            let level = rowData.level_eng;
            return {
                color: level === 'HIGH' ? '#FF5760' : (level === 'MIDDLE' ? '#FFB14D' : '#00C97F')
            };
        },
        default: true
    },
    { value: 'net_action', text: '动作', default: true },
    { value: 'depict', text: '描述', default: true }
];