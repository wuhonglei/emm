<template>
    <div class="dioalog-search-wrapper">
        <el-dialog
            v-if="dialogVisible"
            v-model="dialogVisible"
            custom-class="cssp-dialog-search">
            <span slot="title">更多筛选</span>
            <div v-loading="loading">
                <el-form
                    label-width="100px"
                    :model="params">
                    <el-form-item
                        label="报表类型："
                        prop="temp_type">
                        <el-select
                            v-model="params.temp_type"
                            class="search-content-item"
                            no-data-text="没有类型数据">
                            <el-option label="全部" 
                                       value="" />
                            <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.key"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                   
                    <el-form-item
                        label="数据来源："
                        prop="uuid">
                        <el-select
                            v-model="params.uuid"
                            class="search-content-item">
                            <el-option label="全部" 
                                       value="" />
                            <el-option
                                v-for="item in sourceList"
                                :key="item.value"
                                :label="item.key"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item
                        label="时间范围："
                        prop="start_time">
                        <sf-datefield v-model="params.timeRange" 
                                      class="search-content-item"
                                      type="range" 
                                      placeholder="请选择时间范围" />
                    </el-form-item>
                </el-form>
            </div><span slot="footer">
                <el-button class="footer-btn-left"
                           @click="init">重置</el-button>
                <el-button type="primary"
                           :disabled="formValid"
                           @click="submit">确定</el-button>
                <el-button @click="dialogVisible = !dialogVisible">取消</el-button></span>
        </el-dialog>
    </div>
</template>

<script>

/** 
 * 搜索弹窗
*/

import dialog from 'src/common/mixins/dialog';

import { getReportFilterCriteria } from 'src/common/api/report';

export default {
    mixins: [dialog],
    data () {
        return {
            params: {
                temp_type: '',
                uuid: '',
                timeRange: { 
                    start: '', 
                    end: '' 
                }
            },
            sourceList: [],
            typeList: [],
            formValid: false
        };
    },

    mounted () {
        this.getReportFilterCriteria();
    },

    methods: {

        // 初始化弹框数据
        init (payload = {}) {
            this.params.temp_type = payload.temp_type || '';
            this.params.uuid = payload.uuid || '';
            this.params.timeRange = {
                start: payload.timeRange ? payload.timeRange.start : '',
                end: payload.timeRange ? payload.timeRange.end : ''
            };
        },

        handleOpen (payload = {}) {
            this.dialogVisible = true;
            this.init(payload);
        },

        // 提交搜索
        submit () {
            this.dialogVisible = false;
            this.$emit('load-data');
        },

        getReportFilterCriteria () {
            getReportFilterCriteria()
                .then((res) => {
                    this.sourceList = res.data.data.temp_data || [];
                    this.typeList = res.data.data.temp_type || [];
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '数据获取失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
}; 
</script>
<style lang="postcss">
    .dioalog-search-wrapper {
        & .cssp-dialog-search {
            width: 540px;
        }
        & .el-dialog__body {
            padding: 24px 33px;
            & .el-form-item__content {
                display: flex;
            }
        }
        & .search-content-item {
            flex-grow: 1;
        }
        & .time-range {
            display: flex;
            justify-content: space-between;
        }
        & .footer-btn-left {
            float: left;
        }
        & .search-time-item {
            width: 45%;
        }
    }
    
    .sfv-datefield_layer {
        z-index: 9999 !important;
    }
</style>
