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
    }
};