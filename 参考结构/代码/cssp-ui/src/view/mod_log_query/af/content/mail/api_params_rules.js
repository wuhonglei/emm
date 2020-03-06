/**
 * firewall日志，参数规则文件
 */

export default {
    uuid: {},
    srcZone: {
        key: 'src_zone'
    },
    srcIp: {
        key: 'src_ip',
        detail: {
            existOnly: {
                key: 'userSelect',
                value: 'src_ip'
            },
            splitArray: {}
        }
    },
    userName: {
        key: 'user_name',
        detail: {
            existOnly: {
                key: 'userSelect',
                value: 'user_name'
            }
        }
    },
    grpName: {
        key : 'grp_name',
        default: ['/'],
        detail: {
            existOnly: {
                key: 'userSelect',
                value: 'grp_name'
            },
            hasChildrenGroup: {
                key: 'childrenGroup',
                value: '',
                all: '',
                compareKey: 'name',
                retVal: 'name',
                compareDataName: 'grpName'

            },
            array: {}
        }
    },
    childrenGroup: {
        key: 'children_group',
        detail: {
            existOnly: {
                key: 'childrenGroup',
                value: 'unSubmit'
            }
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
    emailFrom: {
        key: 'email_from'
    },
    emailTo: {
        key: 'email_to'
    },
    level: {
        default: ['高', '中', '低']
    },
    action: {
        key: 'net_action',
        default: ['允许', '拒绝']
    }
};