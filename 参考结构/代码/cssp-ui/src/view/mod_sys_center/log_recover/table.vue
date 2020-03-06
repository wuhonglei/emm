<template>
    <div class="recover-table-wrapper">
        <div class="table">
            <el-table
                :data="tableData"
                height="100%"
                style="height: 100%; width: 100%">
                <el-table-column
                    label="序号"
                    width="50px">
                    <template slot-scope="scope">
                        <span>{{ computeIndex(scope.$index) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="恢复文件"
                    show-overflow-tooltip
                    prop="recover_file" />
                <el-table-column
                    label="文件大小"
                    prop="file_size" />
                <el-table-column
                    label="开始时间"
                    prop="created_time" />
                <el-table-column
                    label="状态"
                    width="80px"
                    prop="status">
                    <template slot-scope="scope">  
                        <status-bar :status="scope.row" 
                                    :desp="true" />   
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                :current-page="pagination.page"
                :total="pagination.total"
                :page-size="pagination.pageSize"
                :page-sizes="pagination.pageSizes"
                layout="sizes, prev, pager, next"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange" />
        </div>
    </div>
</template>

<script>

/**
 * 日志恢复表格组件
 */

import Bus, { BUS_EVENT } from 'src/utils/bus';
import table from 'src/common/mixins/table';
import { loadRecoverData } from 'src/common/api/manage';
import statusBar from 'src/common/components/status';
export default {
    components: {
        statusBar
    },
    mixins: [table],

    data () {
        return {
            tableData: [],
            loading: false
        };
    },

    mounted () {
        this.loadData();
        Bus.$on(BUS_EVENT.LOAD_RECOVER_TABLE_DATA, () => {
            this.loadData();
        });
        this.$on('load-data', () => {
            this.tableData = [];
            this.loadData();
        });
    },

    beforeDestroy () {
        Bus.$off(BUS_EVENT.LOAD_RECOVER_TABLE_DATA);
    },

    methods: {
        resolvedSubmitParams () {
            return {
                per_page: this.pagination.pageSize,
                page: this.pagination.page
            };
        },

        loadData () {
            let params = this.resolvedSubmitParams();
            this.loading = true;
            loadRecoverData(params)
                .then((res) => {
                    this.tableData = res.data && res.data.data || [];
                    this.pagination.total = res.data && res.data.total || 0;
                })
                .catch((err) => {
                    this.$error(err, '获取备份记录失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
    
};
</script>

<style lang="postcss">
.recover-table-wrapper {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    &>.table {
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        height: calc(100%-54px);
    }
    & .pagination {
        position: absolute;
        height: 54px;
        width: 100%;
        border: 1px solid #ddd;
        border-top: 0;
        bottom: 0;
    }
    & .status-tip{
        position: absolute;
        left: 38px;
        top:8px;
    }
}
</style>
