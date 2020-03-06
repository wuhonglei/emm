<template>
    <div 
        class="transfer-box">
        <div
            v-if="defSearchOptions.showSearchs"
            class="transfer-searchs">
            <p class="transfer-searchs-tips">
                {{ defSearchOptions.tips }}
            </p>
            <div class="mt15">
                <!-- <sf-button-primary 
                    class="pull-right"
                    :default-width="107"
                    @click="_handleSearch">
                    {{ defSearchOptions.btnText }}
                    <i slot="icon"
                       class="iconfont icon-bar-compatible">&#xe62a;</i>
                </sf-button-primary> -->

                <!-- <sf-select
                    ref="filter"
                    v-model="searchParams.filter"
                    class="pull-left"
                    :default-width="70"
                    :options="filters" />
                <sf-searchfield
                    ref="keyword"
                    v-model="searchParams.keyword"
                    class="pull-left"
                    :placeholder="defSearchOptions.placeholder" 
                    :default-width="715"
                    @clear="clearSearch"
                    @trigger="_handleSearch" /> -->

                <sf-type-search v-model="searchParams.keyword"
                                class="pull-left"
                                :show-search-btn="true"
                                :select-options="filters"
                                :select-width="82"
                                :default-width="775"
                                @search="_handleSearch" />
            </div>
        </div>
        <div class="transfer-line">
        </div>
        <div>
            <sf-transfer
                ref="transfer"
                v-model="tableChecked"
                :options="defTransferOptions"
                @checked="checkData"
                @unchecked="uncheckData">
                <sf-toolbar slot="leftToolbar">
                    <span>{{ defSearchOptions.leftTitle.title }}</span>
                    <sf-type-search v-if="showFilter && showSearch"
                                    :key="typeSearchKey"
                                    v-model="searchParams.keyword"
                                    class="pull-right"
                                    :select-options="filters"
                                    :select-width="82"
                                    :default-width="205"
                                    @search="_handleSearch" />
                    <sf-searchfield
                        v-if="!showFilter && showSearch"
                        v-model="searchParams.keyword"
                        class="pull-right"
                        :placeholder="searchText"
                        @trigger="_handleSearchText" />
                </sf-toolbar>
                <div
                    slot="leftTitle">
                    {{ defSearchOptions.leftTitle.title }}
                </div>
                <sf-transfer-table
                    v-if="showTable"
                    slot="left"
                    ref="leftTable"
                    :options="defLeftTableOptions"
                    @pagechange="pageChange">
                    <slot name="leftTable"></slot>
                </sf-transfer-table>
                <sf-transfer-table
                    slot="right"
                    is-target>
                    <slot name="rightTable"></slot>
                </sf-transfer-table>
            </sf-transfer>
        </div>
    </div>
</template>


<script>

/**
 * 添加认证服务器
 * 
 */

