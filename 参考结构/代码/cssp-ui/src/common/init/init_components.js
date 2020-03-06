/**
 * @file 组件初始化脚本
 */

import svgIcon from 'src/common/components/svg.vue';

function initSVG (Vue) {

    // register globally
    Vue.component('svg-icon', svgIcon);

    let requireAll = function (requireContext) {
        return requireContext.keys().map(requireContext);
    };

    // let requireAll = requireContext => requireContext.keys().map(requireContext);
    let req = require.context('src/common/assets/svg/', false, /\.svg$/);
    requireAll(req);
}

export default function initComponents (Vue) {
    initSVG(Vue);
}