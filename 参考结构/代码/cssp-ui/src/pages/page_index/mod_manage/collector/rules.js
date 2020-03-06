/**
 * 采集器模块通用校验器文件
 */

import validtor from 'src/validation/index';

export let name = {
    trigger: 'change',
    detail: {
        notEmpty: {
            message: '不能为空'
        },
        stringLength: {
            min: 1,
            max: 75,
            utf8Bytes: true,
            message: '长度为1~75位'
        },
        regexp: {
            regexp: /^[0-9a-zA-Z_\-]*$/,
            message:　'名称只能包括数字，字母，下划线，"-"'
        }
        
    },
    validator: validtor.valid
};
export let system = {
    trigger: 'change',
    detail: {
        stringLength: {
            min: 4,
            max: 96,
            utf8Bytes: true,
            message: '长度为4~96位'
        },
        regexp: {
            regexp: /^[0-9a-zA-Z_\-]*$/,
            message:　'只能包括数字，字母，下划线，"-"'
        }
        
    },
    validator: validtor.valid
};