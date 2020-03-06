/**
 * 资产管理校验文件
 */

import validator from 'src/validation/index';

export default {
    name: {
        trigger: 'change',
        detail: {
            notEmpty: {
                message: '该输入项不允许为空'
            },
            stringLength: {
                min: 1,
                max: 75,
                utf8Bytes: true,
                message: '长度为1~75个字符（25位中文字符）'
            },
            regexp: {
                regexp: /^[a-zA-Z0-9\u4e00-\u9fa5_\-（）\s]+$/,
                message:　'只能含有字母、数字、中文、空格、“_”、“-”、“（”、“）”'
            }
            
        },
        validator: validator.valid

    },

    pluginName: {
        trigger: 'change',
        detail: {
            notEmpty: {
                message: '该输入项不允许为空'
            }
        },
        validator: validator.valid

    },

    group: {
        trigger: 'change',
        detail: {
            notEmpty: {
                message: '该输入项不允许为空'
            }
        },
        validator: validator.valid

    },

    degree: {
        trigger: 'change',
        detail: {
            notEmpty: {
                message: '该输入项不允许为空'
            }
        },
        validator: validator.valid

    },
    
    username: {
        trigger: 'change',
        detail: {
            notEmpty: {
                message: '该输入项不允许为空'
            },
            stringLength: {
                min: 1,
                max: 96,
                utf8Bytes: true,
                message: '用户名为1-96个字符'
            },
            regexp: {
                regexp: /^[0-9a-zA-Z\/\\_]*$/,
                message: '用户名只能包括数字，字母，正反斜线，下划线'
            }
        },
        validator: validator.valid

    },

    password: {
        trigger: 'change',
        detail: {
            notEmpty: {
                message: '该输入项不允许为空'
            },
            stringLength: {
                max: 32,
                utf8Bytes: true,
                message: '密码长度为1~32位'
            }
        },
        validator: validator.valid

    },

    ip: {
        trigger: 'change',
        disable: true,
        detail: {
            notEmpty: {
                message: '该输入项不允许为空'
            },
            ip: {
                message: '请输入有效的IP'
            }
        },
        validator: validator.valid
    },

    dcEth: {
        trigger: 'change',
        detail: {
            notEmpty: {
                message: '该输入项不允许为空'
            }
        },
        validator: validator.valid
    },

    comment: {
        trigger: 'change',
        detail: {
            stringLength: {
                max: 96,
                utf8Bytes: true,
                message: '长度不超过96个字符（32位中文字符）'
            }
        },
        validator: validator.valid
    }
};
