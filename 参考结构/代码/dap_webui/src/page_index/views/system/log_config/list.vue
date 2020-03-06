<template>
    <div class="log-config-list-wrapper h-100">
        <div class="log-config__space">
            <div
                ref="echarts" 
                class="log-config__echarts"></div>
            <div class="log-config__info">
                <div class="log-config__table">
                    <div class="log-config__cell">
                        <lang>总容量</lang>
                    </div>
                    <div class="log-config__cell log-config__spaceTotal">
                        {{ form.spaceTotal }}GB
                    </div>
                </div>
                <div class="log-config__table">
                    <div class="log-config__cell">
                        <lang>剩余容量</lang>
                    </div>
                    <div :class="{'log-config__used--tigger': isUsedRed}"
                         class="log-config__cell log-config__used">
                        {{ formatNumber(form.spaceTotal - form.spaceUsed) }}GB
                    </div>
                </div>
            </div>
        </div>
        <sf-form
            ref="form">
            <div class="log-config__title">
                <lang>日志存储设置：</lang>
            </div>
            <div class="log-config__set">
                <lang>最大占用磁盘空间百分比：</lang>
                <sf-numberfield
                    v-model="form.maxSpacePer"
                    :allow-blank="false"
                    :allow-decimals="false"
                    :min-value="30"
                    :max-value="90"
                    :default-width="80" />&nbsp;%
                <span class="log-config__tip">
                    <lang>（限制日志最大占用磁盘空间比例，超过该比例将自动删除最早一天的日志）</lang>
                </span>
            </div>
            <div class="log-config__setlast">
                <lang>期望保留天数：</lang>
                <sf-numberfield
                    v-model="form.logKeepDays"
                    :allow-blank="false"
                    :allow-decimals="false"
                    :min-value="1"
                    :max-value="1095"
                    :default-width="80" />&nbsp;<lang>天</lang>
                <span class="log-config__tip">
                    <lang>（超过该天数将自动删除最早一天的日志）</lang>
                </span>
                <p 
                    v-show="keepDaysTip"
                    class="log-config__daytips">
                    <lang>重要提醒：根据《网络安全法》规定，留存网络日志不能少于6个月。</lang>
                </p>
            </div>
            <div class="log-config__title">
                <lang>日志导出设置：</lang>
            </div>
            <div>
                <lang>查询日志最多只能导出：</lang>
                <sf-numberfield
                    v-model="form.exportLimit"
                    :allow-blank="false"
                    :allow-decimals="false"
                    :min-value="1"
                    :max-value="1000000"
                    :default-width="100" />&nbsp;<lang>条日志</lang>
                <span class="log-config__tip">
                    <lang>（导出大量日志时会占用较多内存，如果导出失败，请降低该值后重试）</lang>
                </span>
            </div>
        </sf-form>
        <div class="form-submit-line">
            <sf-button-primary
                class="mr24"
                @click="saveLogConfig">
                保存
            </sf-button-primary>
            <sf-button @click="cancelLogConfig">
                取消
            </sf-button>
        </div>
    </div>
</template>
<script>

/** 日志配置 */


import echarts from 'echarts';
import { getLogConfig, setLogConfig } from 'src/api/system_manage';

