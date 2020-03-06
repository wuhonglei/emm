<template>
    <div class="admin-log-list-wrapper h-100">
        <div v-show="toggle" 
             class="log-manage__collapse">
            <div class="log-manage__collapse--content">
                <span class="log-manage__query--result"><lang>筛选条件：</lang></span>
                <tag 
                    :list="conditionTags"
                    :closeable="true"
                    :max-width="346"
                    @tag-change="removeConditionTag" />
            </div>
            <div class="log-manage__collapse--iconfont">
                <span class="log-manage__trigger"
                      @click="tirgger">
                    {{ toggleWord }}
                    <i class="iconfont log-manage__icon">&#xe6cb;</i>
                </span>
            </div>
            <div class="clear"></div>
        </div>
        <div v-show="!toggle">
            <div class="log-manage__top">
                <span class="log-manage__trigger"
                      @click="tirgger">
                    {{ toggleWord }}
                    <i class="iconfont log-manage__icon">&#xe6c8;</i>
                </span>
            </div>
            <div class="log-manage__form">
                <div class="log-manage__row">
                    <sf-form-item class="log-manage__item">
                        <sf-fieldlabel :label-width="76">
                            选择日期
                        </sf-fieldlabel>
                        <log-date
                            :beg-date="params.begDate"
                            :end-date="params.endDate"
                            @on-date-change="dateChange" />
                    </sf-form-item>
                    <sf-form-item class="log-manage__item">
                        <sf-fieldlabel :label-width="76">
                            操作行为
                        </sf-fieldlabel>
                        <sf-select
                            v-model="params.logSubType"
                            :default-width="300"
                            :options="operateAction" />
                    </sf-form-item>
                    <sf-form-item class="log-manage__item">
                        <sf-fieldlabel :label-width="76">
                            操作结果
                        </sf-fieldlabel>
                        <sf-select
                            v-model="params.actionResult"
                            :default-width="300"
                            :options="operateResult" />
                    </sf-form-item>
                </div>
                <div class="log-manage__row">
                    <sf-form-item class="log-manage__item">
                        <sf-fieldlabel :label-width="76">
                            设备ID
                        </sf-fieldlabel>
                        <sf-searchfield
                            ref="deviceID"
                            v-model="params.deviceID"
                            :default-width="300"
                            :trigger-clear="true"
                            placeholder="请输入设备ID"
                            :max-length="32"
                            @trigger="queryRes" />
                    </sf-form-item>
                    <sf-form-item class="log-manage__item">
                        <sf-fieldlabel :label-width="76">
                            搜索
                        </sf-fieldlabel>
                        <sf-type-search>
                            <sf-select
                                slot="select"
                                v-model="params.searchType"
                                :options="filters"
                                :default-width="82" />
                            <sf-searchfield
                                slot="input"
                                ref="searchKey"
                                v-model="params.searchKey"
                                :default-width="300"
                                :trigger-clear="true"
                                placeholder="请输入关键字"
                                :max-length="128"
                                @trigger="queryRes" />
                        </sf-type-search>
                    </sf-form-item>
                </div>
            </div>
            <div class="log-manage__query">
                <sf-button-primary @click="queryRes">
                    查询
                </sf-button-primary>
            </div>
        </div>
        <div class="log-manage__table"
             :class="{'log-manage__table--trigger': toggle}">
            <table-page
                v-if="isLoadTable"
                ref="table"
                :key="tableKey"
                :api="queryLog"
                :show-filters="false"
                :show-search="false"
                :selection-hide="true"
                :handle-load-params="handleLoadParams">
                <div slot="toolbarBtns">
                    <sf-button-blank
                        @click="reload(true, 'refresh')">
                        刷新
                        <i
                            slot="icon"
                            class="iconfont icon-bar-compatible">
                            &#xe812;
                        </i>
                    </sf-button-blank>
                    <span class="btn-border">|</span>
                    <sf-button-blank
                        :default-disabled="isOnExport"
                        @click="exportData">
                        导出
                        <i
                            slot="icon"
                            class="iconfont icon-bar-compatible">
                            &#xe65a;
                        </i>
                    </sf-button-blank>
                </div>
                <sf-table-column
                    :default-width="40"
                    type="index">
                    序号
                </sf-table-column>
                <sf-table-column
                    :default-width="150"
                    :toggle-column="true"
                    :sort-able="true"
                    data-index="time">
                    时间
                </sf-table-column> 
                <sf-table-column
                    :toggle-column="true"
                    data-index="deviceID">
                    设备ID
                </sf-table-column>
                <sf-table-column 
                    :toggle-column="true"
                    data-index="userName">
                    用户名
                </sf-table-column>
                <sf-table-column
                    :toggle-column="true"
                    data-index="ip">
                    接入IP
                </sf-table-column>
                <sf-table-column
                    :toggle-column="true"
                    data-index="logSubType_transfer">
                    操作行为
                </sf-table-column>
                <sf-table-column
                    :toggle-column="true"
                    data-index="entity_transfer">
                    操作对象
                </sf-table-column>
                <sf-table-column
                    :toggle-column="true"
                    data-index="actionResult_transfer">
                    操作结果
                </sf-table-column>
                <sf-table-column
                    :toggle-column="true"
                    data-index=""
                    title="操作">
                    <template 
                        slot-scope="scope">
                        <a
                            href="javascript:void(0)" 
                            class="sfv-link"
                            @click="checkDetails(scope.record)">
                            <lang>查看详情</lang>
                        </a>
                    </template>
                </sf-table-column>
            </table-page>
        </div>
        <see-details
            :display.sync="display">
            <div slot="seeDetailsList">
                <div class="see-details__item">
                    <label class="see-details__label"><lang>时间：</lang></label>
                    <div class="see-details__content">
                        {{ detailData.time }}
                    </div>
                </div>
                <div class="see-details__item">
                    <label class="see-details__label"><lang>设备ID：</lang></label>
                    <div class="see-details__content">
                        {{ detailData.deviceID }}
                    </div>
                </div>
                <div class="see-details__item">
                    <label class="see-details__label"><lang>用户名：</lang></label>
                    <div class="see-details__content">
                        {{ detailData.userName }}
                    </div>
                </div>
                <div class="see-details__item">
                    <label class="see-details__label"><lang>接入IP：</lang></label>
                    <div class="see-details__content">
                        {{ detailData.ip }}
                    </div>
                </div>
                <div class="see-details__item">
                    <label class="see-details__label"><lang>操作行为：</lang></label>
                    <div class="see-details__content">
                        {{ detailData.logSubType_transfer }}
                    </div>
                </div>
                <div class="see-details__item">
                    <label class="see-details__label"><lang>操作对象：</lang></label>
                    <div class="see-details__content">
                        {{ detailData.entity_transfer }}
                    </div>
                </div>
                <div class="see-details__item">
                    <label class="see-details__label"><lang>操作结果：</lang></label>
                    <div class="see-details__content">
                        {{ detailData.actionResult_transfer }}
                    </div>
                </div>
                <div class="see-details__item">
                    <label class="see-details__label"><lang>描述：</lang></label>
                    <div class="see-details__content">
                        {{ detailData.msg }}
                    </div>
                </div>
            </div>
        </see-details>
        <iframe
            v-show="false" 
            name="adminIframeCsv"></iframe>  
        <form
            v-show="false"
            ref="adminIframeCsv"
            target="adminIframeCsv"
            method="get"
            action="/api/v1/logger/downloadLog">
            <input 
                type="hidden"
                name="exportID"
                :value="exportID">
        </form>
    </div>
