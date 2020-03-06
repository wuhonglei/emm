
/**
 * 通用 tips
 */

import Bus from 'src/utils/bus';
import { MOTUAL_TIPS } from 'src/utils/const';

export default {
    methods: {
        cancelConfirm (fn, tips) { // 取消编辑确认
            this.$confirm(tips || '确定要取消编辑当前表单吗？', '取消编辑', actionName => {
                fn(actionName === 'submit');
            });
        },

        // 场景：1.对象形式传递，2.具体的参数传递，3.比2少一个参数，但有回调函数
        delConfirm (data) { // 删除确认框
            if (data.length < 1) {
                this.warnTips(MOTUAL_TIPS.chooseLeastOne);
                return false;
            }
            let confirmParams = arguments[1],
                confirmFn = confirmParams.callback, // 回调函数
                callback = (actionName) => { // 自行写入fn，增加一层封装
                    confirmFn(actionName === 'submit');
                };

            if (typeof confirmParams === 'object') { // 对象形式传参
                confirmParams.icon = 'warning';
                this.$confirm({
                    ...confirmParams,
                    callback
                }); 
            } else {
                
                // 保存最后一个，然后重写调用
                let showMsg = arguments[1] || '',
                    title = '';
                confirmFn = arguments[3];
                if (typeof arguments[2] === 'string') { // 第三个参数可能是回调函数
                    title = arguments[2];
                } else {
                    confirmFn = arguments[2];
                }
                this.$confirm(showMsg, title, callback); // 自行写入fn，增加一层封装
            }
        },
        warnTips (msg) { // 告警提示（带自动消失）
            this.$warn(msg, {
                autoHide: true
            });
        },
        editTips (data, tips) { // 编辑提示（含不支持批量编辑提示）
            if (data.length > 1) {
                this.warnTips(`${tips}不支持批量编辑`);
                return false;
            } else if (data.length < 1) {
                this.warnTips(MOTUAL_TIPS.chooseLeastOne);
                return false;
            }
            return true;
        },
        delTips (moduleName) { // 删除成功提示
            this.$ok(`删除${ moduleName }成功`);
        },
        onlyChooseOne (data) { // 只能选择一个（场景：所选模板新增）
            if (data.length < 1) {
                this.warnTips(MOTUAL_TIPS.chooseLeastOne);
                return false;
            } else if (data.length > 1) {
                this.warnTips(MOTUAL_TIPS.justPickOne);
                return false;
            }
            return true;
        },
        addModuleTips (moduleName, isBatch) { // 新增/批量新增成功提示
            if (isBatch) {
                this.$ok(`批量新增${ moduleName }成功`);
            } else {
                this.$ok(`新增${ moduleName }成功`);
            }
        },
        editModuleTips (moduleName, isBatch) { // 编辑模块成功的提示, isBatch：是否批量
            moduleName = moduleName || '';
            if (isBatch) {
                this.$ok(`${ moduleName }信息批量修改成功，${ moduleName }信息修改成功`);
            } else {
                this.$ok(`${ moduleName }信息修改成功`);    
            }
        },
        batchOperateTips (data) { // 批量编辑提示
            if (data && data.length < 1) {
                this.warnTips(MOTUAL_TIPS.chooseLeastOne);
                return false;                
            }
            return true;
        },
        formValidTips (tips) { // 表单校验提示
            let errTipsArr = tips.split('<br />');
            let errTips = errTipsArr[0].substr(errTipsArr[0].indexOf('：') + 1);
            this.warnTips(errTips);
        },
        maskTips () { 
            Bus.businessContext && Bus.businessContext.$unmask();
            Bus.businessContext = this;
            Bus.businessContext.$mask();
        },
        unmaskTips () {
            Bus.businessContext.$unmask();
        }
    }
};