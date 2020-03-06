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
                    :rules="rules"
                    :model="params">
                    <el-form-item
                        label="严重等级："
                        prop="level">
                        <el-select
                            v-model="params.level"
                            class="search-content-item"
                            no-data-text="没有等级数据">
                            <el-option label="全部" 
                                       value="" />
                            <el-option
                                v-for="item in levelList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key" />
                        </el-select>
                    </el-form-item>
                   
                    <el-form-item
                        label="状态："
                        prop="deal_status">
                        <el-select
                            v-model="params.deal_status"
                            class="search-content-item">
                            <el-option
                                v-for="item in dealStatusList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key" />
                        </el-select>
                    </el-form-item>

                    <el-form-item
                        label="时间范围："
                        prop="start_time">
                        <div class="time-range">
                            <el-date-picker
                                ref="start_time"
                                v-model="params.start_time"
                                type="datetime"
                                placeholder="选择开始时间"
                                :editable="false"
                                :picker-options="pickerBeginDateBefore"
                                class="search-time-item" />
                            <span>至</span>
                            <el-date-picker
                                v-model="params.end_time"
                                type="datetime"
                                :editable="false"
                                :picker-options="pickerBeginDateAfter"
                                placeholder="选择结束时间" 
                                class="search-time-item" />
                        </div>
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
import { LEVELLIST, DEALSTATUS } from 'src/utils/consts';
import dayjs from 'dayjs';

export default {
    mixins: [dialog],
    data () {
        return {
            params: {
                level: '',
                deal_status: '0',
                start_time: '',
                end_time: ''
            },
            dealStatusList: DEALSTATUS,
            levelList: LEVELLIST,
            formValid: false,
            isDetectingFile: false,
            pickerBeginDateBefore: {
                disabledDate: (time) => {
                    let beginDateVal = this.params.end_time;
                    if (beginDateVal) {
                        return time.getTime() > beginDateVal;
                    }
                }
            },
            pickerBeginDateAfter: {
                disabledDate: (time) => {
                    let beginDateVal = this.params.start_time;
                    if (beginDateVal) {
                        return time.getTime() < dayjs(beginDateVal).subtract(1, 'day').add(1, 'second');
                    }
                }
            },
            rules: {
                start_time: {
                    trigger: 'change',
                    validator: this.checkIsLtEnd
                }
            }
        };
    },

    methods: {

        // 初始化弹框数据
        init (payload = {}) {
            this.params.level = payload.level || '';
            this.params.deal_status = payload.deal_status || '0';
            this.params.start_time = payload.start_time || '';
            this.params.end_time = payload.end_time || '';
        },

        handleOpen (payload = {}) {
            this.dialogVisible = true;
            this.init(payload);
        },

        // 提交搜索
        submit () {
            this.dialogVisible = false;
            this.$emit('confirm', this.params);
        },

        // 检测开始结束时间
        checkIsLtEnd (rule, value, callback) {
            if (!this.timeRangeIsOk() && this.params.end_time) {
                this.formValid = true;
                return callback(new Error('开始时间不能大于结束时间！'));
            }
            this.formValid = false;
            callback();
        },

        timeRangeIsOk () {
            if (!this.params.start_time) {
                return true;
            }
            return this.params.start_time <= this.params.end_time;
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
    
</style>
