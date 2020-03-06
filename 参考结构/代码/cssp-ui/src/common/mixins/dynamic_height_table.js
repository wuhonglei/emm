/**
 * 动态表格高度mixin文件
 */

export default {
    data () {
        return {
            dynamicHeight: 0
        };
    },

    mounted () {

        // 容器高度改变之后需要emit('layout') 给本组件 或者使用resize监听（不推荐）
        this.$on('layout', () => {
            this.$nextTick(() => {
                this.updateTableHeight();
            });
        });
        this.updateTableHeight();
    },

    methods: {
        updateTableHeight () {

            // 这个功能可以考虑提取成mixin
            if (this.$refs.dynamicHeightTable) {
                this.dynamicHeight = this.$refs.dynamicHeightTable.offsetHeight;
            }
        }
    }
};