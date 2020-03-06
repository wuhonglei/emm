/**
 * 表单校验配置入口文件
 */

import validtors from './validtors';

export default {
    valid (rules, value, cb) {
        let v = rules.trim ? value.trim() : value;
        let rs = {
            valid: true,
            msg: ''
        };
        if (rules && rules.detail) {
            Object.keys(rules.detail).every((name) => {
                if (validtors &&
                    Object.prototype.hasOwnProperty.call(validtors, name)) {
                    rs = validtors[name](v, rules.detail[name], rules);
                    if (!rs.valid) {
                        return false;
                    }
                }
                return true;
            });
        }
        if (typeof cb === 'function') {
            if (!rs.valid) {
                cb(new Error(rs.msg || rs.message || 'input error'));
                return false;
            }
            cb();
        }
        return true;
    }
};
