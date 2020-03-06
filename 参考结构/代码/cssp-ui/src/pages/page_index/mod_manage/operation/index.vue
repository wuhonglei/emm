<template>
    <div class="operation-log-wrap">
        <div class="operation-log-wrapper content-page">
            <toolbar class="toolbar">
                <toolbar-button
                    text="刷新"
                    icon="refresh"
                    @click.native="handleInputSearch" />
                <div class="right">
                    <el-input
                        v-model="tempSearch"
                        placeholder="搜索行为或描述中的关键字"
                        size="small"
                        icon="search"
                        :on-icon-click="handleInputSearch"
                        :disabled="isDisabled"
                        @keyup.native.enter="handleInputSearch" />
                    <el-popover popper-class="operation-log-popper">
                        <div class="opertion-log-search-wrap query">
                            <el-form>
                                <div class="form">
                                    <div class="form__label">
                                        状态
                                    </div>
                                    <div class="form__content">
                                        <el-select v-model="params.status">
                                            <el-option
                                                v-for="v in statusOptions"
                                                :key="v.value"
                                                :label="v.label"
                                                :value="v.value" />
                                        </el-select>
                                    </div>
                                </div>
                                <div class="form">
                                    <div class="form__label">
                                        关键字
                                    </div>
                                    <div class="form__content">
                                        <el-form-item prop="likes">
                                            <el-input
                                                v-model="params.likes"
                                                placeholder="行为，操作人，描述，对象" />
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="form">
                                    <div class="form__label">
                                        日期
                                    </div>
                                    <div class="form__content">
                                        <el-date-picker
                                            v-model="params.time"
                                            size="small"
                                            style="width:100%;"
                                            :editable="false"
                                            type="daterange"
                                            align="yyyy/MM/dd"
                                            placeholder="选择日期范围"
                                            :picker-options="pickerOptions" />
                                    </div>
                                </div>
                            </el-form>
                            <div class="footer">
                                <el-button
                                    size="small"
                                    type="primary"
                                    @click="submit">
                                    确定
                                </el-button>
                                <el-button
                                    size="small"
                                    @click="clear">
                                    清空
                                </el-button>
                            </div>
                        </div>
                        <toolbar-button
                            slot="reference"
                            text="高级搜索"
                            icon="config"
                            :style="{'color' : showAdvance ? 'red' : ''}" />
                    </el-popover>
                </div>
            </toolbar>
            <div
                v-loading="loading"
                class="table">
                <el-table
                    :data="tableData"
                    height="100%"
                    style="height: 100%;width: 100%;'overflow-x':'auto'"
                    width="100%">
                    <el-table-column
                        label="状态"
                        width="80px"
                        prop="status">
                        <template slot-scope="scope">
                            <status-bar :status="scope.row" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作人"
                        show-overflow-tooltip
                        width="150px"
                        prop="user_name" />
                    <el-table-column
                        label="操作主机"
                        show-overflow-tooltip
                        width="150px"
                        prop="user_addr" />
                    <el-table-column
                        label="行为"
                        show-overflow-tooltip
                        width="170px"
                        prop="action" />
                    <el-table-column
                        label="对象"
                        show-overflow-tooltip
                        width="170px"
                        prop="object_name" />
                    <el-table-column
                        label="开始时间"
                        show-overflow-tooltip
                        width="170px"
                        prop="begin_time" />
                    <el-table-column
                        label="结束时间"
                        width="170px"
                        show-overflow-tooltip
                        prop="end_time" />
                    <el-table-column
                        label="描述"
                        show-overflow-tooltip
                        prop="description" />
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
    </div>
</template>


<script>

/**
 * 操作日志
 */

import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import { loadOperationLog } from 'src/common/api/manage';
import table from 'src/common/mixins/table';
import dayjs from 'dayjs';
import statusBar from 'src/common/components/status';


