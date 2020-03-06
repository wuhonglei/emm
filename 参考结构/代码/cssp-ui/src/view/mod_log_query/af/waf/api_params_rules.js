/**
 * waf日志，参数规则文件
 */

export default {
    uuid: {},
    srcZone: {
        key: 'src_zone'
    },
    srcIp: {
        key: 'src_ip',
        detail: {
            splitArray: {}
        }
    },
    dstZone: {
        key: 'dst_zone'
    },
    dstIp: {
        key: 'dst_ip',
        detail: {
            splitArray: {}
        }
    },
    attackType: {
        key: 'attack_type'
    },
    sid: {
        detail: {
            splitArray: {}
        }
    },
    status: {
        detail: {
            splitArray: {}
        }
    },
    url: {
        key: 'content_ft'
    },
    level: {
        default: ['高', '中', '低']
    },
    action: {
        key: 'net_action',
        default: ['允许', '拒绝']
    }

};