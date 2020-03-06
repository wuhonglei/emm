/**
 * 第三方日志，参数规则文件
 */

export default {
    collectorName: {
        key: 'uuid',
        default: '所有采集器'
    },
    pluginName: {
        key: 'plugin_name'
    },
    level: {
        default: ['致命', '高', '中', '低', '信息']
    },
    srcIp: {
        key: 'src_ip',
        detail: {
            splitArray: {}
        }
    },
    dstIp: {
        key: 'dst_ip',
        detail: {
            splitArray: {}
        }
    },
    content: {
        key: 'content_ft'
    }

};