<template>
    <titled-container class="log-trend__wrapper">
        <template v-slot:title>
            <lang>日志趋势</lang>
        </template>
        <div v-loading="isLoading"
             class="log-trend__content">
            <info-bar-chart :data="chartData" />
        </div>
    </titled-container>
</template>
<script>

/**
 * @file 日志分布
 */

import titledContainer from 'src/common/components/titled_container';
import infoBarChart from 'src/common/components/charts/info_bar_chart';

import { getLogTrend } from 'src/common/api/home_page';

export default {
    components: {
        titledContainer,
        infoBarChart
    },
    data () {
        return {
            isLoading: false,
            data: []
        };
    },
    computed: {
        chartData () {
            let logCnt = 7;
            return this.data.slice(0, logCnt).map(item => {
                let date = new Date(item.date);
                return Object.assign({
                    label: `${date.getMonth() + 1}-${date.getDate()}`,
                    value: item.total
                }, item);
            });
        },
        isEmpty () {
            return !Array.isArray(this.data) ||
                this.data.length <= 0 ||
                this.data.every(item => item.total === 0);
        }
    },
    mounted () {
        this.loadData();
    },
    methods: {
        async loadData () {
            this.isLoading = true;
            
            try {
                let res = await getLogTrend();
                this.data = res.data && res.data.data || [];
            } catch (err) {
                this.$error(err.data && err.data.mesg || _('日志趋势信息获取失败'));
            }
            this.$nextTick(() => {
                this.isLoading = false; 
            });
        }
    }
};
</script>
<style lang="postcss">
.log-trend__wrapper {
    & .log-trend__content{
        display: flex;
        justify-content: center;
        align-items: stretch;
        width: 100%;
        flex-grow: 1;
    } 
}

</style>
