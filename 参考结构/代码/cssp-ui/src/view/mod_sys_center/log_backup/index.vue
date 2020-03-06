<template>
    <div
        v-loading="loading || policyLoading"
        class="backup-wrapper query second-page">
        <div class="query__title">
            FTP参数
        </div>
        <div class="query__content">
            <p>配置FTP参数，连接FTP服务器即可进行自动备份</p>
            <el-button
                size="small"
                type="primary"
                @click="showFtpConfig">
                配置FTP服务器
            </el-button>
            <ftp-config
                ref="ftpDialog"
                :default-params="params"
                :back-policy="interval"
                @load-ftp-config="loadData"
                @success="ftpSubmit" />
        </div>
        <div class="query__title bt">
            手动备份日志
        </div>
        <div class="query__content">
            <el-button
                size="small"
                type="primary"
                :disabled="backupDisabled"
                @click="confirmBackup">
                立即备份
            </el-button>
        </div>
        <div class="query__title bt">
            自动备份日志
        </div>
        <div class="query__content form">
            <div class="form__label">
                备份策略
            </div>
            <div class="form__content">
                <el-select
                    v-model="interval.week"
                    :disabled="backupDisabled"
                    size="small"
                    style="width: auto"
                    @change="handlePolicyChange">
                    <el-option
                        label="每天"
                        :value="0" />
                    <el-option
                        label="星期一"
                        :value="1" />
                    <el-option
                        label="星期二"
                        :value="2" />
                    <el-option
                        label="星期三"
                        :value="3" />
                    <el-option
                        label="星期四"
                        :value="4" />
                    <el-option
                        label="星期五"
                        :value="5" />
                    <el-option
                        label="星期六"
                        :value="6" />
                    <el-option
                        label="星期天"
                        :value="7" />
                </el-select>
                <div class="form__split"></div>
                <el-time-select
                    v-model="interval.time"
                    :editable="false"
                    :clearable="false"
                    size="small"
                    :disabled="backupDisabled"
                    :picker-options="pickerOptions"
                    @change="handlePolicyChange" />
            </div>
        </div>
    </div>
</template>


<script>

/**
 * 日志备份模块 
 */

import { 
    loadBackupConfig,
    updateBackupConfig,
    immediateBackup

} from 'src/common/api/manage';
import rules from './rules';
import ftpConfig from './ftp_config';
export default {
    components: {ftpConfig},
    data () {
        return {
            loading: false,
            policyLoading: false,
            formValid: true,
            policyUpdate: false, //标识备份策略是否再次更新
            backupDialog: false,
            params: {
                dir: '',
                ip: '',
                pwd: '',
                user: ''
            },
            interval: {
                week: 0,
                time: '01:00'
            },
            pickerOptions: {
                step: '01:00',
                start: '00:00',
                end: '23:00' 
            },
            rules,
            backupDisabled: false
        };
    },

    mounted () {
        this.loadData();
    },

    methods: {
        loadData () {
            this.loading = true;
            loadBackupConfig()
                .then((res) => {
                    if (!res.data || !res.data.data) {
                        return;
                    }
                    let rs = res.data.data;
                    this.interval =  {
                        week: rs.back_policy.week || 0,
                        time: rs.back_policy.time || '00:00'
                    };
                    this.params = rs.ftp_param;
                    this.backupDisabled = this.handleNoFtpConfig(rs.ftp_param);
                })
                .catch((err) => {
                    this.$error(err, '获取配置失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleNoFtpConfig (data) {
            return Object.values(data).every(item => {
                return !item;
            });
        },

        showFtpConfig () {
            this.$refs.ftpDialog.show();
        },

        ftpSubmit (params) {
            this.params = {...params};
        },

        confirmBackup () {
            this.$confirm('备份后，会自动下发任务，需要一定时间，请耐心等候', `确定要立即备份吗？`, {
                type: 'warning'
            })
                .then(() => {
                    this.backup();
                })
                .catch(() => {});
        },

        backup () {
            this.backupDialog = false;
            this.loading = true;
            immediateBackup()
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '任务已经下发，请在操作日志中查看任务结果'
                    });
                })
                .catch((err) => {
                    this.$error(err, '提交失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handlePolicyChange () {
            this.policyUpdate = true;
            if (this.policyLoading || this.loading) {
                return;
            }
            this.updatePolicy();
        },

        resolveSubmitData () {
            return {
                back_policy: {...this.interval},
                ftp_param: {...this.params}
            };
        },

        updatePolicy () {
            let params = this.resolveSubmitData();
            this.policyLoading = true;
            this.policyUpdate = false;
            updateBackupConfig(params)
                .then(() => {
                    if (this.policyUpdate) {
                        return;
                    }
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                })
                .catch((err) => {
                    if (this.policyUpdate) {
                        return;
                    }
                    this.$error(err, '提交失败');
                })
                .finally(() => {
                    if (this.policyUpdate) {

                        //  加载时值发生了改变
                        this.updatePolicy();
                        return;
                    }
                    
                    this.policyLoading = false;
                });
        }
    }
};
</script>

<style lang="postcss">
.backup-wrapper {
    & .backup-dialog {
        width: 550px;
    }
}
</style>
