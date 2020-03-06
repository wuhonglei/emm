<template>
    <div
        v-loading.body="dataLoading"
        class="af-ips-wrapper log-detail-page">
        <split-panel @layout="handleLayout">
            <div
                v-if="status === 'init'"
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
                    <query
                        v-if="status === 'coexistence'"
                        slot="query"
                        @submit="handleQuerySubmit"
                        @hide="queryed" />
                </toolbar>
                <query-info :formatter="queryFormatter" />
                <log-table
                    ref="logTable"
                    @loaded="handleLoaded"
                    @load-data="dataLoading = true"
                    @exported="handleExported"
                    @row-click="handleTableRowClick"
                    @click.native="queryed" />
            </template>
            <data-package
                slot="detail"
                :data="detailData"
                :items="[['time', '时间'], ['dst_ip', '受攻击者IP'], ['src_ip', '攻击者IP'], ['url', '目的URL']]"
                :index="detailIndex"
                @click.native="queryed"
                @toggle="handleToggleDetail" />
        </split-panel>
    </div>
</template>
<script>

/**
 * 漏洞攻击防护日志
 */

import splitPanel from 'src/common/components/layout/split_panel';
import toolbar from 'src/common/components/toolbar/toolbar';
import toolbarButton from 'src/common/components/toolbar/toolbar_button';
import queryInfo from 'src/common/components/query_info';
import logTable from './table';
import dataPackage from 'src/common/components/data_package';
import query from './query';
import { mapMutations, mapGetters } from 'vuex';
import eventBus, { BUS_EVENT } from 'src/utils/bus';

export default {
    components: {
        splitPanel,
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

        loadData () {
            
            if (this.$refs.logTable) {

                //  querySearch == true;用log_search查询
                this.$refs.logTable.$emit('load-data', /* querySearch */true);
            }
        },

        handleLayout () {
            if (this.$refs.logTable) {
                this.$refs.logTable.$emit('layout');
            }
        },

        handleQuerySubmit () {
            this.queryed();
            this.loadData();
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
        },

        handleToggleDetail (open) {
            eventBus.$emit(BUS_EVENT.TOGGLE_PACKAGE_DETAIL, open);
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";
.af-ips-wrapper {
    background-color: var(--panel-bg-color);
}
</style>
 