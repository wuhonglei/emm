/**
 * ips日志，参数规则文件
 */

export default {
    uuid: {},
    attackZone: {
        key: 'src_zone'
    },
    attackIp: {
        key: 'src_ip',
        detail: {
            splitArray: {}
        }
    },
    attackedZone: {
        key: 'dst_zone'
    },
    attackedIp: {
        key: 'dst_ip',
        detail: {
            splitArray: {}
        }
    },
    holeType: {
        key: 'attack_type'
    },
    holeId: {
        key: 'hole_id',
        detail: {
            array: {}
        }
    },
    level: {
        default: ['致命', '高', '中', '低', '信息']
    },
    action: {
        key: 'net_action',
        default: ['允许', '拒绝']
    }

};