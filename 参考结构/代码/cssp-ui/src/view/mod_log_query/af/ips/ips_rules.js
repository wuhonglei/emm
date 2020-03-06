/**
 * ips校验文件
 */

import { dstIp, srcIp } from 'src/view/mod_log_query/af/rules';
import validator from 'src/validation';

export default {
    attackIp: srcIp,
    attackedIp: dstIp,
    holeId: {
        trigger: 'change',
        detail: {
            stringLength: {
                utf8Bytes: true,
                max: 512,
                message: '长度应不超过512字节'
            },
            regexp: {
                regexp: /^[1-9]\d*$/,
                message: '漏洞ID必须是大于0的正整数。'
            }
        },
        validator: validator.valid
    }
};