export default {

    components:{
        toolbar,
        toolbarButton,
        statusBar
    },
    mixins: [table],

    data () {
        return {
            isDisabled: false,
            tempSearch: '',
            showAdvance: false,
            search:'',
            tableData: [],
            loading: false,
            params:{
                status:'',
                time: [(new Date()), (new Date())],
                likes:''
            },
            statusOptions:[{
                label: '全部',
                value: ''
            }, {
                label: '成功',
                value: 'SUCCESS'
            }, {
                label: '失败',
                value: 'FAILURE'
            }],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick (picker) {
                        let end = new Date();
                        let start = new Date();
                        const TIME = 604800000; //3600 * 1000 * 24 * 7
                        start.setTime(start.getTime() - TIME);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick (picker) {
                        let end = new Date();
                        let start = new Date();
                        const TIME = 2592000000; //3600 * 1000 * 24 * 30

                        start.setTime(start.getTime() - TIME);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick (picker) {
                        let end = new Date();
                        let start = new Date();
                        const TIME = 7776000000; //3600 * 1000 * 24 * 90
                        start.setTime(start.getTime() - TIME);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            }
        };
    },

    mounted () {
        this.loadData();
    },

    methods: {
        loadData () {
            let params = this.getParams();

            loadOperationLog(params)
                .then((res) => {
                    this.tableData = res.data.data;
                    this.pagination.total = res.data.total;
                })
                .catch((err) => {
                    this.$error(err.data && err.data.mesg || '数据获取失败');
                });
        },

        getParams () {
            return {
                order: 'asc',
                sort: '',
                per_page: this.pagination.pageSize,
                page: this.pagination.page,
                search_value: this.showAdvance ? '' : this.search,
                filters: {
                    begin_time: this.showAdvance ? dayjs(this.params.time[0]).format('YYYY-MM-DD 00:00:00') : '',
                    end_time: this.showAdvance ? dayjs(this.params.time[1]).format('YYYY-MM-DD 23:59:59') : '',
                    likes: this.showAdvance ? this.params.likes : '',
                    status: this.showAdvance ? this.params.status : ''
                }
            };
        },

        handleCurrentChange (currentPage) {
            this.pagination.page = currentPage;
            this.loadData();
        },

        handleSizeChange (size) {
            this.pagination.pageSize = size;
            this.pagination.page = 1;
            this.loadData();
        },

        handleInputSearch () {
            this.search = this.tempSearch;
            this.pagination.page = 1;
            this.loadData();
        },

        submit () {
            this.tempSearch = '';
            this.search = '';
            this.showAdvance = true;
            this.isDisabled = true;
            this.loadData();
            document.body.click();
        },

        clear () {
            this.showAdvance = false;
            this.isDisabled = false;
            this.params = {
                status:'',
                time: [(new Date()), (new Date())],
                likes:''
            };
            this.pagination.page = 1;
            this.loadData();
            document.body.click();
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";
.operation-log-wrap {
    height: calc(100% - 54px);
    margin: 0 16px 16px 0;
    box-sizing: border-box;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
    & .operation-log-wrapper{
        height: 100%;
        display: flex;
        position: relative;
        flex-shrink: 1;
        flex-direction: column;
        background-color: var(--panel-bg-color);
    }
    & .table {
        position: absolute;
        top: 44px;
        display: flex;
        height: calc(100%-44px);
        width: 100%;
        padding-bottom: 54px;
        box-sizing: border-box;
        overflow: auto;
    }
    & .operation-table-wrap {
        background-color: var(--panel-bg-color);
    }
    & .el-input{
        width: 320px;
    }
    & .right{
        float: right;
        margin-right: 30px;
    }
}
.operation-log-popper{
    padding: 0;
    & .query{
        & .form__content {
            width: 200px;
        }
    }
    & .opertion-log-search-wrap{
        overflow: hidden;
        & .footer {
            float: right;
        }
    }
}
</style>

