/**
 * @file af 内容安全日志详情配置
 */

export default {
    mail: {
        name: '邮件安全日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'user_name', name: '源IP/用户' },
            { key: 'src_port', name: '源端口' },
            { key: 'src_zone', name: '源区域' },
            { key: 'dst_ip', name: '目的IP' },
            { key: 'dst_port', name: '目的端口' },
            { key: 'dst_zone', name: '目的区域' },
            { key: 'sid', name: '规则ID号' },
            { key: 'policy_name', name: '匹配策略名' },
            { key: 'attack_type', name: '类型' },
            { 
                key: 'level', 
                name: '严重等级', 
                computed (rowData) {
                    let level = rowData.level_eng;
                    return {
                        color: level === 'HIGH' ? '#B94150' : (level === 'MIDDLE' ? '#FFB14D' : '')
                    };
                } 
            },
            { key: 'net_action', name: '动作' },
            { key: 'email_to', name: '收件人' },
            { key: 'email_from', name: '发件人' },
            { key: 'subject', name: '邮件主题' },
            { key: 'depict', name: '描述' }
        ]
    },
    url: {
        name: '网站访问日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'app_name', name: '网站类型' },
            { key: 'virus_name', name: '病毒名称' },
            { key: 'domain', name: '目标域名' },
            { key: 'url', name: 'URL' },
            { key: 'src_zone', name: '源区域' },
            { key: 'user_name', name: '源IP/用户' },
            { key: 'grp_name', name: '所属组' },
            { key: 'dst_ip', name: '目的IP' },
            { key: 'dst_zone', name: '目的区域' },
            { key: 'policy_name', name: '匹配策略名' },
            { key: 'depict', name: '描述' },
            { key: 'net_action', name: '动作' },
            { key: 'juzhen', name: '举证' }
        ]
    },
    firewall: {
        name: '应用控制日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'serv_app', name: '服务/应用' },
            { key: 'protocol', name: '协议' },
            { key: 'src_zone', name: '源区域' },
            { key: 'grp_name', name: '所属组' },
            { key: 'user_name', name: '源IP/用户' },
            { key: 'src_port', name: '源端口' },
            { key: 'dst_zone', name: '目的区域' },
            { key: 'dst_ip', name: '目的IP' },
            { key: 'dst_port', name: '目的端口' },
            { key: 'policy_name', name: '匹配策略名' },
            { key: 'depict', name: '描述' },
            { key: 'net_action', name: '动作' }
        ]
    },
    ips: {
        name: '漏洞攻击防护日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'attack_type', name: '类型' },
            { key: 'protocol', name: '协议' },
            { key: 'src_zone', name: '攻击者区域' },
            { key: 'src_ip', name: '攻击者IP' },
            { key: 'src_ip_belong', name: '攻击者归属地' },
            { key: 'url', name: 'URL/目录' },
            { key: 'src_port', name: '攻击者端口' },
            { key: 'dst_zone', name: '受攻击者区域' },
            { key: 'dst_ip', name: '受攻击者IP' },
            { key: 'dst_port', name: '受攻击者端口' },
            { key: 'hole_id', name: '漏洞ID' },
            { key: 'hole_name', name: '漏洞名称' },
            { key: 'policy_name', name: '匹配策略名' },
            { key: 'depict', name: '描述' },
            { key: 'solution', name: '解决方案' },
            { key: 'refernce', name: '参考信息' },
            { 
                key: 'level', 
                name: '严重等级', 
                computed (rowData) {
                    let level = rowData.level_eng;
                    return {
                        color: level === 'HIGH' ? '#FF5760' : (level === 'MIDDLE' ? '#FFB14D' : '#00C97F')
                    };
                },
                default: true
            },
            { key: 'net_action', name: '动作' }
        ]
    },
    operate: {
        name: '操作日志',
        detail: [
            { key: 'user_name', name: '用户名' },
            { key: 'user_addr', name: '主机IP' },
            { key: 'opr_obj_id', name: '操作对象' },
            { key: 'opr_obj_type', name: '操作' },
            { key: 'time', name: '日期时间' },
            { key: 'depict', name: '描述' }
        ]
    },
    utm: {
        name: '僵尸网络日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'attack_type', name: '类型' },
            { key: 'protocol', name: '协议' },
            { key: 'url', name: 'URL/目录' },
            { key: 'src_zone', name: '源区域' },
            { key: 'user_name', name: '源IP/用户' },
            { key: 'grp_name', name: '所属组' },
            { key: 'src_port', name: '源端口' },
            { key: 'dst_zone', name: '目的区域' },
            { key: 'dst_ip', name: '目的IP' },
            { key: 'dst_ip_belong', name: '目的IP归属地' },
            { key: 'dst_port', name: '目的端口' },
            { key: 'policy_name', name: '匹配策略名' },
            { 
                key: 'level', 
                name: '严重等级', 
                computed (rowData) {
                    let level = rowData.level_eng;
                    return {
                        color: level === 'HIGH' ? '#FF5760' : (level === 'MIDDLE' ? '#FFB14D' : '#00C97F')
                    };
                },
                default: true
            },
            { key: 'net_action', name: '动作' },
            { key: 'depict', name: '描述' }
        ]
    },
    waf: {
        name: 'WEB应用防护日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'attack_type', name: '类型' },
            { key: 'protocol', name: '协议' },
            { key: 'method_name', name: '方法' },
            { key: 'url', name: 'URL/目录' },
            { key: 'src_zone', name: '源区域' },
            { key: 'src_ip', name: '源IP' },
            { key: 'src_ip_belong', name: '源IP归属地' },
            { key: 'src_port', name: '源端口' },
            { key: 'dst_zone', name: '目的区域' },
            { key: 'dst_ip', name: '目的IP' },
            { key: 'dst_port', name: '目的端口' },
            { key: 'sid', name: '规则ID号' },
            { key: 'status', name: '回复状态码' },
            { key: 'policy_name', name: '匹配策略名' },
            { key: 'depict', name: '描述' },
            { 
                key: 'level', 
                name: '严重等级', 
                computed (rowData) {
                    let level = rowData.level_eng;
                    return {
                        color: level === 'HIGH' ? '#FF5760' : (level === 'MIDDLE' ? '#FFB14D' : '#00C97F')
                    };
                },
                default: true
            },
            { key: 'net_action', name: '动作' },
            { key: 'attack_risk', value: '危害说明' }
        ]
    }
};