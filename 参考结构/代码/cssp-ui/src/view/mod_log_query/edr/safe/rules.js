/**
 * api参数转换
 */

export let fluxRules = {
    uuid: {},
    type: {},
    fluxIp: {
        key: 'ip_list',
        detail: {
            splitArray: {}
        }
    },
    serviceName: {
        key: 'service_name'
    },
    providerStr: {
        key: 'provider_str'
    },
    provider: {
        default: []
    },
    visitorStr: {
        key: 'visitor_str'
    },
    visitor: {
        default: []
    },
    netAction: {
        key: 'net_action',
        detail: {
            array: 0
        }
    },
    process: {
        key: 'content_ft'
    }
};

export let otherRules = {
    uuid: {},
    type: {},
    hostName: {
        key: 'host_name',
        default: [],
        detail: {
            array: 0
        }
    },
    ipList: {
        key: 'src_ip',
        detail: {
            splitArray: {}
        }
    }
};