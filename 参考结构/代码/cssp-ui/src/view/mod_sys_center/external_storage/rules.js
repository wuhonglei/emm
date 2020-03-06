/**
 * @file 外置存储表单验证rules
 */

import validator from 'src/validation';

export default {
    ip: {
        trigger: 'change',
        required: true,
        detail: {
            notEmpty: {
                message: _('IP不能为空')
            },
            ip: {
                message: _('请填写正确格式的IP')
            }
        },
        validator: validator.valid
    },
    path: {
        trigger: 'change',
        required: true,
        detail: {
            notEmpty: {
                message: _('路径不能为空')
            },
            regexp: {
                regexp: /^[^\*\?\"<>\|]*$/,
                message: _('路径不能包含非法字符：*?"<>|')
            }
        },
        validator: validator.valid
    }
};