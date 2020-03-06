/**
 * 常量
 */

export const COLUMNS = [
    { value: 'priority', text: '优先级', default: true},
    { value: 'src_ip', text: '主机IP', default: false },
    { value: 'tm_name', text: '终端类型', default: false },
    { value: 'site_name', text: '位置', default: false },
    { value: 'dst_ip', text: '目标IP', default: true },
    { value: 'sid', text: '规则编号', default: true },
    { value: 'src_port', text: '源端口', default: true },
    { value: 'dst_port', text: '目的端口', default: true },
    { value: 'protocol', text: '协议', default: true },
    { value: 'net_action', text: '防御动作', default: true },
    { value: 'sigclass', text: '防御类型', default: true },
    { value: 'time', text: '时间', default: true },
    { value: 'signame', text: '描述', default: false },
    { value: 'ref', text: '引用链接', default: false }
];