const WARNINGOBJ = {
    warnMin: 180
};
const ECHARTARR = {
    storage: _('已使用容量'),
    remainder: _('剩余容量')
};
export default {
    data () {
        return {
            form: {
                maxSpacePer: 85,
                exportLimit: 100000,
                logKeepDays: 180,                   
                spaceTotal: 0,
                spaceUsed: 0
            },
            keepDaysTip: false,
            isUsedRed: false
        };
    },
    watch: {
        'form.logKeepDays': function (val) {
            if (val < WARNINGOBJ.warnMin || !val) {
                this.keepDaysTip = true;
                return;
            }
            this.keepDaysTip = false;
        }
    },
    mounted () {
        this.loadData(false);
    },
    methods: {

        // 查询日志配置
        loadData (enableTips) {
            getLogConfig().then(res => {
                let obj = res.data.data;
                obj.spaceTotal = this.formatNumber(obj.spaceTotal);
                obj.spaceUsed = this.formatNumber(obj.spaceUsed);
                Object.assign(this.form, obj);
                this.$nextTick(() => {
                    this.initEcharts(obj.spaceTotal, obj.spaceUsed);
                });
                if (enableTips) {
                    this.$ok(_('取消成功'));
                }
            });
        },
        
        // 初始化内存图标
        initEcharts (spaceTotal, spaceUsed) {
            let num = 100,
                redNum = 80,
                spaceRemain = this.formatNumber(spaceTotal - spaceUsed), // 剩余空间
                spaceUsedPercent = this.formatNumber(spaceUsed / spaceTotal * num); // 已使用百分比
            this.isUsedRed = spaceUsedPercent > redNum ? true : false;
            let echartsOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}GB ({d}%)',
                    position: 'right'
                },
                series: [{
                    name: _('存储容量'),
                    type: 'pie',
                    radius: ['60%', '70%'],
                    center: ['50%', '50%'],
                    color: spaceUsedPercent > redNum ? ['#e55', '#d5dfe7'] : ['#4d8dd9', '#d5dfe7'],
                    hoverAnimation: false,
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: spaceUsed, name: ECHARTARR.storage},
                        {value: spaceRemain, name: ECHARTARR.remainder}
                    ]
                }],
                title: {
                    text: spaceUsedPercent + '%',
                    left: 'center',
                    top: '40%',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: 16
                    }
                },
                graphic: [{
                    type: 'text', 
                    left: 'center',
                    top: '60%',
                    style: {
                        text: _('已使用容量'),
                        textAlign: 'center',
                        fontSize: 11
                    }
                }]
            };
            let dom = this.$refs.echarts;
            if (dom) {            
                let chart = echarts.init(dom);
                chart.setOption(echartsOption, true);
            }
        },
        
        // 保存日志配置
        saveLogConfig () {
            let form = this.$refs.form;
            if (!form.isValid()) {
                return;
            }
            setLogConfig({
                maxSpacePer: this.form.maxSpacePer,
                logKeepDays: this.form.logKeepDays,
                exportLimit: this.form.exportLimit
            }).then(() => {
                this.$ok(_('保存成功'));
            });
        },

        // 取消日志配置
        cancelLogConfig () {
            this.loadData(true);
        },
        
        // 数字保留2位小数
        formatNumber (floatNum) {
            let len = 2;
            if (typeof floatNum !== 'number') {
                floatNum = parseFloat(floatNum);
            }
            
            return Number.isNaN(floatNum) ? 0 : floatNum.toFixed(len);
        }
    }
};
</script>

<style lang="postcss">
.log-config-list-wrapper {
    overflow-x: hidden;
    & .log-config__space {
        position: relative;
        border-bottom: 1px solid #ddd;
        & .log-config__echarts {
            height: 180px;
            width: 200px;
            margin: 0px;
        }
        & .log-config__info {
            position: absolute;
            top: 60px;
            left: 210px;
            font-size: 12px;
            color: #5B7187;
            & .log-config__table {
                margin-bottom: 16px;
                & .log-config__cell {
                    display: table-cell;
                    vertical-align: middle;
                    color: #303d5c;
                }
                & .log-config__used {
                    font-size: 17px;
                    font-weight: bold;
                    padding-left: 10px;
                    color: #303d5c;
                }
                & .log-config__used.log-config__used--tigger {
                    color: #e55;
                }
                & .log-config__spaceTotal {
                    font-size: 17px;
                    color: #303D5C;
                    font-weight: bold;
                    padding-left: 10px;
                }
            }
        }
    }
    & .log-config__title {
        font-size: 14px;
        font-weight: bold;
        color: #495060;
        letter-spacing: 0;
        border-left: 3px solid var(--tab-border-color);
        padding-left: 8px;
        margin-bottom: 24px;
    }
    & .log-config__set {
        margin-bottom: 16px;
    }
    & .log-config__daytips {
        margin-top: 10px;
        color: red;
    }
    & .log-config__setlast {
        margin-bottom: 24px;
    }
    & .log-config__tip {
        color: #999;
    }
}
</style>
