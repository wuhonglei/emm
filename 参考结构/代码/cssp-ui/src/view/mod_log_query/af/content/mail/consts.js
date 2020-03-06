/**
 * mail常量
 */

export const COLUMNS = [
    { value: 'time', text: '时间', default: true},
    { value: 'user_name', text: '源IP/用户', default: true },
    { value: 'src_port', text: '源端口', default: false },
    { value: 'src_zone', text: '源区域', default: false },
    { value: 'dst_ip', text: '目的IP', default: true },
    { value: 'dst_port', text: '目的端口', default: false },
    { value: 'dst_zone', text: '目的区域', default: false },
    { value: 'sid', text: '规则ID号', default: false },
    { value: 'policy_name', text: '匹配策略名', default: false },
    { value: 'attack_type', text: '类型', default: true },
    { 
        value: 'level', 
        text: '严重等级', 
        computed (rowData) {
            let level = rowData.level_eng;
            return {
                color: level === 'HIGH' ? '#B94150' : (level === 'MIDDLE' ? '#FFB14D' : '')
            };
        },
        default: false
    },
    { value: 'net_action', text: '动作', default: false },
    { value: 'email_to', text: '收件人', default: true },
    { value: 'email_from', text: '发件人', default: true },
    { value: 'subject', text: '邮件主题', default: true },
    { value: 'depict', text: '描述', default: true }
];