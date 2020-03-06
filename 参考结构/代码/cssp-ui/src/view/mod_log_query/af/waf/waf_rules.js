/**
 * waf校验文件
 */

import { dstIp, srcIp } from 'src/view/mod_log_query/af/rules';
import validator from 'src/validation';

export default {
    dstIp,
    srcIp,
    sid: {
        trigger: 'change',
        detail: {
            stringLength: {
                utf8Bytes: true,
                max: 512,
                message: '长度应不超过512字节'
            },
            callback: {
                callback (v) {
                    if (!v) {
                        return {
                            valid: true
                        };
                    }
                    let splits = v.split(',');
                    const LEN = 10;
                    if (splits.length > LEN) {
                        return {
                            valid: false,
                            message: '规则ID必须是合法的规则ID格式，最大支持10个有规则ID。'
                        };
                    }
                    let valid = splits.every(item => {
                        if (!item) {
                            return false;
                        }
                        let number = Number(item);
                        return !isNaN(number) && number === parseInt(number, 10) && number.toString() === item;
                    });
                    return {
                        valid,
                        message: '规则ID必须是合法的规则ID格式，最大支持10个有规则ID。'
                    };
                }
            }
        },
        validator: validator.valid
    },
    status: {
        trigger: 'change',
        detail: {
            stringLength: {
                utf8Bytes: true,
                max: 512,
                message: '长度应不超过512字节'
            },
            callback: {
                callback (v) {
                    if (!v) {
                        return {
                            valid: true
                        };
                    }
                    let splits = v.split(',');
                    const LEN = 10;
                    if (splits.length > LEN) {
                        return {
                            valid: false,
                            message: '状态码必须是合法的格式，最大支持10个状态码。'
                        };
                    }
                    let valid = splits.every(item => {
                        if (!item) {
                            return false;
                        }
                        let number = Number(item);
                        return !isNaN(number) && number === parseInt(number, 10) && number.toString() === item;
                    });
                    return {
                        valid,
                        message: '状态码必须是合法的格式，最大支持10个状态码。'
                    };
                }
            }
        },
        validator: validator.valid
    },
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
