<template>
    <section class="info-chart-legend__wrapper">
        <div 
            v-for="(item, i) in data"
            :key="i" 
            class="legend">
            <i 
                class="legend__dot" 
                :style="getLegendDotStyle(i)"></i>
            <span class="legend__main">
                <span 
                    class="legend__name ellipsis"
                    :title="item.label">
                    {{ item.label }}
                </span>
                <span 
                    class="legend__count"
                    :title="item.text">
                    {{ item.text }}
                </span>
            </span>
        </div>
    </section>
</template>
<script>

/**
 * @file 信息饼图legend
 */

export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        colorList: {
            type: Array,
            default: () => []
        },
        legentDotStyle: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        getLegendDotStyle (i) {
            return Object.assign({
                'background-color': this.colorList[i]
            }, this.legentDotStyle);
        }
    }
};
</script>
<style lang="postcss">
.info-chart-legend__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & .legend {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        width: 170px;
        height: 30px;
        & .legend__dot {
            width: 8px;
            height: 8px;
            border-radius: 8px;
            margin-right: 12px;
        }
        & .legend__main {
            display: flex;
            flex-grow: 1;
            justify-content: space-between;
            align-items: center;
            & .legend__name {
                display: inline-block;
                align-items: center;
                width: 90px;
                height: 16px;
                line-height: 16px;
                font-size: 12px;
                color: #495060;
            }
            & .legend__count {
                font-size: 12px;
                color: #495060;
            }
        }
    }
}
</style>
