/**
 * @file ac 终端日志详情
 */

export default {
    ingress: {
        name: '准入日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'user_name', name: '用户名' },
            { key: 'grp_name', name: '组名' },
            { key: 'src_ip', name: '源IP' },
            { key: 'tm_name', name: '终端类型' },
            { key: 'site_name', name: '位置' },
            { key: 'rule_type', name: '规则类型' },
            { key: 'rule_name', name: '规则名称' },
            { key: 'content', name: '规则描述' },
            { key: 'result', name: '检测结果' },
            { key: 'rule_action', name: '违规操作' }
        ]
    },
    proxy: {
        name: '代理工具管理日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'user_name', name: '用户名' },
            { key: 'grp_name', name: '组名' },
            { key: 'src_ip', name: '源IP' },
            { key: 'tm_name', name: '终端类型' },
            { key: 'proxytool', name: '代理工具' },
            { key: 'status', name: '状态' }
        ]
    },
    share: {
        name: '防共享接入日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'grp_name', name: '组名' },
            { key: 'src_ip', name: '源IP' },
            { key: 'tm_name', name: '终端类型' },
            { key: 'prcnt', name: '共享终端数' },
            { key: 'site_name', name: '位置' },
            { key: 'net_action', name: '访问控制' }
        ]
    },
    tm: {
        name: '移动终端发现日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'user_name', name: '用户名' },
            { key: 'grp_name', name: '组名' },
            { key: 'src_ip', name: '源IP' },
            { key: 'tm_name', name: '终端类型' },
            { key: 'freeze', name: '状态' },
            { key: 'site_name', name: '位置' }
        ]
    }
};