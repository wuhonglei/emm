/**
 * 网站访问日志，表单校验
 */

import { dstIp, srcIp, userName } from 'src/view/mod_log_query/af/rules';
import validator from 'src/validation';

export default {
    srcIp,
    dstIp,
    userName,
    url: {
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