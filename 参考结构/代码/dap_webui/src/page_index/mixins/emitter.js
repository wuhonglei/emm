/**
 * 广播mixin文件
 * 必须指定组件名称
 * 业务代码禁用此mixin
 */

function _broadcast (componentName, eventName, payload) {
    
    /* eslint-disable @sxf/sfchecklist/no-invalid-this */
    this.$children.forEach(child => {
        let name = child.$options.name;
        if (name === name) {
            child.$emit(eventName, payload);
        } else {
            _broadcast.call(child, componentName, eventName, payload);
        }
    });
}

export default {
    methods: {
        dispatch (componentName, eventName, payload) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.$emit(eventName, payload);
            }
        },
        broadcast (componentName, eventName, payload) {
            _broadcast.call(this, componentName, eventName, payload);
        }
    }
};
