/**
 * 权限指令注册
 * v-auth:业务对象.行为="'authName, authName2'"（只支持传入一个对象）
 * 业务对象：用于联动业务模块的值，控制页面
 * 行为：hide(隐藏)、disabled(禁用)
 */

import utils from 'src/utils/utils_data';

export default (Vue) => {
    let authBehavior = ['hide', 'disabled'];
    
    Vue.directive('auth', {
        bind: (el, bindling, vnode) => {
            let currAuthArr = bindling.value.split(','), // 需要校验的权限
                authDataObj = utils.authData, // 所有权限数据
                authFlag = false, // 校验的权限是否匹配，且有权限
                businessObj = bindling.arg, // 想呈现到页面的行为对象
                businessContext = vnode.context, // 业务作用域   
                behavior = bindling.rawName.split('.')[1]; // 拿到绑定的对象

            currAuthArr.forEach((item) => {
                item = item.trim();
                if (authDataObj[item]) { //  && authDataObj[item].allow
                    authFlag = true;
                }
            });

            if (businessObj) { // 当需要动态传递值，通过作用域修改原对象
                businessContext[businessObj] = !authFlag;
            }

            if ((behavior || !businessObj) && !authFlag) { // 当没有配置业务对象（businessObj）默认配置disabled，配置了业务对象则必须传入行为才控制页面
                if (behavior === authBehavior[0]) { // 配置是否隐藏
                    el.style.display = 'none';
                } else { // 默认为disabled
                    el.setAttribute('disabled', true);
                    el.style.pointerEvents = 'none';
                }
            }

            return;
        }
    });

};



