<template>
    <div class="audit-strategy-wrapper content-page">
        <toolbar>
            <toolbar-button
                text="启用"
                icon="enable"
                :disabled="btnState"
                @click.native="enableAuditStrategy(true)" />
            <toolbar-button
                text="禁用"
                icon="disable"
                :disabled="btnState"
                @click.native="disableAuditStrategy(false)" />
        </toolbar>
        <div class="table">
            <el-table
                v-loading="loading"
                :data="auditStrategyTableData"
                style="width:100%; hright:100%;"
                height="100%"
                width="100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" />
                <el-table-column
                    label="序号"
                    width="50">
                    <template slot-scope="scope">
                        <span>{{ computeIndex(scope.$index) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="策略名称"
                    prop="zh_name"
                    width="150"
                    show-overflow-tooltip />
                <el-table-column
                    label="描述"
                    prop="zh_desc"
                    show-overflow-tooltip />
                <el-table-column
                    label="状态"
                    width="120">
                    <template slot-scope="scope">
                        <toolbar-button :icon="scope.row.enable ? 'enable' : 'disable'"
                                        text=""
                                        :title="scope.row.enable ? '点击禁用' : '点击启用'"
                                        @click.native="scope.row.enable ? disableAuditStrategy(scope.row) : enableAuditStrategy(scope.row)" />
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
    </div>
</template>

<script>

/**
 * @file 审计策略
 */

import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import table from 'src/common/mixins/table';
import { LEVELLIST } from 'src/utils/consts';

import { 
    getAllAuditStrategy,
    setAuditStrategy
} from 'src/common/api/audit_strategy';

export default {
    components: {
        toolbar,
        toolbarButton
    },
    mixins: [table], 
    data () {
        return {
            auditStrategyTableData: [],
            selectTableData: [],
            loading: false,
            level: LEVELLIST
        };
    },
    computed: {

        //所有审计策略均可采用禁用
        btnState () {
            return !this.selectTableData.length;
        }
    },
    mounted () {
        this.loadData();
        this.$on('load-data', () => {
            this.auditStrategyTableData = [];
            this.loadData();
        });
    },
    methods: {

        // 获取列表参数
        resolveLoadParams () {
            return {
                page: this.pagination.page,
                num_per_page: this.pagination.pageSize
            };
        },

        // 获取策略列表数据
        loadData () {
            this.loading = true;
            let params = this.resolveLoadParams();
            getAllAuditStrategy(params)
                .then((res) => {
                    this.auditStrategyTableData = res.data.data || [];
                    this.pagination.total = res.data.total || 0;
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                    this.$error((err.data && err.data.mesg) || '策略数据获取失败');
                });
        },

        // 获取启用，禁用的参数
        resolveSetParams (row, op) {
            if (row && row.audit_type) {
                return {
                    audit_types: [row.audit_type],
                    op: op
                };
            }
            return {
                audit_types: this.selectTableData.map((item) => item.audit_type),
                op: op
            };
        },

        // 策略禁用
        disableAuditStrategy (row) {
            let params = this.resolveSetParams(row, 'disable');
            this.setAuditStrategy(params, '禁用');
        },

        // 策略启用
        enableAuditStrategy (row) {
            let params = this.resolveSetParams(row, 'enable');
            this.setAuditStrategy(params, '启用');
        },

        // 启用，禁用请求
        setAuditStrategy (params, msg) {
            setAuditStrategy(params)
                .then(() => {
                    this.$message(`策略已${msg}`);
                    this.loadData();
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || `策略${msg}失败`);
                });
        },

        // 复选框选中回调函数
        handleSelectionChange (v) {
            this.selectTableData = v;
        }

    }
};
</script>

<style lang="postcss">

@import "src/common/assets/css/var.css";
.audit-strategy-wrapper {
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
        & .el-icon-information{
            position: absolute;
            top: 11px;
            right: 12px;
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
