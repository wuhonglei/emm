/**
 * 邮件安全日志，表单校验
 */

import validator from 'src/validation';
import { dstIp, srcIp, userName } from 'src/view/mod_log_query/af/rules';

export default {
    srcIp,
    dstIp,
    userName,
    emailTo: {
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
    },
    emailFrom: {
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