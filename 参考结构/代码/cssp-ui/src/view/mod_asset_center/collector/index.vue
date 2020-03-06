<template>
    <div class="collector-settings-wrapper content-page">
        <toolbar>
            <toolbar-button
                text="刷新"
                icon="refresh"
                @click.native="loadData" />
            <toolbar-button
                text="新增"
                icon="add"
                @click.native="addCollector" />
            <toolbar-button
                text="删除"
                icon="delete"
                :disabled="disableDelete"
                @click.native="preDeleteCollector()" />
        </toolbar>
        <div class="table">
            <el-table
                v-loading="loading"
                :data="tableData"
                style="width:100%; hright:100%;"
                height="100%"
                width="100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" 
                                 :selectable="disableSelect" />
                <el-table-column
                    label="序号"
                    width="50">
                    <template slot-scope="scope">
                        <span>{{ computeIndex(scope.$index) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="类型"
                    prop="name"
                    width="200"
                    show-overflow-tooltip />
                <el-table-column
                    label="厂商"
                    width="150"
                    show-overflow-tooltip
                    prop="firm" />
                <el-table-column
                    label="产品"
                    width="150"
                    prop="product"
                    show-overflow-tooltip />
                <el-table-column
                    label="描述"
                    prop="_describe"
                    show-overflow-tooltip />
                <el-table-column
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0);"
                           :disabled="scope.row.buildin"
                           @click="updataCollector(scope.row)">
                            编辑
                        </a>
                        <a href="javascript:void(0);"
                           class="opt-delete"
                           :disabled="scope.row.buildin || scope.row.refer_count !== 0"
                           @click="preDeleteCollector(scope.row)">
                            删除
                        </a>
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
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange" />
        </div>

        <dialog-collector
            ref="dialogCollector"
            @load-table-data="loadData" />
    </div>
</template>

<script>

/**
 * 采集器设置
 */

import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import table from 'src/common/mixins/table';
import DialogCollector from './dialog/collector';
import { 
    getAllPlugin,
    deleteCollectors
} from 'src/common/api/asset_center';

export default {
    components: {
        toolbar,
        toolbarButton,
        DialogCollector
    },

    mixins: [table], 
    data () {
        return {
            tableData: [],
            selectTableData: [],
            loading: false
        };
    },
    computed: {
        disableDelete () {
            return !this.selectTableData.length;
        },

        //根据表格中的checkbox是否全部禁用，来判断表头checkbox的禁用状态
        disableHeader () {
            if (this.tableData && this.tableData.length > 0) {
                return this.tableData.every(item => {
                    return (item.buildin || item.refer_count !== 0);
                });
            }
            return false;
        }
    },
    mounted () {
        this.loadData();
        this.$on('load-data', () => {
            this.tableData = [];
            this.loadData();
        });
    },
    methods: {

        //内置采集器不可勾选
        disableSelect (row) {
            if (row.buildin || row.refer_count !== 0) {
                return false;
            }
            return true;
        },

        // 列表查询参数
        resolveLoadParams () {
            return {
                page: this.pagination.page,
                num_per_page: this.pagination.pageSize
            };
        },

        // 获取删除参数ids
        resolveDeleteParams (row) {
            if (row && row.id) {
                return {
                    ids: [row.id]
                };
            }
            return {
                ids: this.selectTableData.map((item) => item.id)
            };
        },

        // 删除前弹框提示
        preDeleteCollector (row) {
            if (row && (row.buildin || row.refer_count !== 0)) {
                return;
            }

            let count;
            if (row && row.id) {
                count = 1;
            } else {
                count = this.selectTableData.length;
            }
            this.$confirm('删除采集器类型后，将不能添加此类型采集器', `确定要删除这${count}个采集器吗？`, {
                type: 'warning'
            })
                .then(() => {
                    this.deleteCollector(row);
                })
                .catch(() => {});
        },

        // 加载数据
        loadData () {
            this.loading = true;
            let params = this.resolveLoadParams();
            getAllPlugin(params)
                .then((res) => {
                    this.tableData = res.data.data || [];
                    this.pagination.total = res.data.total || 0;
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                    this.$error((err.data && err.data.mesg) || '采集器数据获取失败');
                });
        },

        // 添加采集器弹框
        addCollector () {
            if (this.$refs && this.$refs.dialogCollector) {
                this.$refs.dialogCollector.$emit('open');
            }
        },

        // 编辑采集器弹框
        updataCollector (row) {
            if (row && row.buildin === true) {
                return;
            }
            if (this.$refs && this.$refs.dialogCollector) {
                this.$refs.dialogCollector.$emit('open', row);
            }
        },

        // 删除采集器接口
        deleteCollector (row) {
            this.loading = true;
            let params = this.resolveDeleteParams(row);
            deleteCollectors(params)
                .then(() => {
                    this.$message('采集器已删除');
                    this.loadData();
                })
                .catch((err) => {
                    this.loading = false;
                    this.$error((err.data && err.data.mesg) || '采集器删除失败');
                });
        },

        // 选中复选框事件
        handleSelectionChange (v) {
            this.selectTableData = v;
        }

    }
};
</script>

<style lang="postcss">

@import "src/common/assets/css/var.css";
.collector-settings-wrapper {
    height: 100%;
    display: flex;
    position: relative;
    flex-shrink: 1;
    flex-direction: column;
    background-color: var(--panel-bg-color);
    & .table {
        position: absolute;
        top: 44px;
        display: flex;
        height: calc(100% - 92px);
        width: 100%;
        box-sizing: border-box;
        overflow: auto;
        & .el-icon-information {
            position: absolute;
            top: 11px;
            right: 12px;
        }

        & .opt-delete {
            margin-left: 8px;
        }
    }
    & .simulate_mask{
        display: inline-block;
        width: 70px;
        height: 40px;
        position: absolute;
        z-index: 10;
        cursor: not-allowed;
    }
}
</style>
