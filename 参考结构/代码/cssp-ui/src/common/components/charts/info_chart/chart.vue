<template>
    <section class="info-chart__wrapper">
        <div class="info-chart__mid">
            <slot name="info"
                  :info="info"
                  :chart="chart"
                  :data="data">
                <div class="info">
                    <span class="info__num"
                          :style="{color: info.color}">{{ info.value }}</span>
                    <span class="info__title ellipsis">{{ info.label }}</span>
                </div>
            </slot>
        </div>
        <div ref="chart"
             class="info-chart__chart"></div>
    </section>
</template>
<script>

/**
 * @file 信息饼图
 */

import Echarts from 'echarts';
import resize from 'src/utils/resize';
import optionFac from './chart_options';
import { filterNumUnit } from 'src/common/lib/filters';

const MIN_ANGLE_PERCENTAGE = 0.028;

export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        totalLabel: {
            type: String,
            default: '总数'
        },
        totalColor: {
            type: String,
            default: '#495060'
        },
        colorList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            chart: null,
            resizeId: null,
            info: {
                label: '',
                value: 0,
                color: ''
            }
        };
    },
    computed: {
        chartData () {
            let total = this.total;
            let calcNum = (n) => {
                if ((n / total) > MIN_ANGLE_PERCENTAGE || n <= 0) {
                    return n;
                }

                // 因为有交互操作，所以要有一个最小角度
                // 然而echart的minAngle数值是0也会显示，所以自己处理
                // 列方程算出来的 (inc + n) / (total + inc) = min
                let inc = (MIN_ANGLE_PERCENTAGE * total - n) / (1 - MIN_ANGLE_PERCENTAGE);
                total += inc;
                return n + inc;
            };

            return this.data.map(
                (item, i) => Object.assign(
                    Object.assign({}, item), 
                    {
                        key: `item$${i}`,
                        idx: i,
                        value: calcNum(item.value)
                    }
                )
            );
        },
        total () {
            let total = 0;
            this.data.forEach(item => total += item.value);
            return total;
        }
    },
    watch: {
        data: {
            deep: true,
            handler (v) {
                if (v) {
                    this.$nextTick(() => {
                        this.setChartOptions();
                        this.initInfo();
                    });
                }
            }
        }
    },
    mounted () {
        this.initChart();
        this.$nextTick(() => {
            this.setChartOptions();
            this.initInfo();
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
            this.chart.setOption(optionFac(this.chartData, this.colorList));
        },

        initInfo () {
            if (!this.data) {
                return;
            }

            // 设置预设值为总数
            this.info.value = filterNumUnit(this.total);
            this.info.label = this.totalLabel;
            this.info.color = this.totalColor;
            
            // 鼠标移出后显示总数
            this.chart.on('mouseout', (params) => {
                if (params.seriesName !== 'infoChart') {
                    return;
                }
                this.info.value = filterNumUnit(this.total);
                this.info.label = this.totalLabel;
                this.info.color = this.totalColor;
            });

            // 鼠标移动上去显示对应的数量和样式
            this.chart.on('mouseover', (params) => {
                if (params.seriesName !== 'infoChart') {
                    return;
                }
                
                let item = this.chartData.find(item => item.key === params.name);
                if (item) {
                    this.info.value = item.text;
                    this.info.label = item.label;
                    this.info.color = this.colorList[item.idx];
                }
            });
        }
    }
};
</script>
<style lang="postcss">
.info-chart__wrapper {
    position: relative;
    width: 160px;
    height: 160px;
    & .info-chart__chart,
    & .info-chart__mid
     {
        position: absolute;
        left: 0;
        top: 0;

        width: 100%;
        height: 100%;
    }

    & .info-chart__mid {
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;

        & .info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: auto;

            & .info__title {
                display: inline-block;
                max-width: 100px;
                font-size: 14px;
                color: #9099A5;
            }
            & .info__num {
                font-size: 24px;
                color: #495060
            }
        }
    }
}
</style>
