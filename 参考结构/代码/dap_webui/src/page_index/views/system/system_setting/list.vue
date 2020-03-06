<template>
    <div class="system_setting-list-wrapper h-100">
        <div class="system_setting__form">
            <div class="system_setting__head">    
                <div class="system_setting__title">
                    <lang>传输限制：</lang>
                </div>
                <div class="system_setting__subtitle">
                    <lang>仅接收从以下IP地址发送的日志</lang>
                </div>
            </div>
            <div class="system_setting__table">
                <sf-grid>
                    <sf-toolbar>
                        <sf-button-blank
                            @click="changeData('add')">
                            新增
                            <i
                                slot="icon"
                                class="iconfont icon-bar-compatible">
                                &#xe6cd;
                            </i>
                        </sf-button-blank>
                        <span class="btn-border">|</span>
                        <sf-button-blank
                            :default-disabled="isDisabledDel"
                            @click="delRows">
                            删除
                            <i
                                slot="icon"
                                class="iconfont icon-bar-compatible">
                                &#xe65e;
                            </i>
                        </sf-button-blank>
                    </sf-toolbar>
                    <sf-table 
                        ref="table"
                        :default-height="270"
                        :default-width="800"
                        :options="options">
                        <sf-table-column
                            :default-width="70"
                            type="index">
                            序号
                        </sf-table-column>
                        <sf-table-column
                            data-index="ip">
                            IP地址
                        </sf-table-column>
                        <sf-table-column
                            data-index="note">
                            描述
                        </sf-table-column>
                        <sf-table-column
                            :default-width="150"
                            data-index="c"
                            title="操作">
                            <template 
                                slot-scope="scope">
                                <a
                                    href="javascript:void(0)" 
                                    class="sfv-link"
                                    @click="changeData('edit', scope.row)">
                                    编辑
                                </a>
                                <span>|</span>
                                <a
                                    href="javascript:void(0)" 
                                    class="sfv-link"
                                    @click="delRow(scope.row)">
                                    删除
                                </a>
                            </template>
                        </sf-table-column>
                    </sf-table>
                </sf-grid>
            </div>
        </div>
        <div class="form-submit-line">
            <sf-button-primary
                class="mr24"
                @click="setLogWhiteList">
                保存
            </sf-button-primary>
            <sf-button
                @click="cancelLogWhiteList">
                取消
            </sf-button>
        </div>
    </div>
</template>
<script>

/** 系统设置 */

import SystemSetEdit from 'src/page_index/views/system/components/system_setting_edit';
import { getLogWhiteList, setLogWhiteList } from 'src/api/system_manage';
import lodashGet from 'lodash/get';

