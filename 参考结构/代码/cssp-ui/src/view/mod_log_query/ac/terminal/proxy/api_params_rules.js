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
    proxyTool: {
        key: 'proxytool',
        default:[],
        detail: {
            selectTreeLeaf: {
                paramsKey: 'name'
            }
        }
    },
    freeze:{
        key: 'status',
        default: ['已识别', '已封堵', '已惩罚']
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
