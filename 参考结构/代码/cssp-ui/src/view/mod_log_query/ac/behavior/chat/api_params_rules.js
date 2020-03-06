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
    communicateTool: {
        key: 'app_name',
        default:[],
        detail: {
            selectTree: {}
        }
    },
    keywords: {
        key: 'content_ft'
    }
};
