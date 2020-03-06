/**
 * af 日志模块通用校验器文件
 */

import validtor from 'src/validation/index';

export let dstIp = {
    trigger: 'change',
    required: true,
    detail: {
        ipRange: {}
    },
    validator: validtor.valid
};

export let srcIp = {
    trigger: 'change',
    required: true,
    detail: {
        ipRange: {}
    },
    validator: validtor.valid
};

export let userName = {
    trigger: 'change',
    required: true,
    detail: {
        stringLength: {
            max: 512,
            utf8Bytes: true,
            message: '长度应小于512个字符'
        }
    },
    validator: validtor.valid
};