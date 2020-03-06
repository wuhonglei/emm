/**
 * 操作日志，表单验证
 */

import validator from 'src/validation';
export default {
    depict: {
        trigger: 'change',
        required: true,
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