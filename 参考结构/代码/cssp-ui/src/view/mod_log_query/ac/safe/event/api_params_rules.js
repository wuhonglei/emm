/**
 * 第三方日志，参数规则文件
 */

export default {
    uuid: {
        key: 'uuid'
    },
    srcIp: {
        key: 'src_ip',
        detail: {
            splitArray: {}
        }
    },
    tmName: {
        key: 'tm_name',
        default:[],
        detail: {
            selectTree: {}
        }
    },
    siteName: {
        key: 'site_name',
        default:[],
        detail: {
            selectTree: {}
        }
    },
    priority: {
        default: ['高', '中', '低']
    },
    netAction: {
        key: 'net_action',
        default: ['防御', '告警']
    },
    srcPort: {
        key: 'src_port'
    },
    dstPort: {
        key: 'dst_port'
    },
    protocol: {
        default: ['6', '17', '1', '0']
    },
    rulesNumber: {
        key: 'sid'
    }
};
