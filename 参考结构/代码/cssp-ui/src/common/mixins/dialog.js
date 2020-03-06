/**
 * table mixin 文件
 */

export default {
    data () {
        return {
            dialogVisible: false,
            loading: false
        };
    },

    mounted () {
        if (!this.handleOpen || typeof this.handleOpen !== 'function') {
            throw new Error('dialog mixin must need handleOpen method!');
        }
        let vm = this;
        this.$on('open', function () {
            vm.handleOpen.apply(vm, arguments);
        });
        return;
    }
};