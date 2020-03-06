/**
 * edr，表单校验
 */

import validator from 'src/validation';

let ipValidator = {
    trigger: 'change',
    detail: {
        ipRange: {}
    },
    validator: validator.valid
};

/* eslint-disable no-magic-numbers */
let validInt = num => parseInt(num, 10) === num;
let validIntStrict = num => /^\d+$/.test(num);
let validPort = port => validIntStrict(port) && port <= 65535 && port >= 1;
let validTime = day => validInt(day) && day <= 15 && day >= 0;
let biggerThan = (n2, n1) => n1 < n2;

export default {
    ipList: ipValidator,
    srcIp: ipValidator,
    blockIp: ipValidator, 
    fluxIp: ipValidator,
    blockPort: {
        trigger: 'change',
        detail: {
            callback: {
                callback (v) {
                    if (!v) {
                        return {
                            valid: true
                        };
                    }
                    const MSG = '请输入有效的端口，端口范围为1-65535，多个端口之间用英文逗号分隔，最大支持5个有效数字。';
                    if (v.indexOf('-') >= 0) {
                        return {
                            valid: false,
                            message: MSG
                        };
                    }
                    let splits = v.split(',');
                    const LEN = 5;
                    if (splits.length > LEN) {
                        return {
                            valid: false,
                            message: MSG
                        };
                    }
                    let valid = splits.every(item => {
                        return  validPort(item);
                    });
                    return {
                        valid,
                        message: MSG
                    };
                }
            }
        },
        validator: validator.valid
    },
    duration: {
        trigger: 'change',
        detail: {
            callback: {
                callback (v) {
                    if (!v) {
                        return {
                            valid: true
                        };
                    }
                    let splits = v.split(',').map(item => item.split('-'));
                    if (splits.length > 5) {
                        return {
                            valid: false,
                            message: '请输入有效的整数或整数范围，多个数字或数字范围用英文逗号分隔，最大支持5个有效数字。'
                        };
                    }
                    let valid = splits.every(item => {
                        let num0 = item[0] ? Number(item[0]) : false;
                        let num1 = item[1] ? Number(item[1]) : false;
                        if (item.length === 1) {
                            return  validTime(num0);
                        }
                        if (item.length === 2) {
                            return validTime(num0) && 
                                validTime(num1) &&
                                biggerThan(num1, num0);
                        }
                        return false;
                    });
                    return {
                        valid,
                        message: '请输入有效的整数或整数范围，多个数字或数字范围用英文逗号分隔，最大支持5个有效数字。'
                    };
                }
            }
        },
        validator: validator.valid
    },
    serviceName: {
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
    process: {
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