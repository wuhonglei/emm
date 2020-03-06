/**
 * 日志设置表单校验，这个里面应为有动态请求后端参数
 * 所有与普通校验有点区别
 */

import validator from 'src/validation';
import validStore from 'src/utils/valid_store';

export default {
    percent: {
        trigger: 'change',
        required: true,
        detail: {
            integer: {},
            callback: {
                callback (v) {
                    let min = validStore.get('minRatio') || 0;
                    let max = validStore.get('maxRatio') || 1;
                    let value = Number(v);
                    if (value < min || value > max) {
                        return {
                            valid: false,
                            message: `请输入${min}到${max}之间的数字`
                        };
                    }
                    return true;
                }
            }
        },
        validator: validator.valid
    },
    outdays: {
        trigger: 'change',
        required: true,
        detail: {
            integer: {},
            callback: {
                callback (v) {
                    let min = validStore.get('minDay') || 0;
                    let max = validStore.get('maxDay') || 1;
                    let value = Number(v);
                    if (value < min || value > max) {
                        return {
                            valid: false,
                            message: `请输入${min}到${max}之间的数字`
                        };
                    }
                    return true;
                }
            }
        },
        validator: validator.valid
    },
    logQueryLimit: {
        trigger: 'change',
        required: true,
        detail: {
            integer: {},
            callback: {
                callback (v) {
                    let min = 1;
                    let max = validStore.get('maxExport') || 1;
                    let value = Number(v);
                    if (value < min || value > max) {
                        return {
                            valid: false,
                            message: `请输入${min}到${max}之间的数字`
                        };
                    }
                    return true;
                }
            }
        },
        validator: validator.valid
    },
    validStore
};