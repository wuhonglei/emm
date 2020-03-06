<template>
    <info-item-layout class="disk-info-item__wrapper">
        <sf-e-charts 
            class="disk-info__chart" 
            :options="chartOptions" />
        <template v-slot:title>
            <slot name="title"></slot>
        </template>
        <template v-slot:value>
            <slot name="value"></slot>
        </template>
    </info-item-layout>
</template>
<script>

/**
 * @file 首页上端磁盘展示项
 */

import infoItemLayout from './info_item_layout';

export default {
    components: {
        infoItemLayout
    },
    props: {
        available: {
            type: Number,
            default: 100
        },
        total: {
            type: Number,
            default: 100
        }
    },
    computed: {
        chartOptions () {
            let used = this.total - this.available;
            return {
                series: [
                    {
                        type:'pie',
                        radius: ['68%', '100%'],
                        silent: true,
                        avoidLabelOverlap: false,
                        hoverAnimation: false,
                        startAngle: 90,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#00d8d6', 'rgba(255,255,255,0.2)'],
                        data: [
                            used, 
                            this.available === 0 && used === 0 ? 1 : this.available
                        ]
                    }
                ]
            };
        }
    }
};
</script>
<style lang="postcss">
.disk-info-item__wrapper {
    & .disk-info__chart {
        width: 100%;
        height: 100%;
    }
}
</style>