// 弹框提示配置
const CONFIRM = {
    delTiTle: _('操作确认'),
    delMsg: _('确认要执行删除操作?'),
    delBtns: [{cls: 'sfv-btn-primary', text: _('是'), actionName:'ok'}, {text: _('否'), actionName:'no'}],
    limitTitle: _('错误'),
    limitMsg: _('新增IP地址失败<p>数目达到上限，请删除后重建</p>'),
    limitBtns: [{cls: 'sfv-btn-primary', text: _('我知道了'), actionName:'understood'}]
};
export default {
    data () {
        return {
            tableKey: new Date().getTime(),
            options:{
                forceFit: true
            },
            tableData: [],
            isMounted: false
        };
    },
    computed: {
        isDisabledDel () {
            if (!this.isMounted) {
                return true;
            }
            return this.$refs.table.getSelections().length > 0 ? false : true;
        }
    },
    mounted () {
        this.loadData(false);
        this.isMounted = true;
    },
    methods: {

        // 查询表格数据
        loadData (enableTips) { 
            getLogWhiteList().then(res => {
                let data = res.data.data,
                    tableData = lodashGet(data, 'whitelist', []),
                    tableDataLen = tableData.length;
                    
                // 创建唯一表示用于增加修改和删除
                for (let i = 0; i < tableDataLen; i++) {
                    tableData[i].id = i;
                }

                this.tableData = tableData;
                if (this.$refs.table) {
                    this.$refs.table.loadData(tableData);
                }
                if (enableTips) {
                    this.$ok(_('取消成功'));
                }
            });
        },
        confirm (title, msg, btns, fun) {

            // 通用提示框
            let confirm = this.$confirm({
                title: title || _('提示'),
                msg: msg || _('错误信息'),
                icon: 'question',
                autoClose: false,
                buttons: btns,
                afterShowFocus: false,
                callback: (actionName) => {

                    // 有些提示需要点击，确定后才销毁
                    if (actionName === 'ok' && typeof fun === 'function') {
                        confirm.destroy();
                        confirm = null;
                        fun();
                        return;
                    }
                    confirm.destroy();
                    confirm = null;
                }
            });
        },
        changeData (type, index) { 
            
            // 新增和编辑
            let that = this,
                len = 20,
                title = type === 'add' ? _('新增IP地址') : _('编辑IP地址');
            
            if (type === 'add' && this.tableData.length >= len) {
                this.confirm(CONFIRM.limitTitle, CONFIRM.limitMsg, CONFIRM.limitBtns);
                return;
            }
            this.Modal = this.$modal(SystemSetEdit, {
                title: title,
                afterShowFocus: false,
                submit: function () {
                    let winThis = this,
                        formRoot = winThis.formRoot,
                        formValues = formRoot.getJsonValue(),
                        form = formRoot.$refs.form,
                        tableData =  that.tableData,
                        tableDataLen = tableData.length;

                    if (!form.isValid()) {
                        return;
                    }

                    // 校验列表是否存相同的IP段
                    for (let i = 0; i < tableDataLen; i ++) {
                        if (formValues.ip === tableData[i].ip) {

                            // 是增加的情况直接返回错误，编辑的情况校验值只修改描述的情况
                            if (type === 'add' || tableData[index].ip !== formValues.ip) {
                                that.$showWarn(_('此IP地址已经存在，请勿重复添加'));
                                return;
                            }
                        }
                    }
                    if (type === 'add') {
                        
                        // 增加
                        if (tableDataLen > 0) {
                            formValues.id = tableData[tableDataLen - 1].id + 1;
                        } else {
                            formValues.id = 0;
                        }
                        tableData.push(formValues);
                    } else { 
                        
                        // 编辑
                        Object.assign(tableData[index], formValues);
                    }
                    that.$refs.table.loadData(tableData);
                    that.Modal.destroy();
                    that.Modal = null;
                },
                cancel: function () {
                    that.Modal.destroy();
                    that.Modal = null;
                }
            });
            if (type === 'edit') {
                this.Modal.setData({
                    params: {
                        ip: that.tableData[index].ip,
                        note: that.tableData[index].note
                    }
                });
            }
            this.Modal.open();
        },

        // 单个删除
        delRow (index) {
            this.confirm(CONFIRM.delTiTle, CONFIRM.delMsg, CONFIRM.delBtns, () => {  
                this.tableData.splice(index, 1);
            });
        },
        
        // 批量删除
        delRows () {
            this.confirm(CONFIRM.delTiTle, CONFIRM.delMsg, CONFIRM.delBtns, () => {    
                let delData = this.$refs.table.getSelections(),
                    tableData = this.tableData,
                    tableDatLen = tableData.length,
                    ids = [],
                    newTableData = [];

                // 相等的情况下直接清空数组
                if (tableDatLen === delData.length) {
                    tableData.splice(0, tableDatLen);
                    this.$refs.table.loadData(tableData);
                    return;
                }
                
                // 获取删除id
                delData.map(item => {
                    ids.push(item.id);
                });

                // 保存无需删除的数据
                tableData.map(item => {
                    if (ids.indexOf(item.id) === -1) {
                        newTableData.push(item);
                    }
                });
                
                // 清空数组后重新赋值
                tableData.splice(0, tableDatLen);
                Object.assign(tableData, newTableData);
                this.$refs.table.loadData(tableData);
            });
        },

        // 保存系统设置
        setLogWhiteList () {
            let whiteList = [];
            
            // 筛选不必要的参数
            this.tableData.map(item => {
                let whiteObj = {};
                whiteObj.ip = item.ip;
                whiteObj.note = item.note;
                whiteList.push(whiteObj);
            });
            setLogWhiteList({
                whitelist: whiteList
            }).then(() => {
                this.$ok(_('保存成功'));
            });
        },

        // 取消系统设置
        cancelLogWhiteList () {
            this.loadData(true);
        }
    }
};
</script>

<style lang="postcss">
.system_setting-list-wrapper {
    & .system_setting__form {
        padding: 24px 32px;
        box-sizing: border-box;
        & .system_setting__head {
            font-size: 14px;
            & .system_setting__title {
                font-weight: bold;
                color: #495060;
                letter-spacing: 0;
                border-left: 3px solid var(--tab-border-color);
                padding-left: 8px;
                margin-bottom: 24px;
                display: inline-block;
                padding-right: 2px;
            }
            & .system_setting__subtitle {
                margin-bottom: 16px;
            }
        }
        & .system_setting__table {
            width: 800px;
            margin: 0px;
            border: 1px solid #ddd;
        }
    }
}
</style>
