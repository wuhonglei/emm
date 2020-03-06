/**
 * @file 第三方日志详情
 */

export default {
    name: '第三方日志',
    detail: {
        tc: {
            name: '第三方日志',
            detail: [{
                name: '时间',
                key: 'time'
            }, {
                name: '资产名称',
                key: 'collector_name'
            }, {
                name: '接入方式',
                key: 'log_from'
            }, {
                name: '采集器类型',
                key: 'plugin_name'
            }, {
                name: '等级',
                key: 'level'
            }, {
                name: '类型',
                key: 'subtype'
            }, {
                name: '源IP',
                key: 'src_ip'
            }, {
                name: '源端口',
                key: 'src_port'
            }, {
                name: '目的IP',
                key: 'dst_ip'
            }, {
                name: '目的端口',
                key: 'dst_port'
            }]
        }
    }
};