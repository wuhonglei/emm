/**
 * 处理日志, 根据下拉框的value值匹配出下拉框的label值
 */

import LOGNAME from 'src/utils/log_const';
import lodashGet from 'lodash/get';

export default {
    methods: {

        // selectOptions 为下拉框的options 格式为[{label: '', value: ''}]
        // data 为下拉框选中的value 值
        handleSelect (selectOptions, data) {
            let resData = selectOptions || [];
            for (let i = 0; i < resData.length; i++) {
                if (resData[i].value === data) { // 当前选中的value 匹配成功， 则返回下拉框对应的label值
                    return resData[i].label;
                }
            }
        },

        // 处理日志数据回显问题
        handleDataEcho (parentObj = '', key = '') {
            if (key.indexOf('|') > -1) {
                let keyArr = key.split('|'),
                    nameArr = [];
                for (let i = 0; i < keyArr.length; i++) {
                    nameArr.push(lodashGet(LOGNAME, parentObj + '.' + keyArr[i], ''));
                }
                return nameArr.join('|');
            }
            return lodashGet(LOGNAME, parentObj + '.' + key, '');
        }
    }
};