/**
 * 日志设置表单校验，这个里面应为有动态请求后端参数
 * 所有与普通校验有点区别
 */

import validator from 'src/validation';

export default {
    dir: {
        trigger: 'change',
        required: true,
        detail: {
            notEmpty: {
                message: '路径不能为空'
            },
            stringLength: {
                mix: 1,
                max: 256,
                utf8Bytes: true,
                message: '路径最大长度为256个字符'
            }
        },
        validator: validator.valid
    },
    ip: {
        trigger: 'change',
        required: true,
        detail: {
            notEmpty: {
                message: 'IP不能为空'
            },
            ipRange: {
                message: '请填写正确格IP'
            }
        },
        validator: validator.valid
    },
    pwd: {
        trigger: 'change',
        required: true,
        detail: {
            notEmpty: {
                message: '密码不能为空'
            },
            stringLength: {
                mix: 1,
                max: 96,
                utf8Bytes: true,
                message: '密码最大长度为96个字符'
            }
        },
        validator: validator.valid
    },
    user: {
        trigger: 'change',
        required: true,
        detail: {
            notEmpty: {
                message: '用户名不能为空'
            },
            stringLength: {
                mix: 1,
                max: 96,
                utf8Bytes: true,
                message: '用户名最大长度为96个字符'
            }
        },
        validator: validator.valid
    }
};