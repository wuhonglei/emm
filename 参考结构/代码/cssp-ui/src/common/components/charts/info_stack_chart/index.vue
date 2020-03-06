<template>
    <section class="info-stack-chart__wrapper">
        <div 
            ref="chart"
            class="info-stack-chart__chart"></div>
    </section>
</template>
<script>

/**
 * @file 柱状图
 */

import Echarts from 'echarts';
import resize from 'src/utils/resize';
import optionFac from './chart_options';

const LEVEL_PARAM_MAP = {
    lost: 'lost',
    high: 'high',
    middle: 'middle',
    low: 'low',
    info: 'info'
};

export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        levels: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            chart: null,
            resizeId: null,
            levelChanged: false
        };
    },
    watch: {
        data: {
            deep: true,
            handler (v) {
                if (v) {
                    this.$nextTick(() => {
                        this.setChartOptions();
                    });
                }
            }
        },
        levels (v, old) {
            this.compareLevel(v, old);
        }
    },
    mounted () {
        this.initChart();
        this.initChartEvts();
        this.$nextTick(() => {
            this.setChartOptions();
        });
        this.bindResizeCb();
    },
    beforeDestroy () {
        this.unbindResizeCb();
        this.destroyChart();
    },
    methods: {
        initChart () {
            if (!this.$refs.chart) {
                return;
            }

            this.chart = Echarts.init(this.$refs.chart);
        },

        initChartEvts () {
            if (!this.chart) {
                return;
            }

            this.chart.on('click', (params) => {
                this.handleChartClick(params);
            });
        },

        handleChartClick (params) {
            if (params.componentType !== 'series') {
                return;
            }
            
            let item = this.data[params.dataIndex];
            let query = {
                search: item.ip,
                level: LEVEL_PARAM_MAP[params.seriesId] || '',
                deal_status: '0'
            };
            this._redirectToAlarm(query);
        },

        _redirectToAlarm (query) {
            this.$router.push({
                name: 'emergencyEvt',
                query
            });
        },

        destroyChart () {
            if (this.chart) {
                this.chart.dispose();
            }
        },

        bindResizeCb () {
            this.resizeId = resize.pushCb(() => {
                this.chart && this.chart.resize();
            });
        },
        unbindResizeCb () {
            resize.popCb(this.resizeId);
        },

        // 对比前后的level是否有变化
        compareLevel (level1 = [], level2 = []) {
            if (
                level1.length === level2.length &&
                level1.every(l => level2.findIndex(_l => _l === l) > -1)
            ) {
                this.levelChanged = false;
            } else {
                this.levelChanged = true;
            }
        },

        // 设置echarts
        setChartOptions () {
            if (!this.data) {
                return;
            }

            // 当level有变化的时候需要重新初始化饼图，否则对应的serious显示不出来
            if (this.levelChanged) {
                this.levelChanged = false;
                this.chart.dispose();
            }

            this.initChart();
            this.initChartEvts();
            this.chart.setOption(optionFac(this.data, this.levels));
        }
    }
};
</script>
<style lang="postcss">
.info-stack-chart__wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    & .info-stack-chart__chart {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