</template>

<script>

/**
 * 管理员日志
 */

import TablePage from 'src/page_index/components/business/table_page';
import handleLog from 'src/page_index/mixins/handle_log';
import LogDate from 'src/page_index/views/log/components/log_date';
import SeeDetails from 'src/page_index/views/log/components/see_details';
import LogImportBar from 'src/page_index/views/log/components/log_import_bar';
import { formatEndDate, formatBegDate } from 'src/utils/format';
import { queryLog, getLogSearchKeys, getLogCount, exportLog, getProgressValue, cancelExport } from 'src/api/log_manage';
import { getLogConfig } from 'src/api/system_manage';
import Tag from 'src/page_index/components/tag';
import lodashGet from 'lodash/get';
let params = {
    begDate: formatBegDate(),
    endDate: formatEndDate(),
    logSubType: 'all',
    actionResult: 'all',
    searchType: '',
    searchKey: '',
    deviceID: '',
    type: 'adminlog'
};

let exportParams = {
    sortBy: 'time',
    asc: 0
};
let backParams = {};
const EXPORTMAX = 1000000;
const TIMEOUT = 1000;

export default {
    components: {
        TablePage,
        SeeDetails,
        LogDate,
        Tag
    },
    mixins: [handleLog],
    data () {
        return {
            queryLog,
            detailData:{},
            display: false,
            params: Object.assign({}, params),
            tableKey: new Date().getTime(),
            toggleWord: _('收起'),
            toggle: false,
            filters: [],
            operateAction: [],
            operateResult: [],
            isOnExport: false,
            exportID: '',
            conditionTags: [],
            isLoadTable: false,
            isClick: false,
            addSearchID: false
        };
    },
    created () {

        // 绑定浏览器的刷新和关闭事件
        window.addEventListener('beforeunload', this.cancelExport);
    },
    mounted () {
        
        // 重新赋值日期，避免切换页面日期不会实时更新的情况
        this.$set(this.params, 'begDate', formatBegDate());
        this.$set(this.params, 'endDate', formatEndDate());

        // 时间赋值成功后开始加载表格
        this.isLoadTable = true;

        // 初始化查询条件数据
        this.loadData();
    },
    destroyed () { 
        
        // 销毁浏览器刷新和关闭事件
        window.removeEventListener('beforeunload', this.cancelExport);

        // 避免导出的时候快速切换页面的,页面销毁后触发
        this.cancelExport();
        this.closeExport();
    },
    methods: {

        // 加载查询条件的数据
        loadData () {
            getLogSearchKeys({
                type: 'adminlog'
            }).then(res => {
                let paramsData = res.data.data;
                this.addSearchID = true;
                this.operateAction = lodashGet(paramsData, 'logSubType.values', []);
                this.operateResult = lodashGet(paramsData, 'actionResult.values', []);
                this.filters = lodashGet(paramsData, 'searchType.values', []);
                this.$set(this.params, 'searchType', lodashGet(paramsData, 'searchType.values[0].value', ''));

                // 备份查询条件
                Object.assign(backParams, this.params);
            });
        },

        // 查看详情 
        checkDetails (row) {
            this.detailData = row;
            this.display = true;
        },
        
        // 查询条件
        handleLoadParams (params) {
            if (params.sortBy && params.asc) {
                Object.assign(exportParams, {sortBy: params.sortBy, asc: params.asc === 'ASC' ? 1 : 0});
            };
            let loadParams = Object.assign(params, this.params);
            loadParams.addSearchID = !this.addSearchID ? '' : true;
            return loadParams;
        },
            
        // 查询
        queryRes () {
            
            // 校验查询条件
            if (!this.$refs.deviceID.isValid() || !this.$refs.searchKey.isValid()) {
                return;
            }

            let pagination = this.$refs.table.getPagination();

           // 设置页码更新数据
            if (pagination.activePage !== 1) {
                this.addSearchID = false;
                this.$refs.table.setPagination({pageIndex: 1});
                
                setTimeout(() => {
                    this.addSearchID = true;
                }, 0);
            } else {
                
            // 通过刷新来查询数据
                this.reload(false, 'query');
            }


            // 点击查询后将查询条件备份
            Object.assign(backParams, this.params);
        },

        // 展开收起
        tirgger () {
            if (this.isClick) {
                return;
            }
            
            this.isClick = true;
            this.toggle = !this.toggle;
            this.toggleWord = this.toggle ? _('展开') : _('收起');

            // 重新计算表格的高度
            this.$refs.table.tableAdaptive();

            // 收起的情况
            if (this.toggle) {

                // 渲染筛选条件
                this.updateConditionTag();

                // 筛选条件只显示查询条件
                Object.assign(this.params, backParams);
            }

            // 防止页面疯狂点击ie下有问题
            setTimeout(() => {
                this.isClick = false;
            }, TIMEOUT);
        },

        // 刷新 参数true 会出现tips刷新成功
        reload (isShowTips, type) {

            if (type === 'refresh') {
                Object.assign(this.params, backParams);
            }

            this.addSearchID = false;
            this.$refs.table.clearReload(isShowTips);
            this.addSearchID = true;
        },

        // 日期组件回调发生改变，查询参数需要更新
        dateChange (begDate, endDate) {
            Object.assign(this.params, { begDate: begDate, endDate: endDate });
        },

        // 获取日志配置中最大导出数量
        exportData () {
            
            // 获取日志量总数, 点击导出后禁用导出按钮
            this.isOnExport = true;
            getLogConfig().then((res) => {
                let data = res.data.data,
                    exportLimit = lodashGet(data, 'exportLimit', 1);

                this.getLogCount(exportLimit);

            }).catch(() => {
                this.isOnExport = false;
            });
        },

        // 获取日志总数
        getLogCount (exportLimit) { 
            getLogCount(this.params).then(res => {
                let data = res.data.data,
                    count = lodashGet(data, 'count', 0);
                
                if (count === 0) {
                    this.$showInfo(_('暂无导出数据'));
                    this.isOnExport = false;
                    return;
                }

                // 日志数量超过100万需要出现提示
                if (count > EXPORTMAX && exportLimit >= EXPORTMAX) {
                    let confirm = this.$confirm({
                        msg: _('日志导出量过大<br/>当前导出量超过单次最大导出量，可能会造成导出失败或导出<br/>后无法正常打开文件，建议分批导出。'),
                        icon: 'info',
                        afterShowFocus: false,
                        buttons: [{cls: 'sfv-btn-primary', text: _('我知道了'), actionName:'ok'}],
                        callback: (actionName) => {
                            confirm.destroy();
                            confirm = null;

                            // 点击我知道了开始下载， 点击右上角关闭X不进行下载
                            if (actionName === 'ok') {                     
                                this.exportLog();
                            } else {
                                this.isOnExport = false;
                            }
                        }
                    });
                    return;
                }
                this.exportLog();
            }).catch(() => {
                this.isOnExport = false;
            });
        },
    
        // 开始导出
        exportLog () {
            exportLog(Object.assign(exportParams, this.params)).then((res) => {
                let data = res.data.data,
                    exportID = lodashGet(data, 'uuid', '');
                if (!exportID) {
                    this.$fail(_('导出失败'));
                    this.isOnExport = false;
                    return;
                }
                this.exportID = exportID;
                this.getProgressValue();
            }).catch(() => {
                this.closeExport();
            });
        },

        // 查询导出进度条进度
        getProgressValue () { 
            let maxValue = 100;

            // false的情况不在继续导出
            if (!this.isOnExport) {
                return;
            }

            // 获取导出的进度
            getProgressValue({
                exportID: this.exportID
            }).then(res => {
                let data = res.data.data,
                    progressValue = lodashGet(data, 'progressValue', 0);

                // 打开进度条显示
                this.openExportModal(progressValue);
                if (progressValue < maxValue) {

                    // 查询进度条值小于100继续执行
                    setTimeout(this.getProgressValue, TIMEOUT);
                }
            }).catch(() => {
                this.closeExport();
            });
        },

        // 打开进度条弹框
        openExportModal (progressValue) { 
            let maxValue = 100;

            // false的情况不在继续导出
            if (!this.isOnExport) {
                return;
            }

            // 弹框存在的情况不重复创建
            if (!this.Modal) {
                this.Modal = this.$modal(LogImportBar, {
                    title: _('正在导出'),
                    buttons: ['cancel'],
                    afterShowFocus: false,
                    closeable: true,
                    beforeHide: () => {
                        this.cancelExportModal();
                        return false;
                    }
                });
                this.Modal.open();
            }

            // 小于100的情况下只更新进度
            if (progressValue < maxValue) {
                this.Modal.formRoot.width = progressValue;
                return;
            }
            
            this.Modal.formRoot.width = maxValue;

            // 下载ZIP
            this.$refs.adminIframeCsv.submit();
            
            // 延迟1秒销毁 让进度条到百分之百
            setTimeout(() => {
                this.closeExport();
            }, TIMEOUT);
        },

        // 导出通用处理
        closeExport () {
            if (this.Modal) {
                this.Modal.destroy();
                this.Modal = null;
            }
            this.isOnExport = false;
            this.exportID = '';
        },

        // 是否取消导出
        cancelExportModal () {
            let exportModal = this.$confirm({
                msg: _('确定取消日志导出吗？<br/>点击确定后，将取消此次日志导出操作。'),
                icon: 'info',
                afterShowFocus: false,
                submit: () => {

                    // 优先销毁进度条的弹框
                    if (this.Modal) {
                        this.Modal.destroy();
                        this.Modal = null;
                    }
                    this.cancelExport();
                    exportModal.destroy();
                    exportModal = null;
                }
            });
        },
        
        // 取消导出
        cancelExport () {
            if (this.exportID) {

                // 避免取消途中，还会继续发查询进度的请求
                this.isOnExport = false;
                cancelExport({
                    exportID: this.exportID
                }).then(() => {
                    this.closeExport();
                }).catch(() => {
                    this.closeExport();
                });
            }
        },
        
        // 筛选条件显示
        updateConditionTag () {
            let params = backParams;

            // 进来先清空上次的查询条件
            this.conditionTags.splice(0, this.conditionTags.length);

            this.conditionTags.push({
                label: '日期：' + params.begDate + '-' + params.endDate, value: 'time'
            }, {
                label: '操作行为：' + this.handleSelect(this.operateAction, params.logSubType), value: 'logSubType', closeable: true  
            }, {
                label: '操作结果：' +  this.handleSelect(this.operateResult, params.actionResult), value: 'actionResult', closeable: true  
            }); 
            if (params.deviceID) {
                this.conditionTags.push({
                    label: '设备ID:' + params.deviceID, value: 'deviceID', closeable: true
                });
            }
            if (params.searchKey) {
                this.conditionTags.push({
                    label: '搜索:' + params.searchKey, value: 'searchKey', closeable: true  
                });
            }
        },

        // 删除筛选条件
        removeConditionTag (data, item) { 
            let paramType = {
                logSubType: 'all',
                actionResult: 'all',
                deviceID: '',
                searchKey: ''
            };
            
            Object.assign(this.params, { [item.value]: paramType[item.value] });
            Object.assign(backParams, this.params);

            // 删除后重新刷新数据
            this.reload(false, 'refresh');
        }
    }
};
</script>