/**
 * svg组件使用说明
 * 
 * 1. 准备一张去色svg（如果不是单色就不能随文字改变颜色，但是不影响使用），如果要去色
 * 可以去iconfront上面点击上传，上传完了之后有个去色上传。
 * 2. 把svg文件放在src/assets/svg目录
 * 3. 使用的 <svg-icon icon-class="文件名称" />
 */

import Vue from 'vue';
import SvgIcon from './svg.vue';

// register globally
Vue.component('svg-icon', SvgIcon);

let requireAll = function (requireContext) {
    return requireContext.keys().map(requireContext);
};

// let requireAll = requireContext => requireContext.keys().map(requireContext);
let req = require.context('../../assets/svg/', false, /\.svg$/);
requireAll(req);
