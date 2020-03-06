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
    srcPort:{
        trigger: 'change',
        required: true,
        detail: {
            port:{}
        },
        validator: validator.valid
    },
    dstPort:{
        trigger: 'change',
        required: true,
        detail: {
            port:{}
        },
        validator: validator.valid
    },
    otherProtocol:{
        trigger: 'change',
        required: true,
        detail: {
            integer:{},
            notEmpty:{},
            callback:{
                callback (value) {
                    const MAX = 255;
                    let num = parseInt(value, 10);
                    if (num > MAX || num < 0) {
                        return {
                            valid: false,
                            message: '协议范围为0-255'
                        };
                    }
                    return true;
                }
            }
        },
        validator: validator.valid
    },
    rulesNumber: {
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