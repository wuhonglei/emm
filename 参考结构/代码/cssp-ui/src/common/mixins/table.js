/**
 * table mixin 文件
 */

// eslint-disable-next-line no-magic-numbers
const PAGE_SIZES = [20, 50, 100]; // 分页数量列表

export default {
    data () {
        return {
            pagination: { // 用于分页的参数
                pageSize: PAGE_SIZES[0],
                pageSizes: PAGE_SIZES,
                page: 1,
                total: 100
            }
        };
    },

    computed: {
        maxPageNum: {
            get () {
                return Math.floor((this.pagination.total - 1) / this.pagination.pageSize) + 1;
            },
            set (n) {
                this.pagination.total = this.pagination.pageSize * n;
            }
        }
    },

    methods: {

        //  计算表格序列
        computeIndex (index) {
            return (this.pagination.page - 1) * this.pagination.pageSize + index + 1;
        },

        //  处理翻页
        handleCurrentChange (v) {
            this.pagination.page = v; // 也可以在绑定的时候使用.sync（不推荐）
            this.$emit('load-data');
        },

        handleSizeChange (size) {
            this.pagination.pageSize = size;
            if (this.pagination.page === 1) {
                this.$emit('load-data');
            } else {
                this.pagination.page = 1;
            }
        }
    }
};