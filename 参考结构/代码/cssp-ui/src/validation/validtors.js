/**
 * 表单校验规则定义文件
 */

import ipTool from '../utils/ip';
import { ip, ipRange, num, stringLength } from './foo';

export default {
    stringLength (v, rules) {
        let op = {};
        Object.assign(op, {
            message: '',
            min: 0,
            max: 999999,
            utf8Bytes: false
        }, rules);
        if (!v) {
            return { valid: true };
        }
        let valid = stringLength(v, op);
        return {
            valid,
            msg: op.message
        };
    },
    notEmpty (v, rules) {
        let op = {};
        Object.assign(op, {
            message: '该选项不能为空'
        }, rules);
        if (!String(v) || !String(v).trim()) {
            return { valid: false, msg: op.message };
        }
        return {
            valid: true
        };
    },
    noBlank (v, rules) {
        let op = {};
        Object.assign(op, {
            message: '密码不能包含空格'
        }, rules);
        if (v.indexOf(' ') > -1) {
            return {
                valid: false,
                msg: op.message
            };
        }
        return {
            valid: true
        };

    },

    /**
     * 正则校验
     *
     * @param {any} v 校验的值
     * @param {any} rules 默认规则
     * @returns {object} 校验结果
     */
    regexp (v, rules) {
        let op = {};
        let valid = false;
        Object.assign(op, {
            message: '存在不合法的字符'
        }, rules);
        if (!v) {
            return {
                valid: true
            };
        }
        if (op.regexp) {
            valid = op.regexp.test(v);
        }
        return {
            valid,
            message: op.message
        };
    },

    /**
     * 回调函数验证
     *
     * @param {any} v 校验的值
     * @param {any} rules 默认规则
     * @returns {object} 校验结果
     */
    callback (v, rules) {
        let rs;
        if (typeof rules.callback === 'function') {
            rs = rules.callback(v);
        }
        if (rs && rs.valid === false) {
            return {
                valid: false,
                msg: rs.message
            };
        }
        return {
            valid: true
        };
    },
    integer (v, rules) {
        let op = {};
        let valid = false;
        Object.assign(op, {
            message: '请填写整数'
        }, rules);
        if (!v) {
            return { valid: true };
        }
        valid = num(v);
        return {
            valid,
            message: op.message
        };

    },

    port (v, rules) {
        let op = {};
        let valid = false;
        Object.assign(op, {
            message: '请输入合法的端口'
        }, rules);

        if (!v) {
            return { valid: true };
        }

        valid = num(v, {
            min: 0,
            max: 65535,
            includBoundary: true
        });

        return {
            valid,
            message: op.message
        };
    },

    phone (v, rules) {
        let op = {};
        let valid = false;
        Object.assign(op, {
            message: '手机号格式不正确',
            country: 'CN'
        }, rules);
        if (!v) {
            return {
                valid: true
            };
        }
        switch (op.country.toUpperCase()) {
            case 'AE':

                // http://regexr.com/39tak
                valid = (/^(((\+|00)?971[\s\.-]?(\(0\)[\s\.-]?)?|0)(\(5(0|2|5|6)\)|5(0|2|5|6)|2|3|4|6|7|9)|60)([\s\.-]?[0-9]){7}$/).test(v);
                break;

            case 'BG':
                // eslint-disable-next-line
                valid = (/^(0|359|00)(((700|900)[0-9]{5}|((800)[0-9]{5}|(800)[0-9]{4}))|(87|88|89)([0-9]{7})|((2[0-9]{7})|(([3-9][0-9])(([0-9]{6})|([0-9]{5})))))$/).test(v);
                break;

            case 'BR':
                // eslint-disable-next-line
                valid = (/^(([\d]{4}[-.\s]{1}[\d]{2,3}[-.\s]{1}[\d]{2}[-.\s]{1}[\d]{2})|([\d]{4}[-.\s]{1}[\d]{3}[-.\s]{1}[\d]{4})|((\(?\+?[0-9]{2}\)?\s?)?(\(?\d{2}\)?\s?)?\d{4,5}[-.\s]?\d{4}))$/).test(v);
                break;

            case 'CN':
                // eslint-disable-next-line
                valid = (/^((00|\+)?(86(?:-| )))?((\d{11})|(\d{3}[- ]{1}\d{4}[- ]{1}\d{4})|((\d{2,4}[- ]){1}(\d{7,8}|(\d{3,4}[- ]{1}\d{4}))([- ]{1}\d{1,4})?))$/).test(v);
                break;

            case 'CZ':

                // http://regexr.com/39hhl
                valid = /^(((00)([- ]?)|\+)(420)([- ]?))?((\d{3})([- ]?)){2}(\d{3})$/.test(v);
                break;

            case 'DE':

                // http://regexr.com/39pkg
                // eslint-disable-next-line
                valid = (/^(((((((00|\+)49[ \-/]?)|0)[1-9][0-9]{1,4})[ \-/]?)|((((00|\+)49\()|\(0)[1-9][0-9]{1,4}\)[ \-/]?))[0-9]{1,7}([ \-/]?[0-9]{1,5})?)$/).test(v);
                break;

            case 'DK':

                // Mathing DK phone numbers with country code in 1 of 3 formats and an
                // 8 digit phone number not starting with a 0 or 1. Can have 1 space
                // between each character except inside the country code.
                // http://regex101.com/r/sS8fO4/1
                valid = (/^(\+45|0045|\(45\))?\s?[2-9](\s?\d){7}$/).test(v);
                break;

            case 'ES':

                // http://regex101.com/r/rB9mA9/1
                // Telephone numbers in Spain go like this:
                //     9: Landline phones and special prefixes.
                //     6, 7: Mobile phones.
                //     5: VoIP lines.
                //     8: Premium-rate services.
                // There are also special 5-digit and 3-digit numbers, but
                // maybe it would be overkill to include them all.
                valid = (/^(?:(?:(?:\+|00)34\D?))?(?:5|6|7|8|9)(?:\d\D?){8}$/).test(v);
                break;

            case 'FR':

                // http://regexr.com/39a2p
                valid = (/^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/).test(v);
                break;

            case 'GB':
                // eslint-disable-next-line
                // http://aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers#Match_GB_telephone_number_in_any_format
                // http://regexr.com/38uhv
                // eslint-disable-next-line
                valid = (/^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/).test(v);
                break;

            case 'IN':

                // http://stackoverflow.com/questions/18351553/regular-expression-validation-for-indian-phone-number-and-mobile-number
                // http://regex101.com/r/qL6eZ5/1
                // May begin with +91. Supports mobile and land line numbers
                valid = (/((\+?)((0[ -]+)*|(91 )*)(\d{12}|\d{10}))|\d{5}([- ]*)\d{6}/).test(v);
                break;

            case 'MA':

                // http://en.wikipedia.org/wiki/Telephone_numbers_in_Morocco
                // http://regexr.com/399n8
                // eslint-disable-next-line
                valid = (/^(?:(?:(?:\+|00)212[\s]?(?:[\s]?\(0\)[\s]?)?)|0){1}(?:5[\s.-]?[2-3]|6[\s.-]?[13-9]){1}[0-9]{1}(?:[\s.-]?\d{2}){3}$/).test(v);
                break;

            case 'NL':

                // http://en.wikipedia.org/wiki/Telephone_numbers_in_the_Netherlands
                // http://regexr.com/3aevr
                // eslint-disable-next-line
                valid = (/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9])((\s|\s?-\s?)?[0-9])((\s|\s?-\s?)?[0-9])\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]$/gm).test(v);
                break;

            case 'PK':
                valid = (/^0?3[0-9]{2}[0-9]{7}$/).test(v);
                break;

            case 'RO':
                valid = (/^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/g).test(v);
                break;

            case 'RU':
                valid = (/^((8|\+7|007)[\-\.\/ ]?)?([\(\/\.]?\d{3}[\)\/\.]?[\-\.\/ ]?)?[\d\-\.\/ ]{7,10}$/g).test(v);
                break;

            case 'SK':
                valid = /^(((00)([- ]?)|\+)(421)([- ]?))?((\d{3})([- ]?)){2}(\d{3})$/.test(v);
                break;

            case 'TH':

                // http://regex101.com/r/vM5mZ4/2
                valid = (/^0\(?([6|8-9]{2})*-([0-9]{3})*-([0-9]{4})$/).test(v);
                break;

            case 'VE':

                // http://regex101.com/r/eM2yY0/6
                valid = (/^0(?:2(?:12|4[0-9]|5[1-9]|6[0-9]|7[0-8]|8[1-35-8]|9[1-5]|3[45789])|4(?:1[246]|2[46]))\d{7}$/).test(v);
                break;

            case 'US':

                /* falls through */
            default:

                // Make sure US phone numbers have 10 digits
                // May start with 1, +1, or 1-; should discard
                // Area code may be delimited with (), & sections may be delimited with . or -
                // http://regexr.com/38mqi
                valid = false;
                break;
        }

        return {
            valid,
            message: op.message
        };
    },

    email (v, rules) {
        let op = {};
        let valid = false;
        // eslint-disable-next-line
        let emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        Object.assign(op, {
            message: '邮箱格式不合法'
        }, rules);
        if (!v) {

            // empty resolve
            return {
                valid: true
            };
        }
        valid = emailRegExp.test(v);
        return {
            valid,
            message: op.message
        };
    },


    password (v, rules) {
        let lower = /[a-z]+/;
        let upper = /[A-Z]+/;
        let number = /[0-9]+/;
        let special = /[`~@#%&<>"',;_\-\^\$\.\*\+\?\=\!\:\|\{\}\(\)\[\]\/\\]+/;
        let illegal = /[^a-zA-Z0-9~\~`@#%&<>"',;_\-\^\$\.\*\+\?\=\!\:\|\{\}\(\)\[\]\/\\]+/;
        let op = {};
        Object.assign(op, {
            new: false
        }, rules);
        if (!v) {

            // empty resolve
            return {
                valid: true
            };
        }
        if (v.indexOf(' ') > -1) {
            return {
                valid: false,
                message: '密码不能包含空格'
            };

        }
        if (illegal.test(v)) {
            return {
                valid: false,
                message: '新密码中存在非法字符'
            };
        }
        let kinds = 0;
        const KIND_LIMIT = 2;
        kinds += lower.test(v) ? 1 : 0;
        kinds += upper.test(v) ? 1 : 0;
        kinds += number.test(v) ? 1 : 0;
        kinds += special.test(v) ? 1 : 0;
        if (kinds < KIND_LIMIT) {
            return {
                valid: false,
                message: '密码至少包含大写字母、小写字母、数字和特殊字符中的两项，不允许有空格'
            };
        }
        return {
            valid: true,
            message: ''
        };
    },

    confirm_password (v, rules) {
        let pwdEl = document.querySelectorAll(`input[name="${rules.name}"]`);
        let pwd = pwdEl[0] ? pwdEl[0].value : '';
        let op = {};
        Object.assign(op, {
            message: '重复密码不正确'
        }, rules);
        return v === pwd ? {
            valid: true
        } : {
            valid: false,
            message: op.message
        };
    },

    ip (v, rules) {
        let op = {};
        let valid = true;
        Object.assign(op, {
            message: '请输入单个合法的IP'
        }, rules);
        if (!v) {
            return {
                valid: true
            };
        }
        valid = ip(v);
        return {
            valid,
            message: op.message
        };
    },

    ipRange (v, rules) {
        let op = {};
        Object.assign(op, {
            message: 'IP格式错误'
        }, rules);
        if (!v) {
            return {
                valid: true
            };
        }
        let v4Count = 0;
        let v6Count = 0;
        let ips = v.split(',');
        let errIps = ips.filter((ip) => {
            let v4v6 = ipRange(ip);
            return !v4v6;
        });

        return {
            valid: errIps.length === 0 && !(v4Count > 0 && v6Count > 0), // 错误ip数量不能大于0 并且ipv6 ipv4不能同时大于0
            message: errIps.length ? 'IP格式错误' : '不支持IPV4 IPV6混合查询'
        };
    },

    /**
     * 验证IP和IP范围
     * 192.168.1.1
     * 192.168.1.1-192.168.1.2
     *
     * @param {string} v 需要校验文字
     * @param {object} rules 配置规则
     * @returns {object} 返回校验结果
     */
    ipAndipRange (v, rules) {
        let op = {};
        let subnetList = ipTool.ipRange2Array(v);
        let valid = true;
        let idx = 0;
        Object.assign(op, {
            message: '子网错误'
        }, rules);
        if (!v) {
            return {
                valid: true
            };
        }
        subnetList.forEach((subnet, index) => {
            if (!ipTool.rawIpRange(subnet, {
                enableEqual: true
            }) && !ipTool.ip(subnet)) {
                valid = false;
                idx = index;
            }
        });

        return {
            valid,
            message: `第${idx + 1}个IP格式错误`
        };
    },

    mask (v, rules) {
        let op = {};
        let valid = true;
        Object.assign(op, {
            message: '请输入合法的掩码'
        }, rules);
        if (!v) {
            return {
                valid: true
            };
        }
        valid = ipTool.mask(v);
        return {
            valid,
            message: op.message
        };
    },

    // IP、子网
    ipAndSubnetRange (v, rules) {
        let op = {};
        let subnetList = ipTool.ipRange2Array(v);
        let errorSubnet = '';
        let errorIndex = 0;
        let valid = true;
        Object.assign(op, {
            message: '子网错误'
        }, rules);
        if (!v) {
            return {
                valid: true
            };
        }
        subnetList.forEach((subnet, index) => {
            if (subnet.indexOf('/') > -1) {
                if (!ipTool.prefixIp(subnet)) {

                    // 暂时去掉对255.255.255.0 这种掩码的支持
                    errorSubnet = subnet;
                    errorIndex = index + 1;
                    valid = false;
                }
            } else if (subnet.indexOf('-') > -1) {
                errorSubnet = subnet;
                errorIndex = index + 1;
                valid = false;
            } else {

                if (!ipTool.ip(subnet)) {
                    errorSubnet = subnet;
                    errorIndex = index + 1;
                    valid = false;
                }
            }
        });

        return {
            valid,
            message: `第${errorIndex}个IP（${errorSubnet}）格式错误`
        };

    },

    // 子网
    cpSubnetRangeOnly (v, rules) {
        let op = {};
        let subnetList = ipTool.ipRange2Array(v);
        let errorSubnet = '';
        let errorIndex = 0;
        let valid = true;
        Object.assign(op, {
            message: '子网错误'
        }, rules);
        if (!v) {
            return {
                valid: true
            };
        }
        subnetList.forEach((subnet, index) => {
            if (!ipTool.prefixIp(subnet)) {

                // 暂时去掉对255.255.255.0 这种掩码的支持
                errorSubnet = subnet;
                errorIndex = index + 1;
                valid = false;
            } else {
                valid = true;
            }
        });

        return {
            valid,
            message: `第${errorIndex}个子网（${errorSubnet}）错误`
        };
    },

    // IP、IP段、子网
    cpSubnetRange (v, rules) {
        let op = {};
        let subnetList = ipTool.ipRange2Array(v);
        let errorSubnet = '';
        let errorIndex = 0;
        let valid = true;
        Object.assign(op, {
            message: '子网错误'
        }, rules);
        if (!v) {
            return {
                valid: true
            };
        }
        subnetList.forEach((subnet, index) => {
            if (subnet.indexOf('/') > -1) {
                if (!ipTool.prefixIp(subnet)) {

                    // 暂时去掉对255.255.255.0 这种掩码的支持
                    errorSubnet = subnet;
                    errorIndex = index + 1;
                    valid = false;
                }
            } else if (subnet.indexOf('-') > -1) {
                if (!ipTool.rawIpRange(subnet, {
                    enableEqual: true
                })) {
                    errorSubnet = subnet;
                    errorIndex = index + 1;
                    valid = false;
                }
            } else {

                // 此代码片段为新加的验证IP的代码
                if (!ipTool.ip(subnet)) {
                    errorSubnet = subnet;
                    errorIndex = index + 1;
                    valid = false;
                }
            }
        });

        return {
            valid,
            message: `第${errorIndex}个子网（${errorSubnet}）错误`
        };
    },

    vlanRange (v, rules) {
        let op = {};
        let valid = true;
        const MIN = 1;
        const LEN = 2;

        var vlans = v.split(','),
            value,
            rang;

        Object.assign(op, {
            message: 'VLAN的值应为1-4094，格式如：100,105-110或者直接填写all表示全部范围'
        }, rules);

        //放开支持输入all
        if (/^all$/i.test(v.trim())) {
            return {
                valid,
                message: op.message
            };
        }
        for (let i = 0; i < vlans.length; i++) {
            value = vlans[i].replace(/(^\s*)|(\s*$)/g, ''); //清除两边的空格
            if (!value) {
                return {
                    valid: false,
                    message: op.message
                };
            }

            if (value.indexOf('-') > -1) {
                rang = value.split('-');

                if (rang.length !== LEN || !rang[0] || !rang[1]) {
                    return {
                        valid: false,
                        message: op.message
                    };
                }
                rang[0] = rang[0].replace(/(^\s*)|(\s*$)/g, ''); //清除两边的空格
                rang[1] = rang[1].replace(/(^\s*)|(\s*$)/g, ''); //清除两边的空格

                if (!this.vlan(rang[0]) || !this.vlan(rang[1])) {
                    return {
                        valid: false,
                        message: op.message
                    };
                } else if (Number(rang[1]) < MIN || Number(rang[0]) < MIN) {
                    return {
                        valid: false,
                        message: op.message
                    };
                }

                if (Number(rang[1]) - Number(rang[0]) < 0) {
                    return {
                        valid: false,
                        message: 'VLAN范围的右值应大于或等于左值，格式如：100,105-110或者直接填写all表示全部范围'
                    };

                }
            } else if (!this.vlan(value)) {
                return {
                    valid: false,
                    message: op.message
                };
            } else if (Number(value) < MIN) {
                return {
                    valid: false,
                    message: op.message
                };

            } else if (Number.isNaN(Number(value))) {
                if (vlans.length > 1) {
                    return {
                        valid: false,
                        message: op.message
                    };
                }
                if (!/^all$/i.test(value)) {
                    return {
                        valid: false,
                        message: op.message
                    };
                }
            }
        }

        return {
            valid,
            message: op.message
        };
    },

    vlan: function (v) {
        const REG = /^(?:-?(?:0|[1-9][0-9]*))$/;
        const MIN = 1;
        const MAX = 4094;

        if (!REG.test(v)) {
            return false;
        }

        v = Number(v);

        if (v < MIN || v > MAX) {
            return false;
        }
        
        return true;
    },

    demo (v, rules) {
        let op = {};
        let valid = false;
        Object.assign(op, {
            message: 'message'
        }, rules);
        if (!v) {

            // empty resolve
            return {
                valid: true
            };
        }

        // deal with ...
        return {
            valid,
            message: op.message
        };
    }
};
