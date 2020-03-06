<template>
    <section class="info-bar-chart__wrapper">
        <div 
            ref="chart"
            class="info-bar-chart__chart"></div>
    </section>
</template>
<script>

/**
 * @file 柱状图
 */

import Echarts from 'echarts';
import resize from 'src/utils/resize';
import optionFac from './chart_options';

export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            chart: null,
            resizeId: null
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
        }
    },
    mounted () {
        this.initChart();
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

        // 设置echarts
        setChartOptions () {
            if (!this.data) {
                return;
            }
            this.chart.setOption(optionFac(this.data));
        }
    }
};
</script>
<style lang="postcss">
.info-bar-chart__wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    & .info-bar-chart__chart {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
