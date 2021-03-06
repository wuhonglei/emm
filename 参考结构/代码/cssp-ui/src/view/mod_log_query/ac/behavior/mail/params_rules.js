/**
 * 邮件收发日志，表单校验
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
                max: 512,
                utf8Bytes: true,
                message: '长度最长为512个字符'
            }
        },
        validator: validator.valid
    },
    emailFrom: {
        trigger: 'change',
        detail: {
            stringLength: {
                utf8Bytes: true,
                max: 512,
                message: '长度应不超过512字节'
            }
        },
        validator: validator.valid
    },
    emailTo: {
        trigger: 'change',
        detail: {
            stringLength: {
                utf8Bytes: true,
                max: 512,
                message: '长度应不超过512字节'
            }
        },
        validator: validator.valid
    }
};