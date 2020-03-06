<template>
    <titled-container class="asset-alarm__wrapper">
        <template v-slot:title>
            <lang>告警TOP5（近七天）</lang>
        </template>
        <div class="asset-alarm__content">
            <div class="asset-alarm__oper">
                <label class="asset-alarm__oper__label">
                    <lang>
                        风险等级：
                    </lang>
                </label>
                <sf-select 
                    v-model="selectedLevel" 
                    type="multi"
                    :options="levels"
                    @change="handleLevelChange" />
            </div>
            <div 
                v-loading="isLoading"
                class="asset-alarm__content__main">
                <empty-status
                    v-if="isEmpty"
                    class="asset-alarm__empty-status">
                    {{ emptyText }}
                </empty-status>
                <info-stack-chart 
                    v-else
                    class="asset-alarm__chart"
                    :levels="selectedLevel"
                    :data="chartData" />
            </div>
        </div>
    </titled-container>
</template>
<script>

/**
 * @file 日志分布
 */

import titledContainer from 'src/common/components/titled_container';
import infoStackChart from 'src/common/components/charts/info_stack_chart';
import emptyStatus from 'src/common/components/empty_status';

import { getAssetRiskInfo } from 'src/common/api/home_page';
import { getAssetLogCnt } from 'src/common/api/proxied_api';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        titledContainer,
        infoStackChart,
        emptyStatus
    },
    data () {
        return {
            isLoading: false,
            selectedLevel: ['lost', 'high'],
            levels: [
                { label: _('致命'), value: 'lost' },
                { label: _('高'), value: 'high' },
                { label: _('中'), value: 'middle' },
                { label: _('低'), value: 'low' },
                { label: _('信息'), value: 'info' }
            ],
            data: [],
            assetCnt: 1
        };
    },
    computed: {
        ...mapGetters(['riskSelection']),
        chartData () {
            return this.data.map(item => {
                return Object.assign({
                    data: item.risk_info
                }, item);
            }).reverse();
        },
        isEmpty () {
            return !Array.isArray(this.data) || this.data.length <= 0;
        },
        assetEmpty () {
            return this.assetCnt <= 0;
        },
        emptyText () {
            return this.assetEmpty ? _('暂无资产，请前往资产管理页面添加') : _('暂无筛选数据');
        }
    },
    watch: {
        selectedLevel: {
            deep: true,
            handler (v) {
                this.setRiskSelections(v);
            }
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        ...mapActions(['setRiskSelections']),
        async init () {
            this.initLevel();
            await Promise.all([
                this.loadAssetCnt(),
                this.loadData()
            ]);
        },
        initLevel () {

            // 为保证刷新之后选中的不变，初始化时从vuex中读取
            // vuex 已经做了持久化
            this.selectedLevel = 
                Array.isArray(this.riskSelection) && 
                this.riskSelection.length > 0 ? 
                    this.riskSelection : 
                    ['lost', 'high'];
        },

        async loadData () {
            this.isLoading = true;
            
            try {
                let res = await getAssetRiskInfo({
                    level_list: this.selectedLevel,
                    top: 5
                });
                this.data = res.data && res.data.data || [];
            } catch (err) {
                this.$error(err.data && err.data.mesg || _('资产告警信息获取失败'));
            }
            this.$nextTick(() => {
                this.isLoading = false; 
            });
        },

        // 加载资产数量
        async loadAssetCnt () {
            try {
                let res = await getAssetLogCnt();
                this.assetCnt = res.data && res.data.data && res.data.data.collector_num ?
                    res.data.data.collector_num : 0;
            } catch (err) {
                this.assetCnt = 0;
            }
        },

        handleLevelChange () {
            this.$nextTick(() => {
                this.loadData();
            });
        }
    }
};
</script>
<style lang="postcss">
.asset-alarm__wrapper {
    & .asset-alarm__content{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        flex-grow: 1;

        & .asset-alarm__oper {
            width: 100%;
            height: 35px;
            flex-grow: 0;
            flex-shrink: 0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin: -23.5px -64px 23.5px 0;
            & .asset-alarm__oper__label {
                font-size: 12px;
                color: #80848f;
            }
        }
    } 

    & .asset-alarm__empty-status {
        height: 100%;
        width: 100%;
    }

    & .asset-alarm__content__main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 285px;
        width: 100%;
    }

    & .asset-alarm__chart {
        height: 100%;
        width: 100%;
    }
}

</style>
