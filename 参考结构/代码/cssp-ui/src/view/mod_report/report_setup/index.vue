<template>
    <div class="report-setup-wrapper table-search-wrapper">
        <toolbar>
            <toolbar-button
                text="刷新"
                icon="refresh"
                @click.native="loadData" />
            <toolbar-button
                text="启用"
                icon="enable"
                :disabled="isDisable"
                @click.native="enableReportSetup" />
            <toolbar-button
                text="禁用"
                icon="disable"
                :disabled="isDisable"
                @click.native="disableReportSetup" />
            <slot name="query">
                <div class="search-content">
                    <el-form class="search-content-item">
                        <el-form-item prop="filter_str">
                            <el-input
                                v-model="filter_str"
                                placeholder="搜索名称、类型、来源"
                                size="small"
                                icon="search"
                                :on-icon-click="handleIconClick"
                                @keyup.native.enter="handleIconClick" />
                        </el-form-item>
                    </el-form>
                </div>
            </slot>
        </toolbar>
        <div class="table">
            <el-table
                v-loading="loading"
                :data="tableData"
                height="100%"
                width="100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" />
                <el-table-column
                    label="序号"
                    width="80">
                    <template slot-scope="scope">
                        <span>{{ computeIndex(scope.$index) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="名称">
                    <template slot-scope="scope"> 
                        <text-btn
                            :text="scope.row.report_name"
                            @click.native="updateSetup(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column
                    label="报表类型"
                    prop="report_type"
                    width="150">
                    <template slot-scope="scope">
                        {{ scope.row.report_type | reportType }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="数据来源"
                    prop="audit_type_name"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.temp_name }}
                        <span v-if="scope.row.temp_ip">（{{ scope.row.temp_ip }}）</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="报表策略权限"
                    width="180"
                    align="center">
                    <template slot-scope="scope">
                        <toolbar-button 
                            :icon="scope.row.all_switch ? 'enable' : 'disable'"
                            text=""
                            :title="scope.row.all_switch ? '点击禁用' : '点击启用'"
                            @click.native="scope.row.all_switch ? disableReportSetup(scope.row) : enableReportSetup(scope.row)" />
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

        <setup-dialog 
            ref="setupDialog" 
            @refresh="loadData" />
    </div>
</template>
<script>

/**
 * @file 报表设置
 */

import Toolbar from 'src/common/components/toolbar/toolbar';
import ToolbarButton from 'src/common/components/toolbar/toolbar_button';
import TextBtn from 'src/common/components/table_text_btn';
import SetupDialog from './setup_dialog';
import table from 'src/common/mixins/table';

import { getReportConfList, setReportConfList } from 'src/common/api/report';
import { REPORT_TYPE } from 'src/utils/consts';

export default {
    components: {
        Toolbar,
        ToolbarButton,
        TextBtn,
        SetupDialog
    },
    filters: {
        reportType (reportType) {
            let reportName = [];
            reportType.forEach((type) => {
                let item = REPORT_TYPE.filter((item) => {
                    return type === item.key;
                });
                if (item[0] && item[0].value) {
                    reportName.push(item[0] && item[0].value);
                }
            });
            return reportName.length ? reportName.join('，') : '-';
        }
    },
    mixins: [table], 
    data () {
        return {
            tableData: [],
            loading: false,
            filter_str: '',
            selectTableData: ''
        };
    },
    computed: {
        isDisable () {
            return !this.selectTableData.length;
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
        loadData () {
            this.loading = true;
            let params = {
                page: this.pagination.page,
                num_per_page: this.pagination.pageSize,
                filter_str: this.filter_str
            };
            getReportConfList(params)
                .then((res) => {
                    if (res.data) {
                        let tableData = [];
                        res.data.data.forEach((item) => {
                            item.selectType = item.report_type,
                            tableData.push(item);
                        });
                        this.tableData = tableData;
                        this.pagination.total = res.data.total || 0;
                    }
                    
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '报表设置列表数据获取失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleIconClick () {
            this.pagination.page = 1;
            this.loadData();
        },

        handleSelectionChange (v) {
            this.selectTableData = v;
        },

        // 启用，禁用的参数
        resolveSelectParams (row, isSwitch) {
            let params = [];
            if (row && row.report_name) {
                params.push({
                    report_type: row.report_type,
                    report_name: row.report_name,
                    temp_uuid: row.temp_uuid,
                    all_switch: isSwitch
                });
            } else {
                this.selectTableData.forEach((item) => {
                    params.push({
                        report_type: item.report_type,
                        report_name: item.report_name,
                        temp_uuid: item.temp_uuid,
                        all_switch: isSwitch
                    });
                });
            }
            return params;
        },

        submitSetup (row) {
            let params = [{
                report_type: row.selectType,
                report_name: row.report_name,
                temp_uuid: row.temp_uuid,
                all_switch: row.all_switch
            }];
            setReportConfList(params)
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success({
                            message: '设置成功'
                        });
                        this.loadData();
                    }
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '报表设置失败');
                })
                .finally(() => {});
            
        },

        enableReportSetup (row) {
            let params = this.resolveSelectParams(row, true);
            this.setReportConfList(params, '启用');
        },

        disableReportSetup (row) {
            let params = this.resolveSelectParams(row, false);
            this.setReportConfList(params, '禁用');
        },

        // 设置报表接口
        setReportConfList (params, msg) {
            setReportConfList(params)
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success({
                            message: `${msg}成功`
                        });
                        this.loadData();
                    }
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || `${msg}失败`);
                });
        },

        updateSetup (row) {
            if (this.$refs && this.$refs.setupDialog) {
                this.$refs.setupDialog.$emit('open', row);
            }
        }
    }
};
</script>
<style lang="postcss">
    .report-setup-wrapper {
        & .opt-setup {
            margin-left: 8px;
        }
    }
    .report-setup-popover {
        background: #fff;
        border: 1px solid #ccc;
        padding: 20px 0 0 0;
        
    }
    
</style>
