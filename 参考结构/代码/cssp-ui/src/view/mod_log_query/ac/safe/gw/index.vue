<template lang="pug">
.safe-gw-wrapper.log-detail-page(v-loading.body="exportLoading || dataLoading" 
    :element-loading-text="exportLoading ? '正在导出' : '正在加载'")
    .init-query(v-if="status === 'init'")
        query(@submit="handleQuerySubmit")
    template(v-if="status === 'result' || status === 'coexistence'")
        toolbar.toolbar
            toolbar-button(text="查询条件" icon="search" @click.native="showQeury")
            toolbar-button(text="导出日志" 
                icon="export" 
                @click.native="handleExport" 
                :disabled="exportLoading")
            query(v-if="status === 'coexistence'"
                @submit="handleQuerySubmit"
                @hide="queryed"
                slot="query")
        query-info(:formatter="queryFormatter")
        log-table(@loaded="handleLoaded" 
            @load-data="dataLoading=true"
            @exported="handleExported"
            @row-click="handleTableRowClick"
            @click.native="queryed"
            ref="logTable")
    
</template>
<script>

/**
 * 网关杀毒安全日志
 */

import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import queryInfo from 'src/common/components/query_info';
import logTable from './table';
import dataPackage from 'src/common/components/data_package';
import query from './query';
import { mapMutations, mapGetters } from 'vuex';

export default {
    components: {
        toolbar,
        queryInfo,
        logTable,
        dataPackage,
        query,
        toolbarButton
    },

    data () {
        return {
            query: {},
            tableData: [],
            exportLoading: false,
            dataLoading: false,
            detailData: {},
            detailIndex: 1,
            queryFormatter: {
                uuid (value, loadedData) {
                    let list = loadedData.uuid; 
                    let [data] = list.filter((item) => item.uuid === value);
                    return (data && data.uuid) ? `${data.name}(${data.ip})` : '所有';
                },
                tmName (value) {
                    return value && value.length ? value.map((item) => item.name).join(',') : '所有';
                },
                siteName (value) {
                    return value && value.length ? value.map((item) => item.name).join(',') : '所有';
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

        showQeury () {
            this.reQuery();
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

        loadData (order) {
            if (this.$refs.logTable) {

                //  querySearch == true;用log_search查询
                this.$refs.logTable.$emit('load-data', true, order);
            }
        },

        handleLayout () {
            if (this.$refs.logTable) {
                this.$refs.logTable.$emit('layout');
            }
        },

        handleQuerySubmit (order) {
            this.queryed();
            this.loadData(order);
        },

        handleLoaded ({tableData, startIndex}) {
            this.tableData = tableData;
            this.detailData = tableData[0] || {};
            this.detailIndex = startIndex;
            this.dataLoading = false;
        },

        handleTableRowClick (row, index) {
            this.detailData = row;
            this.detailIndex = index;
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";
.safe-gw-wrapper {
    background-color: var(--panel-bg-color);
}
</style>
