/**
 * 统一化组件在高度这一块有缺陷，需要手动计算出最合适的高度
 * 高度的计算最好在 breforMounted进行计算
 */

const TOOLBAR_HEIGHT = 53;
const PANEL_HEIGHT = 1; // panel存在1px边框
const PAGINATION = 0;
export default {
    methods: {
        calcDynamicHeight () {
            let el = document.querySelector('.content__body');
            return el.offsetHeight - TOOLBAR_HEIGHT - PAGINATION - PANEL_HEIGHT;
        }
    }
};