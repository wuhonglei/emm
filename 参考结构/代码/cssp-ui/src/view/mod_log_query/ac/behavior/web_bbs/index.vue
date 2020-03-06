<template lang="pug">
.ac-behavior-bbs-wapper.log-detail-page(v-loading="dataLoading")
    .init-query(v-if="status === 'init'")
        query(@submit="handleQuerySubmit")
    template(v-if="status === 'result' || status === 'coexistence'")
        toolbar.toolbar
            toolbar-button(text="查询条件" icon="search" @click.native="reQuery")
            toolbar-button(text="导出日志" 
                :icon="exportLoading ? 'loading' : 'export'"
                :spin="exportLoading"
                @click.native="handleExport" 
                :disabled="exportLoading")
            query(v-if="status === 'coexistence'"
                @submit="handleQuerySubmit"
                @hide="queryed"
                slot="query")
        query-info(:formatter="queryFormatter")
        log-table(ref="logTable"
            @click.native="queryed"
            @load-data="dataLoading=true"
            @loaded="handleLoaded"
            @exported="handleExported")

</template>

<script>

/**
 * 发帖/发微博日志页面
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

        loadData () {
            this.dataLoading = true;
            if (this.$refs.logTable) {

                //  querySearch == true;用log_search查询
                this.$refs.logTable.$emit('load-data', true);
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
