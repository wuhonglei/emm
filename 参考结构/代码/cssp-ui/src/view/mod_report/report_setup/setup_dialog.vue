<template>
    <div class="setup-wrapper">
        <el-dialog
            v-if="dialogVisible"
            v-model="dialogVisible"
            custom-class="cssp-dialog-search">
            <span slot="title">编辑报表策略</span>
            <div v-loading="loading">
                <el-form 
                    v-model="formValid"
                    label-width="120px"
                    :rules="rules"
                    :model="form">
                    <el-form-item
                        label="报表策略权限："
                        prop="uuid">
                        <el-switch 
                            v-model="allSwitch"
                            size="small" 
                            on-text="" 
                            off-text=""
                            :width="50"
                            class="setup-switch" />
                    </el-form-item>
                    <el-form-item
                        label="名称：">
                        <span
                            :class="isDisabledClass">
                            {{ rowData.report_name }}
                        </span>
                    </el-form-item>
                    <el-form-item
                        label="报表类型："
                        prop="selectType">
                        <el-checkbox-group v-model="form.selectType">
                            <el-checkbox 
                                v-for="item in types"
                                :key="item.key" 
                                :label="item.key" 
                                :disabled="(rowData.temp_type === 'tp' && item.key !== 'day') || !allSwitch"
                                class="setup-item">
                                {{ item.value }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item
                        label="数据来源：">
                        <span
                            :class="isDisabledClass">
                            {{ rowData.temp_name }}
                        </span>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button type="primary"
                           :disabled="loading || !formValid"
                           @click="submitSetup">确定</el-button>
                <el-button 
                    :disabled="loading"
                    @click="dialogVisible = !dialogVisible">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

/** 
 * 报表设置
*/

import dialog from 'src/common/mixins/dialog';
import { REPORT_TYPE } from 'src/utils/consts';
import { setReportConfList } from 'src/common/api/report';

import rules from './setup_rule';

export default {
    mixins: [dialog],
    data () {
        return {
            types: REPORT_TYPE,
            dialogVisible: false,
            allSwitch: false,
            rowData: {},
            loading: false,
            formValid: false,
            rules: rules,
            form: {
                selectType: []
            }
        };
    },

    computed: {
        isDisabledClass () {
            return this.allSwitch ? '' : 'is-disabled';
        }
    },

    watch: {
        allSwitch () {
            this.handleState();
        }
    },

    methods: {
        handleOpen (payload = {}) {
            this.dialogVisible = true;
            this.allSwitch = payload.all_switch ? true : false;
            this.form.selectType = payload.selectType;
            this.rowData = payload;
            this.loading = false;
            this.handleState();
        },

        handleState () {
            if (this.allSwitch) {
                if (this.form.selectType && this.form.selectType.length > 0) {
                    this.formValid = true;
                } else {
                    this.formValid = false;
                }
            } else {
                this.formValid = true;
            }
        },

        submitSetup () {
            this.loading = true;
            let params = [{
                report_type: this.form.selectType,
                report_name: this.rowData.report_name,
                temp_uuid: this.rowData.temp_uuid,
                all_switch: this.allSwitch
            }];
            setReportConfList(params)
                .then((res) => {
                    if (res.data) {
                        this.$message.success({
                            message: '报表设置编辑成功'
                        });
                        this.$emit('refresh');
                        this.dialogVisible = false;
                    }
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '报表设置编辑失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        }

    }
}; 
</script>
<style lang="postcss">
   .setup-wrapper {
       & .cssp-dialog-search {
            width: 540px;
        }
        & .el-dialog__body {
            padding: 24px 33px;
            & .el-form-item__content {
                display: flex;
            }
            & .is-disabled {
                color: #ccc;
            }
            & .setup-switch {
                margin-top: 5px;
            }
        }
   }
</style>
