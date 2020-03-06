/**
 * 网站访问日志，表单校验
 */

import validator from 'src/validation';

export default {
    dstIp: {
        trigger: 'change',
        required: true,
        detail: {
            stringLength: {
                min: 0,
                max: 100
            }
        },
        validator: validator.valid
    },
    srcIp: {
        trigger: 'change',
        required: true,
        detail: {
            stringLength: {
                min: 0,
                max: 100
            }
        },
        validator: validator.valid
    }
};