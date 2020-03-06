<template>
    <titled-container class="alarm-trend__wrapper">
        <template v-slot:title>
            <lang>告警趋势</lang>
        </template>
        <div v-loading="isLoading"
             class="alarm-trend__content">
            <info-line-chart :data="chartData" />
        </div>
    </titled-container>
</template>
<script>

/**
 * @file 日志分布
 */

import titledContainer from 'src/common/components/titled_container';
import infoLineChart from 'src/common/components/charts/info_line_chart';

import { getAlarmTrend } from 'src/common/api/home_page';

export default {
    components: {
        titledContainer,
        infoLineChart
    },
    data () {
        return {
            isLoading: false,
            data: []
        };
    },
    computed: {
        chartData () {
            let alarmCnt = 7;
            return this.data.slice(0, alarmCnt).map(item => {
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
                let res = await getAlarmTrend();
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
.alarm-trend__wrapper {
    & .alarm-trend__content{
        display: flex;
        justify-content: center;
        align-items: stretch;
        width: 100%;
        flex-grow: 1;
    } 
}
</style>
