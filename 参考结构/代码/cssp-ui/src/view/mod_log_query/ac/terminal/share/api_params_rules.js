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
    control: {
        key: 'net_action',
        default: ['记录', '拒绝']
    },
    prcnt: {
        key: 'prcnt',
        default: ''
    },
    grpName: {
        key: 'grp_name',
        default: ['所有']
    },
    userName: {
        key: 'user_name',
        default: []
    }
};
