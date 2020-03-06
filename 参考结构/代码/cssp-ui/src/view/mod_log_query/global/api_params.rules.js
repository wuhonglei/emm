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
    dstIp: {
        key: 'dst_ip',
        detail: {
            splitArray: {}
        }
    },
    srcPort: {
        key: 'src_port'
    },
    dstPort: {
        key: 'dst_port'
    },
    level: {},
    keywords: {
        key: 'content_ft'
    }
};
