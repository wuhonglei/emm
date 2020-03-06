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
    userName: {
        key: 'user_name',
        default: []
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
    control: {
        key: 'net_action',
        default: ['记录', '拒绝']
    },
    keywords: {
        key: 'content_ft'
    },
    mailType:{
        key: 'trace_t'
    },
    emailFrom:{
        key: 'email_from'
    },
    emailTo:{
        key: 'email_to'
    }
};
