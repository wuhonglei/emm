/**
 * @file edr 安全日志详情配置
 */

export default {
    linkage: {
        name: '联动日志',
        detail: [
            { key: 'time', name: _('联动时间'), default: true },
            { key: 'src_ip', name: _('联动设备IP'), default: true },
            { key: 'op_src', name: _('设备类型'), default: true },
            { key: 'host_name', name: _('联动终端'), default: true },
            { key: 'module_opr', name: _('联动类型'), default: true },
            { key: 'desc', name: _('联动描述'), default: true }
        ]
    },
    operate: {
        name: '操作日志',
        detail: [
            { key: 'user_name', name: '用户', 'min-width': '70px', default: true },
            { key: 'src_ip', name: 'IP地址', 'min-width': '150px', default: true },
            { key: 'opr', name: '操作类型', 'min-width': '150px', default: true },
            { key: 'module', name: '操作对象', 'min-width': '150px', default: true },
            { key: 'desc', name: '操作描述', 'min-width': '450px', default: true },
            { key: 'success', name: '操作结果', 'min-width': '70px', default: true },
            { key: 'time', name: '操作时间', 'min-width': '150px', default: true }
        ]
    },
    flux: {
        name: '微隔离日志',
        detail: [
            { key: 'visitor', name: '访问者', 'min-width': '100px', default: true },
            { key: 'src_proc', name: '源进程', default: true },
            { key: 'src_ip', name: '源IP', default: true },
            { key: 'provider', name: '服务提供者', default: true },
            { key: 'dst_proc', name: '目的进程', default: true },
            { key: 'dst_ip', name: '目的IP', default: true },
            { key: 'service_name', name: '服务', default: true },
            { key: 'flux_size', name: '总流量大小', default: true },
            { key: 'time', name: '最近访问时间', 'min-width': '150px', default: true },
            { key: 'strategy', name: '策略名称', 'min-width': '200px', default: true },
            { key: 'net_action', name: '动作', 'min-width': '50px', default: true }
        ]
    },

    invasion: {
        name: '入侵检测日志',
        detail: [
            { key: 'host_name', name: '终端名称', 'min-width': '150px', default: true },
            { key: 'src_ip', name: 'IP地址', 'min-width': '150px', default: true },
            { key: 'event_type', name: '事件类型', 'min-width': '100px', default: true },
            { key: 'event_desc', name: '事件描述', pre: true, 'min-width': '200px', default: true },
            { key: 'time', name: '最近发生时间', 'min-width': '150px', default: true },
            { key: 'state', name: '处理状态', 'min-width': '70px', default: true }
        ]
    },

    virus: {
        name: '杀毒扫描日志',
        detail: [
            { key: 'host_name', name: '终端名称', 'min-width': '150px', default: true },
            { key: 'src_ip', name: 'IP地址', 'min-width': '150px', default: true },
            { key: 'event_type', name: '事件类型', 'min-width': '100px', default: true },
            { key: 'event_desc', name: '事件描述', pre: true, 'min-width': '200px', default: true },
            { key: 'time', name: '最近发生时间', 'min-width': '150px', default: true },
            { key: 'state', name: '处理状态', 'min-width': '70px', default: true }
        ]
    },

    blscan: {
        name: '基线检查日志',
        detail: [
            { key: 'host_name', name: '终端名称', 'min-width': '150px', default: true },
            { key: 'src_ip', name: 'IP地址', default: true },
            { key: 'zone_name', name: '所属组织', default: true },
            { key: 'system', name: '操作系统', default: true },
            { key: 'time', name: '最近扫描时间', 'min-width': '150px', default: true },
            { key: 'result', name: '检查结果', 'min-width': '100px', default: true }
        ]
    }
};