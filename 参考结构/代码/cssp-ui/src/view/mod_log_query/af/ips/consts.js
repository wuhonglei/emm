/**
 * ips 常量
 */

export const COLUMNS = [
    { value: 'time', text: '时间', default: true },
    { value: 'attack_type', text: '类型', default: true },
    { value: 'protocol', text: '协议', default: true },
    { value: 'src_zone', text: '攻击者区域', default: false },
    { value: 'src_ip', text: '攻击者IP', default: true },
    { value: 'src_ip_belong', text: '攻击者归属地', default: true },
    { value: 'url', text: 'URL/目录', default: false },
    { value: 'src_port', text: '攻击者端口', default: false },
    { value: 'dst_zone', text: '受攻击者区域', default: false },
    { value: 'dst_ip', text: '受攻击者IP', default: true },
    { value: 'dst_port', text: '受攻击者端口', default: false },
    { value: 'hole_id', text: '漏洞ID', default: true },
    { value: 'hole_name', text: '漏洞名称', default: true },
    { value: 'policy_name', text: '匹配策略名', default: false },
    { value: 'depict', text: '描述', default: false },
    { value: 'solution', text: '解决方案', default: false },
    { value: 'refernce', text: '参考信息', default: true },
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
    { value: 'net_action', text: '动作', default: true }
];