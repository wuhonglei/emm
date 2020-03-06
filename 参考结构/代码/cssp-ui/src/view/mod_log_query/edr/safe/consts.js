/**
 * edr 安全日志四张表
 */

export const TABLE_COLUMNS = {
    FLUX: [
        { value: 'visitor', text: '访问者', 'min-width': '100px', default: true },
        { value: 'src_proc', text: '源进程', default: true },
        { value: 'src_ip', text: '源IP', default: true },
        { value: 'provider', text: '服务提供者', default: true },
        { value: 'dst_proc', text: '目的进程', default: true },
        { value: 'dst_ip', text: '目的IP', default: true },
        { value: 'service_name', text: '服务', default: true },
        { value: 'flux_size', text: '总流量大小', default: true },
        { value: 'time', text: '最近访问时间', 'min-width': '150px', default: true },
        { value: 'strategy', text: '策略名称', 'min-width': '200px', default: true },
        { value: 'net_action', text: '动作', 'min-width': '50px', default: true }
    ],

    INVASION: [
        { value: 'host_name', text: '终端名称', 'min-width': '150px', default: true },
        { value: 'src_ip', text: 'IP地址', 'min-width': '150px', default: true },
        { value: 'event_type', text: '事件类型', 'min-width': '100px', default: true },
        { value: 'event_desc', text: '事件描述', pre: true, 'min-width': '200px', default: true },
        { value: 'time', text: '最近发生时间', 'min-width': '150px', default: true },
        { value: 'state', text: '处理状态', 'min-width': '70px', default: true }
    ],

    VIRUS: [
        { value: 'host_name', text: '终端名称', 'min-width': '150px', default: true },
        { value: 'src_ip', text: 'IP地址', 'min-width': '150px', default: true },
        { value: 'event_type', text: '事件类型', 'min-width': '100px', default: true },
        { value: 'event_desc', text: '事件描述', pre: true, 'min-width': '200px', default: true },
        { value: 'time', text: '最近发生时间', 'min-width': '150px', default: true },
        { value: 'state', text: '处理状态', 'min-width': '70px', default: true }
    ],

    BLSCAN: [
        { value: 'host_name', text: '终端名称', 'min-width': '150px', default: true },
        { value: 'src_ip', text: 'IP地址', default: true },
        { value: 'zone_name', text: '所属组织', default: true },
        { value: 'system', text: '操作系统', default: true },
        { value: 'time', text: '最近扫描时间', 'min-width': '150px', default: true },
        { value: 'result', text: '检查结果', 'min-width': '100px', default: true }
    ]
};

export const TYPES = {
    flux: '微隔离日志',
    invasion: '入侵检测日志',
    virus: '杀毒扫描日志',
    blscan: '基线检查日志'
};

export const QUERY_NAME = {
    flux: {
        uuid: '数据来源',
        type: '日志类型',
        visitor: '访问者',
        provider: '服务提供者',
        serviceName: '服务',
        process: '进程',
        netAction: '访问动作',
        fluxIp: 'IP'
    },
    other: {
        uuid: '数据来源',
        type: '日志类型',
        hostName: '终端名称',
        ipList: 'IP地址'
    }
};