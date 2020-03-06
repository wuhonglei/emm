/**
 * 第三方日志，参数规则文件
 */

export default {
    uuid: {
        key: 'uuid'
    },
    grpName: {
        key: 'grp_name',
        default: ['所有']
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
    level: {
        key: 'level',
        default: []
    },
    netAction: {
        key: 'net_action',
        default: ['记录', '拒绝', '告警']
    },
    evtType: {
        key: 'attack_type',
        default: []
    },
    keywords: {
        key: 'content_ft'
    }
};
