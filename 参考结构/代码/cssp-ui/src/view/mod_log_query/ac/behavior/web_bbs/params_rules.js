/**
 * 网站访问日志，表单校验
 */

import validator from 'src/validation';

export default {
    srcIp: {
        trigger: 'change',
        required: true,
        detail: {
            ipRange: {}
        },
        validator: validator.valid
    },
    dstIp: {
        trigger: 'change',
        required: true,
        detail: {
            ip: {}
        },
        validator: validator.valid
    },
    keywords: {
        trigger: 'change',
        required: true,
        detail: {
            stringLength: {
                max: 100,
                utf8Bytes: true,
                message: '长度最长为100个字符'
            }
        },
        validator: validator.valid
    }
};