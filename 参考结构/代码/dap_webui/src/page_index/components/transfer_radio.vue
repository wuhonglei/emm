<template>
    <div class="transfer-box-radio">
        <div
            v-if="defSearchOptions.showSearchs"
            class="transfer-searchs">
            <p
                v-if="defSearchOptions.tips"
                class="transfer-searchs-tips">
                {{ defSearchOptions.tips }}
            </p>
            <div
                ref="serachBox"
                class="mt15">
                <sf-type-search
                    class="transfer-search-box"
                    :show-search-btn="true"
                    :select-options="filters"
                    :select-width="defSearchOptions.selectWidth"
                    :default-width="defSearchOptions.defaultWidth"
                    :placeholder="defSearchOptions.placeholder"
                    @search="_handleSearch" />
            </div>
        </div>
        <div class="transfer-search__result-tips">
            {{ defSearchOptions.searchTips }}
        </div>
        <div>
            <sf-table
                ref="table"
                :options="tableOptions"
                :default-height="280"
                @pagechange="pageChange"
                @selectionchange="_handleSelectionChange">
                <slot name="tableColumn"></slot>
            </sf-table>
        </div>
    </div>
</template>


<script>

/**
 * 添加认证服务器
 * 
 */

import { on, off } from 'src/utils/dom'; 
import { debounce } from 'throttle-debounce';

export default {
    props: {
        api: {
            type: Function,
            required: true
        },
        bufferView: {
            type: Boolean,
            default () {
                return true;
            }
        },
        searchOptions: {
            type: Object,
            default () {
                return {};
            }
        },
        showPagination: {
            type: Boolean,
            default () {
                return true;
            }
        },
        filters: {
            type: Array,
            default () {
                return [];
            }
        },
        // eslint-disable-next-line vue/require-default-prop
        handleLoadParams: { // 处理参数，会将搜索的，分页的组合成一个参数，可以进行处理。如果return false 则表示不加载
            type: Function 
        }
    },
    data () {
        return {
            dynicHeight: 0,
            params: {
                keyword: '',
                filter: ''
            },
            tableSelected: [],
            initPagination: {
                pageIndex: 1
            },
            defSearchOptions: {
                tips: '', // 搜索框上方提示
                placeholder: '请输入搜索关键字', // 搜索框内提示
                showSearchs: true, // 搜索大框是否显示
                searchMode: true, // 默认不加载数据，只在搜索时加载，清空直接不显示数据
                onlySearch: false, // 只有搜索加载数据
                emptyText: '', // table为空提示
                btnText:'立即搜索', // 按钮文字
                searchTips: '搜索结果：',
                selectWidth: 70, // 选择框的宽度
                defaultWidth: 484 // 搜素框整体长度
            },
            tableOptions: {
                selectionType: 'radio',
                data: [],
                bufferView: this.bufferView,
                pagination: {}
            },
            searchInputWidth: 0
        };
    },
    mounted () {
        const SEARCH_BTN_WIDTH = 130; // 搜索按钮宽度
        this._updateTableHeight();
        this.$nextTick(() => {
            this.searchInputWidth = this.$refs.serachBox.clientWidth - SEARCH_BTN_WIDTH;
        });
        this.defSearchOptions = Object.assign(this.defSearchOptions, this.searchOptions);
        this.params.filter = this.filters[0].value;
        if (!this.defSearchOptions.onlySearch) {
            this.loadData();
        }
        if (!this.showPagination) { // 配置分页不显示
            this.tableOptions.pagination = false;
        }
        on(window, 'resize', this._handleResize());
    },
    beforeDestroy () {
        off(window, 'resize', this._handleResize());
    },
    methods: {
        _handleResize  () {
            const DEBOUNCE_TIME = 300;
            return debounce(DEBOUNCE_TIME, () => {
                this._updateTableHeight();
            });
        },
        _updateTableHeight () {
            const TOOLBAR_HEGIHT = 30;

            // 某些样式会导致，dom挂载到页面上之后，高度还是不对
            // nextTick 微任务 无效，需要使用settimeout
            setTimeout(() => {
                this.dynicHeight = this.$el.offsetHeight - TOOLBAR_HEGIHT;
            }, 0);
        },
        _handleSearch (type, searchText) {
            this.params.filter = type;
            this.params.keyword = searchText;
            this.loadData();
        },
        loadData () {
            let params = this.params;
            if (this.showPagination) {
                this.params.pageIndex = this.tableOptions.pagination.pageIndex;
            }
            if (this.defSearchOptions.onlySearch && !params.keyword) {
                this.warnTips('请输入关键字');
                return;
            }
            if (typeof this.handleLoadParams === 'function') {
                params = this.handleLoadParams(params);
                if (params === void (0)) {
                    return;
                }
            }
            this.maskTips();
            this.api(params).then(res => {
                this.tableData = res.data.data.data;
                if (this.showPagination) {
                    this.tableOptions.pagination.total = res.data.data.count;
                    this.tableOptions.pagination.pagerCount = res.data.data.pageCount;
                }
                this.tableOptions.data = res.data.data.data;
                this.unmaskTips();
            });
        },
        pageChange (currIndex) {
            this.pagination.pageIndex = currIndex;
            this.refresh();
        },
        _handleSelectionChange () {
            let selected = this.$refs.table.getSelections();
            this.$emit('selection-change', selected);
            this.tableSelected = selected;
        },
        getSelections () {
            return this.tableSelected;
        }
    }
};
</script>

<style lang="postcss">
.transfer-box-radio {
    & .transfer-searchs {
        width: 574px;
        padding: 22px 0px;
    }
    & .transfer-searchs-tips {
        font-size: 12px;
        line-height:16px;
        color:#80848f;
    }
    & .transfer-search__result-tips {
        line-height: 40px;
        border-top: 2px solid var(--border-color);
        padding-left: 15px;
        color: var(--title-text-color);
    }
    & .serach-box-text {
        font-size: 12px;
    }
}

</style>
