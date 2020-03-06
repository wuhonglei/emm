<template>
    <div class="collector-types-wrapper content-page"> 
        <toolbar>
            <toolbar-button
                text="刷新"
                icon="refresh"
                @click.native="loadData" />
            <toolbar-button
                text="新增"
                icon="add"
                @click.native="addCollectorType" />
            <toolbar-button
                text="删除"
                icon="delete"
                :disabled="disableDelete"
                @click.native="preDeleteCollectorType" />
        </toolbar>
        <div class="table">
            <el-table
                v-loading="loading"
                :data="tableData"
                height="100%"
                width="100%"
                style="height: 100%;width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    :selectable="disableSelect" />
                <el-table-column label="序号">
                    <template slot-scope="scope">
                        <span>{{ computeIndex(scope.$index) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="类型"
                    prop="name" />
                <el-table-column label="适用系统">
                    <template slot-scope="scope">
                        {{ scope.row._systems || '-' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="编辑"
                    width="50">
                    <template slot-scope="scope">
                        <toolbar-button
                            icon="edit"
                            text=""
                            :disabled="scope.row.buildin"
                            @click.native="updateCollectorType(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column
                    label="删除"
                    width="50">
                    <template slot-scope="scope">
                        <toolbar-button
                            icon="delete"
                            text=""
                            :disabled="scope.row.buildin || scope.row.refer_count !== 0"
                            @click.native="preDeleteCollectorType(scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                :current-page="pagination.page"
                :page-size="pagination.pageSize"
                :page-sizes="pagination.pageSizes"
                :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange" />
        </div>
        <dialog-collector-type
            ref="dialogCollectorType"
            @load-table-data="loadData" />
    </div>
</template> 

<script>

/** 
 * 采集器类型支持列表
*/

import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import table from 'src/common/mixins/table';
import dialogCollectorType from './dialog/collector_type';
import { addClass, removeClass, setStyle } from 'src/utils/dom';
import { 
    getAllPlugin,
    deletePlugin
} from 'src/common/api/asset_center';
export default {
    components: {
        toolbar,
        toolbarButton,
        dialogCollectorType
    },
    mixins: [table],
    data () {
        return {
            tableData: [],
            selectTableData: [],
            loading: true,
            tableHeaderInput: '',
            tableHeaderCell: '',
            tableHeaderTh: ''
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

    watch: {

        //监听表头checkbox的是否禁用的状态，来修改样式
        disableHeader (v, oldV) {
            if ((v !== oldV) && v) {
                this.handleHeaderDisabled(v);
            } else if ((v !== oldV) && !v) {
                this.handleHeaderDisabled(v);
            }
        }
    },

    mounted () {
        this.loadData();
        this.handleHeaderDom();
    },
    methods: {

        //获取dom操作
        handleHeaderDom () {
            this.$nextTick(() => {
                this.tableHeaderInput = this.$el.querySelector('thead .el-checkbox__input');
                this.tableHeaderCell = this.$el.querySelector('thead .el-table-column--selection > .cell');
                this.tableHeaderTh = this.$el.querySelector('thead .el-table-column--selection');
            });
        },

        //处理表头禁用
        handleHeaderDisabled (v) {
            if (!!v) {
                addClass(this.tableHeaderInput, 'is-disabled');
                setStyle(this.tableHeaderCell, 'pointer-events', 'none');
                setStyle(this.tableHeaderTh, 'cursor', 'not-allowed');
                return;
            } 
            removeClass(this.tableHeaderInput, 'is-disabled');
            setStyle(this.tableHeaderCell, 'pointer-events', 'auto');
            setStyle(this.tableHeaderTh, 'cursor', 'auto');
        },

        //内置采集器不可勾选
        disableSelect (row) {
            if (row.buildin || row.refer_count !== 0) {
                return false;
            }
            return true;
        },

        resolveLoadParams () {
            return {
                page: this.pagination.page,
                num_per_page: this.pagination.pageSize
            };
        },

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

        loadData () {
            this.loading = true;
            let params = this.resolveLoadParams();
            getAllPlugin(params)
                .then((res) => {
                    this.tableData = res.data.data || [];
                    this.pagination.total = res.data.total || 0;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        addCollectorType () {
            if (this.$refs.dialogCollectorType) {
                this.$refs.dialogCollectorType.$emit('open');
            }
        },

        updateCollectorType (row) {
            if (this.$refs.dialogCollectorType) {
                this.$refs.dialogCollectorType.$emit('open', row);
            }
        },

        preDeleteCollectorType (row) {
            let count;
            if (row && row.id) {
                count = 1;
            } else {
                count = this.selectTableData.length;
            }
            this.$confirm('删除采集器类型后，将不能添加此类型采集器', `确定要删除这${count}个采集器类型吗？`, {
                type: 'warning'
            })
                .then(() => {
                    this.deleteCollectorType(row);
                })
                .catch(() => {});
        },

        deleteCollectorType (row) {
            let params = this.resolveDeleteParams(row);
            deletePlugin(params)
                .then(() => {
                    this.$message('采集器类型已删除');
                    this.loadData();
                })
                .catch((err) => {
                    this.$error(err.data.mesg);
                });
        },

        handleCurrentChange (page) {
            this.pagination.page = page;
            this.loadData();
        },

        handleSizeChange (size) {
            this.pagination.pageSize = size;
            if (this.pagination.page === 1) {
                this.loadData();
            } else {
                this.pagination.page = 1;
            }
        },

        handleSelectionChange (v) {
            this.selectTableData = v;
        }
    }
};
</script>

<style lang="postcss">

@import "src/common/assets/css/var.css";
.collector-types-wrapper {
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
    }
}
</style>

