/**
 * @file 表单列
 */

let columns = [
    {
        text: '时间',
        value: 'time',
        default: true
    },
    {
        text: '资产名称',
        value: 'collector_name',
        default: true
    },
    {
        text: '资产IP',
        value: 'collector_ip',
        default: true
    },
    {
        text: '源IP',
        value: 'src_ip',
        default: true
    },
    {
        text: '源端口',
        value: 'src_port',
        default: true
    },
    {
        text: '目的IP',
        value: 'dst_ip',
        default: true
    },
    {
        text: '目的端口',
        value: 'dst_port',
        default: true
    },
    {
        text: '严重程度',
        value: 'level',
        default: true
    }
];

export default columns;