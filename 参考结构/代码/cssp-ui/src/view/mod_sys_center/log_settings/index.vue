<template>
    <div
        v-loading="loading"
        class="log-config-wrapper query second-page">
        <el-form
            v-model="formValid"
            :rules="rules"
            :model="params">
            <div class="query__title">
                自动删除日志
            </div>
            <div class="query__content form">
                <div class="bar__content">
                    <div class="bar">
                        <div
                            class="bar__inner"
                            :style="{width: partInfo.used_proport + '%'}"></div>
                    </div>
                    <div class="ratio">
                        {{ partInfo.used_proport }}%
                    </div>
                    <div class="legend">
                        <div class="legend__item">
                            <div class="square">
                            </div>数据存储已使用空间：{{ partInfo.used }}G
                        </div>
                        <div class="legend__item">
                            <div class="square free"></div>
                            数据存储剩余空间：{{ distFreeSpace }}G
                        </div>
                    </div>
                </div>
                <el-row> 
                    <el-checkbox 
                        v-model="params.enableDiskRatio"
                        :disabled="true">
                        <lang class="disk-ratio-check-text">
                            磁盘占用空间超过此比例则自动删除最早一天日志
                        </lang>
                    </el-checkbox>
                </el-row>
                <el-row> 
                    <div class="label">
                        磁盘最大占用比例：
                    </div>
                    <div class="content unit__form">
                        <el-form-item prop="percent">
                            <el-input
                                v-model="params.percent"
                                :disabled="!params.enableDiskRatio" />
                        </el-form-item>
                        <div class="unit__suffix">
                            %
                        </div>
                    </div>
                </el-row>
                <el-row> 
                    <el-checkbox v-model="params.enablePreserveTime">
                        自动删除此天数前的日志
                    </el-checkbox>
                </el-row>
                <el-row> 
                    <div class="label">
                        最长保留天数：
                    </div>
                    <div class="content unit__form">
                        <el-form-item prop="outdays">
                            <el-input
                                v-model="params.outdays"
                                :disabled="!params.enablePreserveTime" />
                        </el-form-item>
                        <div class="unit__suffix">
                            天
                        </div>
                    </div>
                </el-row>
            </div>
            <div class="query__title bt">
                日志导出设置
            </div>
            <div class="query__content form">
                <el-row> 
                    <div class="label">
                        日志列表最多只能导出最近：
                    </div>
                    <div class="content unit__form">
                        <el-form-item prop="logQueryLimit">
                            <el-input v-model="params.logQueryLimit" />
                        </el-form-item>
                        <div class="unit__suffix">
                            条
                        </div>
                    </div>
                </el-row>
            </div>
        </el-form>
        <el-button
            type="primary"
            :disabled="!formValid"
            @click="submit">
            保存
        </el-button>
    </div>
</template>
<script>

/**
 * 日志设置模块
 */

import { loadLogConfig, updateLogConfig } from 'src/common/api/log';
import ValidStore from 'src/utils/valid_store';
import rules from './rules';
import { toFixed } from 'src/utils/util';
import { DEF_TOFIXED_LEN } from 'src/utils/consts';

export default {
    data () {
        return {
            loading: false,
            formValid: true,
            serverCache: {},
            params: {
                percent: 90,
                outdays: 60,
                enableDiskRatio: true,
                enablePreserveTime: true,
                logQueryLimit: 10000
            },
            oriOutDays:'',
            oriPercent:'',
            rules
        };
    },

    computed: {
        partInfo () {
            return this.serverCache.part_info || {
                used_proport: 0,
                used: 0,
                all: 0
            };
        },
        distFreeSpace () {
            return toFixed((this.partInfo.all - this.partInfo.used), DEF_TOFIXED_LEN);
        }
    },

    watch: {
        'params.autoDeleteType' (v) {
            if (v === 0) {
                this.params.outdays = this.oriOutDays;
            } else {
                this.params.percent = this.oriPercent;
            }
        }
    },

    mounted () {
        this.loadData();
    },

    beforeDestroy () {
        ValidStore.clearAll();
    },

    methods: {
        loadData () {
            this.loading = true;

            loadLogConfig()
                .then((res) => {
                    if (!res.data) {
                        return;
                    };
                    let rs = res.data.data;
                    this.serverCache = rs;
                    this.params.enableDiskRatio = rs.log_del.model.enable_disk_ratio;
                    this.params.enablePreserveTime = rs.log_del.model.enable_preserve_time;
                    this.params.percent = rs.log_del.ratio.toString();
                    this.params.outdays = rs.log_del.days.toString();
                    this.oriOutDays = this.params.outdays;
                    this.oriPercent = this.params.percent;
                    this.params.logQueryLimit = rs.log_export.max_sum.toString();
                    ValidStore.set('maxDay', rs.log_del.max_days);
                    ValidStore.set('minDay', rs.log_del.min_days);
                    ValidStore.set('maxRatio', rs.log_del.max_ratio);
                    ValidStore.set('minRatio', rs.log_del.min_ratio);
                    ValidStore.set('maxExport', rs.log_export.default_max_sum);
                })
                .catch((err) => {
                    this.$error(err, '获取日志设置失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        resolvedSubmitData () {
            return {
                log_export: {
                    max_sum: parseInt(this.params.logQueryLimit, 10),
                    default_max_sum: this.serverCache.log_export.default_max_sum
                },
                log_del : {
                    model : {
                        enable_disk_ratio: this.params.enableDiskRatio,
                        enable_preserve_time: this.params.enablePreserveTime
                    },
                    ratio : parseInt(this.params.percent, 10),
                    min_ratio : this.serverCache.log_del.min_ratio,
                    max_ratio : this.serverCache.log_del.max_ratio,
                    days : parseInt(this.params.outdays, 10),
                    min_days : this.serverCache.log_del.min_days,
                    max_days : this.serverCache.log_del.max_days
                }
            };
        },

        submit () {
            let params = this.resolvedSubmitData();
            this.loading = true;
            updateLogConfig(params)
                .then(() => {
                    this.loadData();
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                })
                .catch((err) => {
                    this.$error(err, '提交失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

<style lang="postcss">
.log-config-wrapper {
    & .label {
        width: 160px;
        float: left;
        padding-left: 23px;
    }
    & .content {
        width: 200px;
        float: left;
    }
    & .disk-ratio-check-text {
        color: #000;
    }
    & .unit__form{
        position: relative;
        & .el-input__inner{
            padding-right: 42px;
        }
        & .unit__suffix{
            position: absolute;
            top: 0;
            right: 6px;
            color: #999;
        }
    }
    & .bar__content {
        width: 450px;
        position: relative;
        margin-top: 10px;
    }
    & .bar{
        height: 14px;
        background: #E1E9F0;
        & .bar__inner{
            height: 100%;
            background: #1ABFBF;
            width: 0;
            transition: width 1s ease;
        }
    }
    & .ratio{
        position: absolute;
        right: -45px;
        top: -11px;
        color: #0FB3B3;
    }
    & .legend{
        margin-top:6px;
        & .legend__item{
            display: inline-block;
            margin-right: 40px;
        }
        & .square{
            width: 14px;
            height: 14px;
            background: #1abfbf;
            display: inline-block;
            vertical-align: sub;
            margin-right: 8px;
            &.free{
                background: #E1E9F0;
            }
        }
    }
}
</style>

