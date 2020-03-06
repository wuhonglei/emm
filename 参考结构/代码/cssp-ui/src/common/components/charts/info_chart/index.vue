<template>
    <div class="info-chart-overview__wrapper">
        <info-chart class="info-chart-overview__left"
                    :data="data"
                    :color-list="colorList"
                    :total-label="totalLabel"
                    :total-color="totalColor" />
        <info-legend class="info-chart-overview__right"
                     :data="data"
                     :color-list="colorList"
                     :legend-dot-style="legendDotStyle" />
    </div>
</template>
<script>

/**
 * @file 信息总览组件
 */

import infoChart from './chart';
import infoLegend from './legend';
import { INFO_CHART_DEFAULT_COLOR_LIST } from 'src/utils/consts';

export default {
    name: 'BussinessRiskOverview',
    components: {
        infoChart,
        infoLegend
    },
    props: {
        data: {
            type: Array,
            default: () => []
        },
        colorList: {
            type: Array,
            default: () => INFO_CHART_DEFAULT_COLOR_LIST
        },
        totalLabel: {
            type: String,
            default: '总数'
        },
        totalColor: {
            type: String,
            default: '#495060'
        },
        legendDotStyle: {
            type: Object,
            default: () => ({})
        }
    }
};
</script>
<style lang="postcss">
.info-chart-overview__wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
}
.info-chart-overview__left,
.info-chart-overview__right {
    flex-shrink: 0;
    flex-grow: 0;
}
.info-chart-overview__left {
    width: 170px;
    height: 170px;
}
.info-chart-overview__right {
    height: 180px;
    width: 50%;
}
</style>
