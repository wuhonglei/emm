<template>
    <div class="log-third-party-wapper">
        <div v-loading="dataLoading"
             class="log-detail-page">
            <div v-if="status === 'init'"
                 class="init-query">
                <query @submit="handleQuerySubmit" />
            </div>
            <template v-if="status === 'result' || status === 'coexistence'">
                <toolbar class="toolbar">
                    <toolbar-button 
                        text="查询条件"
                        icon="search"
                        @click.native="reQuery" />
                    <toolbar-button 
                        text="导出日志"
                        :icon="exportLoading ? 'loading' : 'export'"
                        :spin="exportLoading"
                        :disabled="exportLoading"
                        @click.native="handleExport" />
                    <query v-if="status === 'coexistence'"
                           slot="query"
                           @submit="handleQuerySubmit"
                           @hide="queryed" />
                </toolbar>
                <query-info :formatter="queryFormatter" />
                <log-table 
                    ref="logTable"
                    @click.native="queryed"
                    @load-data="dataLoading=true"
                    @loaded="handleLoaded"
                    @exported="handleExported" />
            </template>
        </div>
    </div>
</template>

<script>

/**
 * 第三方操作日志页面
 */


import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import queryInfo from 'src/common/components/query_info';
import logTable from './table';
import query from './query';
import { mapMutations, mapGetters } from 'vuex';
export default {
    components: {
        toolbar,
        queryInfo,
        logTable,
        query,
        toolbarButton
    },

    data () {
        return {
            query: {},
            tableData: [],
            exportLoading: false,
            dataLoading: false,
            queryFormatter: {
                collectorName (value, loadedData) {
                    let list = loadedData.collectorName; // 拿到加载uuid的列表
                    let [data] = list.filter((item) => item.uuid === value); // 拿到值匹配的数据
                    return (data && data.uuid) ? `${data.name}（${data.ip}）` : '所有'; // 返回要显示的文本
                },
                uuid () {
                    return '';
                }
            }
        };
    },
    
    computed: {
        ...mapGetters('splitPanel', ['status'])
    },

    methods: {
        ...mapMutations('splitPanel', [
            'init',
            'queryed',
            'reQuery'
        ]),

        loadData () {
            this.dataLoading = true;
            if (this.$refs.logTable) {

                //  querySearch == true;用log_search查询
                this.$refs.logTable.$emit('load-data', /* querySearch */true);
            }
        },

        handleQuerySubmit () {
            this.queryed();
            this.loadData();
        },

        handleExport () {
            if (this.exportLoading) {
                return;
            }
            this.exportLoading = true;
            this.$refs.logTable.$emit('export');
        },

        handleExported () {
            this.exportLoading = false;
        },

        handleLoaded () {
            this.dataLoading = false;
        }
    }
};
</script>

<style lang="postcss">
.log-third-party-wapper  {
    flex: 1;
    height: 100%;
    margin: 0 16px 16px 0;
    box-sizing: border-box;
    overflow: auto;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
}
</style>