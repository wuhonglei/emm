<template>
    <titled-container>
        <template v-slot:title>
            <lang>日志分布（近七天）</lang>
        </template>
        <div v-loading="isLoading"
             class="log-distribution-content">
            <empty-status 
                v-if="isEmpty"
                class="log-distribution__empty-status">
                {{ emptyText }}
            </empty-status>
            <info-chart 
                v-else
                :data="chartData" />
        </div>
    </titled-container>
</template>
<script>

/**
 * @file 日志分布
 */

import titledContainer from 'src/common/components/titled_container';
import infoChart from 'src/common/components/charts/info_chart';
import emptyStatus from 'src/common/components/empty_status';

import { getAssetLogCnt } from 'src/common/api/proxied_api';
import { filterNumUnit } from 'src/common/lib/filters';

export default {
    components: {
        titledContainer,
        infoChart,
        emptyStatus
    },
    data () {
        return {
            isLoading: false,
            assetCnt: 1,
            data: []
        };
    },
    computed: {
        chartData () {
            return this.data.map(item => ({
                label: item.name,
                value: item.num,
                text: filterNumUnit(item.num)
            }));
        },
        isEmpty () {
            return !Array.isArray(this.data) || this.data.length <= 0;
        },
        assetEmpty () {
            return this.assetCnt <= 0; 
        },
        emptyText () {
            return this.assetEmpty ? _('暂无资产，请前往资产管理页面添加') : _('暂无资产日志');
        }
    },
    mounted () {
        this.loadData();
    },
    methods: {
        async loadData () {
            this.isLoading = true;
            
            try {
                let res = await getAssetLogCnt();
                if (res.data && res.data.data) {
                    let _data = res.data.data;
                    this.data = _data.log_distribution || [];
                    this.assetCnt = _data.collector_num ? _data.collector_num : 0;
                } else {
                    this.data = [];
                    this.assetCnt = 0;
                }
            } catch (err) {
                this.$error(err.data && err.data.mesg || _('日志分布信息获取失败'));
            }
            this.$nextTick(() => {
                this.isLoading = false; 
            });
        }
    }
};
</script>
<style lang="postcss">
.log-distribution-content{
    display: flex;
    justify-content: center;
    align-items: stretch;
    width: 100%;
    flex-grow: 1;

    & .log-distribution__empty-status {
        flex-grow: 1;
        height: auto;
    }
}
</style>
