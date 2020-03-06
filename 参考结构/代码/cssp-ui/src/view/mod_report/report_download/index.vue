<template>
    <div v-loading="loading"
         class="report-download-wrapper table-search-wrapper">
        <div v-if="hasSetting || tableData.length">
            <toolbar>
                <toolbar-button
                    text="刷新"
                    icon="refresh"
                    @click.native="loadData" />
                <toolbar-button
                    text="批量下载"
                    icon="download"
                    :disabled="disabledDownload"
                    @click.native="download" />
                <toolbar-button
                    text="删除"
                    icon="delete"
                    :disabled="disableDelete"
                    @click.native="preDeleteReport" />
                <slot name="query">
                    <div class="search-content">
                        <el-button class="search-more-btn"
                                   @click="searchMore($event)">
                            <svg-icon icon-class="filter" />
                            更多筛选
                        </el-button>
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
                        label="名称"
                        prop="report_name"
                        show-overflow-tooltip />
                    <el-table-column
                        label="报表类型"
                        prop="report_type"
                        width="120">
                        <template slot-scope="scope">
                            {{ scope.row.report_type | reportType }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="数据来源"
                        prop="audit_type_name"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="audit-name-column">
                                <div 
                                    class="audit-name-ip"
                                    :title="scope.row.temp_name_ip">
                                    {{ scope.row.temp_name_ip }}
                                </div>
                                <svg-icon v-if="scope.row.is_del"
                                          icon-class="deleted" 
                                          class="report-state-icon" />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="报表日期"
                        prop="create_time"
                        show-overflow-tooltip />
                    <el-table-column
                        label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.statu">已生成</span>
                            <span v-else>
                                <span class="statu">未生成</span>
                                <popover v-if="scope.row.msg">
                                    <span>{{ scope.row.msg }}</span>
                                </popover>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150"
                        align="center">
                        <template slot-scope="scope">
                            <a href="javascript:void(0);"
                               :disabled="!scope.row.statu"
                               @click="download(scope.row)">
                                下载
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

            <search-dialog ref="searchDialog" 
                           @load-data="loadData" />
        </div>
        <div v-if="!hasSetting && !loading && !tableData.length"
             class="report-null-wrapper">
            <empty-status class="report-null-content">
                暂无报表，请前往报表设置开启报表策略
            </empty-status>
            <el-button @click="goSetup">
                前往开启
            </el-button>
        </div>
    </div>
</template>
<script>

/**
 * @file 报表下载
 */

import Toolbar from 'src/common/components/toolbar/toolbar';
import ToolbarButton from 'src/common/components/toolbar/toolbar_button';
import table from 'src/common/mixins/table';
import SearchDialog from './search_dialog';
import { REPORT_TYPE } from 'src/utils/consts';
import loadFile from 'src/utils/loadfile';
import { getReportList, exportReportFile, deleteReportFile } from 'src/common/api/report';
import EmptyStatus from 'src/common/components/empty_status';
import Popover from 'src/common/components/form_tips/popover_error';

import dayjs from 'dayjs';

export default {
    components: {
        Toolbar,
        ToolbarButton,
        SearchDialog,
        EmptyStatus,
        Popover
    },
    filters: {
        reportType (reportType) {
            let item = REPORT_TYPE.filter((item) => {
                return reportType === item.key;
            });
            return item.length ? item[0].value : '-';
        }
    },
    mixins: [table], 

    data () {
        return {
            tableData: [],
            hasSetting: true,
            loading: false,
            filter_str: '',
            filter: {
                temp_type: '',
                uuid: '',
                timeRange: {
                    start: '',
                    end: ''
                }
            },
            selectTableData: []
        };
    },

    computed: {
        disableDelete () {
            return !this.selectTableData.length;
        },
        disabledDownload () {
            let disabledFlag = true;
            this.selectTableData.map((item) => {
                if (item.statu) {
                    disabledFlag = false;
                }
            });
            return disabledFlag;
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

        // 更多筛选弹框
        searchMore () {
            if (this.$refs && this.$refs.searchDialog) {
                this.$refs.searchDialog.$emit('open', this.filter);
            }
        },

        // 获取列表参数
        resolveLoadParams () {
            let params = {
                page: this.pagination.page,
                num_per_page: this.pagination.pageSize,
                filter_str: this.filter_str,
                temp_type: '',
                uuid: '',
                start_time: '',
                end_time: ''
            };
            if (this.$refs && this.$refs.searchDialog) {
                let searchData = this.$refs.searchDialog.params;
                this.filter = searchData; // 下次搜索窗口打开时的初始值
                params.temp_type = searchData.temp_type || '';
                params.uuid = searchData.uuid || '';
                params.start_time = searchData.timeRange.start ? dayjs(searchData.timeRange.start).format('YYYYMMDD') : '';
                params.end_time = searchData.timeRange.end ? dayjs(searchData.timeRange.end).format('YYYYMMDD') : '';
            }
            return params;
        },

        loadData () {
            this.loading = true;
            let params = this.resolveLoadParams();
            getReportList(params)
                .then((res) => {
                    if (res.data) {
                        let tableData = [];
                        res.data.data.report_list.map((item) => {
                            item.temp_name_ip = item.temp_name;
                            if (item.temp_ip) {
                                item.temp_name_ip = `${item.temp_name_ip}（${item.temp_ip}）`;
                            }
                            tableData.push(item);
                        });
                        this.tableData = tableData;
                        this.hasSetting = res.data.data.has_setting;
                        this.pagination.total = res.data.total || 0;
                    }
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '报表列表数据获取失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleSelectionChange (v) {
            this.selectTableData = v;
        },

        // 删除的参数
        resolveSelectParams (row) {
            if (row && row.id) {
                return {
                    file_list: [row.id]
                };
            }
            return {
                file_list: this.selectTableData.map((item) => item.id)
            };
        },

        // 下载的参数
        resolveDownloadParams (row) {
            if (row && row.id) {
                return {
                    file_list: [row.id]
                };
            }
            let fileList = [];
            this.selectTableData.map((item) => {
                if (item.statu) {
                    fileList.push(item.id);
                }
            });
            return {
                file_list: fileList
            };
        },

        // 下载报表
        download (row) {
            if (row && row.statu === false) {
                return;
            }
            let params = this.resolveDownloadParams(row);
            exportReportFile(params)
                .then((res) => {
                    let filename = res.data.data || '';
                    if (filename) {
                        this.$message.success({
                            message: '下载成功'
                        });
                        loadFile(filename);
                    }
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '报表下载失败');
                })
                .finally(() => {});
        },

        // 删除报表确认弹框
        preDeleteReport () {
            this.$confirm('删除报表后将不可恢复，请谨慎操作', `确定要删除报表吗？`, {
                type: 'warning'
            })
                .then(() => {
                    this.delReport();
                })
                .catch(() => {});
        },

        // 删除报表接口
        delReport (row) {
            let params = this.resolveSelectParams(row);
            deleteReportFile(params)
                .then((res) => {
                    if (res.data.success) {
                        this.loadData();
                    }
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '报表删除失败');
                })
                .finally(() => {});
        },

        handleIconClick () {
            this.pagination.page = 1;
            this.loadData();
        },

        goSetup () {
            this.$emit('set-active', 1);
        }
    }
};
</script>
<style lang="postcss">
    .report-download-wrapper {
        & .statu {
            color: red;
            padding-right: 8px;
        }
        & .audit-name-column {
            display: flex;
            align-items: center;
            & .audit-name-ip {
                max-width: calc(100%-63px);
                overflow: hidden;
                text-overflow: ellipsis;
             }
            & .report-state-icon {
                width: 55px;
                height: 20px;
                padding-left: 8px;
            }
        }    
        & .report-null-wrapper{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            & .report-null-content {
                width: 250px;
                margin-bottom: 12px;
            }
        }
    }
    
</style>
