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
    prcnt:{
        trigger: 'change',
        required: true,
        detail: {
            integer:{},
            callback: {
                callback (v) {
                    let tmp = parseInt(v, 10);
                    let max = 1000;
                    if (tmp < 0 || tmp > max) {
                        return {
                            valid: false,
                            message: '共享终端数的范围为0-1000'
                        };
                    }
                }
            }
        },
        validator: validator.valid
    }
};