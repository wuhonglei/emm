/**
 * 采集器支持列表
 */

import validator from 'src/validation/index';

export default {
    name: {
        trigger: 'change',
        detail: {
            notEmpty: {
                message: '不能为空'
            },
            stringLength: {
                min: 1,
                max: 75,
                utf8Bytes: true,
                message: '长度为1~75个字符'
            },
            regexp: {
                regexp: /^[0-9a-zA-Z_\-]*$/,
                message:　'名称只能包括数字，字母，下划线，"-"'
            }
            
        },
        validator: validator.valid

    },

    system: {
        trigger: 'change',
        detail: {
            stringLength: {
                min: 4,
                max: 96,
                utf8Bytes: true,
                message: '长度为4~96个字符'
            },
            regexp: {
                regexp: /^[0-9a-zA-Z_\-]*$/,
                message:　'只能包括数字，字母，下划线，"-"'
            }
            
        },
        validator: validator.valid
    },

    product: {
        trigger: 'change',
        detail: {
            stringLength: {
                min: 0,
                max: 96,
                utf8Bytes: true,
                message: '长度为0~96个字符'
            }
        },
        validator: validator.valid
    },

    firm: {
        trigger: 'change',
        detail: {
            stringLength: {
                min: 0,
                max: 96,
                utf8Bytes: true,
                message: '长度为0~96个字符'
            }
        },
        validator: validator.valid
    },

    _describe: {
        trigger: 'change',
        detail: {
            stringLength: {
                min: 0,
                max: 96,
                utf8Bytes: true,
                message: '长度为0~96个字符'
            }
        },
        validator: validator.valid
    }

};
