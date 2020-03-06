/**
 * 报表设置
 */

import validator from 'src/validation/index';

export default {
    selectType: {
        trigger: 'change',
        detail: {
            notEmpty: {
                message: '至少选择一种报表类型'
            }
        },
        validator: validator.valid
    }
};