const LEFT_WIDTH = 350; // 配置左边表格的宽度
const RIGHT_WIDTH = 280; // 配置右边表格的宽度
const TRANSFER_HEIGHT = 390; // 穿梭框的高度
export default {
    props: {
        api: { // 请求的接口
            type: Function,
            required: true
        },
        filters: { // 搜索过滤条件
            type: Array,
            default () {
                return [];
            }
        },
        showFilter: { // 是否显示搜索筛选
            type: Boolean,
            default () {
                return true;
            }
        },
        showSearch: { // 是否显示搜索筛选
            type: Boolean,
            default () {
                return true;
            }
        },
        searchOptions: { // 默认隐藏
            type: Object,
            default () {
                return false;
            }
        },
        leftTableOptions: {
            type: Object,
            default () {
                return {};
            }
        },
        showPagination: {
            type: Boolean,
            default () {
                return false;
            }
        },
        transferOptions: { 
            type: Object,
            default () {
                return {};
            }
        },
        // eslint-disable-next-line vue/require-default-prop
        handleLoadParams: { // 处理参数，会将搜索的，分页的组合成一个参数，可以进行处理。如果return false 则表示不加载
            type: Function
        },
        chooseData: {
            type: Array,
            default () {
                return [];
            }
        },
        leftWidth: { // 配置左边表格的宽度
            type: Number,
            default () {
                return LEFT_WIDTH;
            }
        }, 
        rightWidth: { // 配置右边表格的宽度
            type: Number,
            default () {
                return RIGHT_WIDTH;
            }
        },
        transferHeight: { // 穿梭框的高度
            type: Number,
            default () {
                return TRANSFER_HEIGHT;
            }
        },
        searchText: { // 搜索框的文字
            type: String,
            default () {
                return '请输入搜索关键字';
            }
        }
    },
    data () {
        return {
            typeSearchKey: new Date().getTime(),

            showTable: true,

            selectedData: [],
            searchParams: {
                keyword: '',
                filter: ''
            },
            params: {
                keyword:'',
                filter: ''
            },
            
            tableChecked: [],
            defTransferOptions: {
                idProperty: 'id',
                height: this.transferHeight,
                left: {
                    width: this.leftWidth,
                    searchKey: 'name',
                    searchAble: false,
                    searchRemote: true
                },
                right: {
                    width: this.rightWidth
                }
            },
            defLeftTableOptions: {
                selectionMode: 'multi',
                serachAble: false,
                load: this.searchOptions.onlySearch ? '' : this.loadData,
                data: [],
                pagination: {
                    pageSize: 20,
                    navLength: 3,
                    layout: ['pager']
                }
            },
            defSearchOptions: {
                tips: '', // 搜索框上方提示
                placeholder: '请输入搜索关键字', // 搜索框内提示
                showSearchs: false, // 搜索大框是否显示
                searchMode: true, // 默认不加载数据，只在搜索时加载，清空直接不显示数据
                onlySearch: false, // 只有搜索加载数据
                emptyText: '', // table为空提示
                btnText:'立即搜索', // 按钮文字
                leftTitle: {
                    title: '待选',
                    showTotal: true
                }
            },
            selectData: []
        };
    },
    mounted () {
        this.typeSearchKey = new Date().getTime();
        this.clearSearch();
        this.defTransferOptions = Object.assign(this.defTransferOptions, this.transferOptions);
        if (this.showPagination) { // 配置分页显示
            this.defLeftTableOptions = Object.assign(this.defLeftTableOptions, this.leftTableOptions);
        } else {
            this.defLeftTableOptions.pagination = false;
        }
        this.defSearchOptions = Object.assign(this.defSearchOptions, this.searchOptions);
        if (!this.defSearchOptions.onlySearch) { // 配置搜索模式，不加载数据
            this.loadData();
        }
    },
    methods: {
        pageChange () { // currPage, prevPage, pageSize
            
        },
        async loadData () {
            if (!this.params.keyword && this.defSearchOptions.onlySearch) {
                this.warnTips('请输入关键字');
                return;
            }
            let params = {};
            if (typeof this.handleLoadParams === 'function') { 
                params = this.handleLoadParams(params);
                if (params === void (0)) {
                    return;
                }
            }
            if (!this.searchParams.keyword) {
                this.clearSearch();
            } else {
                this.params = Object.assign({}, this.searchParams);
            }
            this.params = Object.assign(this.params, params);
            let resData;
            await this.api(this.params).then(res => {
                this.defLeftTableOptions.data = res.data.data.data;
                resData = res.data.data.data;
            });
            if (this.chooseData.length) {
                this.selectData = [];
                resData.forEach(item => {
                    if (this.chooseData.indexOf(item.id) >= 0) {
                        this.selectData.push(item);
                    }
                });
                this.$refs.transfer.addChecked(this.selectData);
            }
            return this.defLeftTableOptions.data;
            
        },
        _handleSearch (filter, keyword) { // 搜索
            if (typeof keyword !== 'undefined') {
                this.searchParams.keyword = keyword || '';
            }
            if (typeof filter !== 'undefined') {
                this.searchParams.filter = filter || this.filters[0].value;
            }
            this.params = Object.assign(this.params, this.searchParams);
            if (!this.params.keyword && this.defSearchOptions.onlySearch) { // 非搜索模式，关键字为空清空
                this.warnTips('请输入关键字');
                return;
            }
            this.loadData();
        },
        _handleSearchText (keyword) {
            this.searchParams.keyword = keyword || '';
            this._handleSearch();
        },
        clearSearch () { // 清除搜索 e
            if (this.defSearchOptions.onlySearch) {
                this.leftTableOptions.data = [];
            }
            this.params.keyword = '';
            this.params.filter = this.filters[0].value;
            this.searchParams = Object.assign({}, this.params);
        },
        checkData (clickItem, selectedData) {
            this.selectedData = selectedData;
            this.$emit('selection-change', ...arguments);
        },
        uncheckData (clickItem, selectedData) {
            this.selectedData = selectedData;
            this.$emit('selection-change', ...arguments);
        },
        getSelection () {
            return this.selectedData;
        },

        // 刷新表格信息
        refresh () {
            this.$refs.leftTable.reload();
        }

    }
};
</script>

<style lang="postcss">
.transfer-box {
    & .transfer-searchs {
        padding: 22px 32px;
    }
    & .transfer-searchs-tips {
        font-size: 12px;
        line-height:16px;
        color:#80848f;
    }
    & .transfer-line {
        border-top: 2px solid var(--border-color);
        margin-top: 32px;
    }
}

</style>
