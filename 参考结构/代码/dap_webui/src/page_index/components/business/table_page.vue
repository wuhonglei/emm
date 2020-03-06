<template>
    <div class="table-page-wrapper">
        <sf-grid>
            <sf-toolbar v-if="showToolbar">
                <slot name="toolbarBtns"></slot>
                <slot name="toolbarOperation"></slot>
            </sf-toolbar>   
            <sf-table
                ref="table"
                :key="tableKey"
                :options="defTableOptions"
                :default-height="table.dynicHeight"
                @pagechange="_pagechange"
                @selectionchange="_handleSelectionChange">
                <div slot="tip">
                    <slot name="tip"></slot>
                </div>
                <slot></slot>
            </sf-table>
        </sf-grid>
    </div>
</template>

<script>

/**
 * 统一封装带表格的页面
 * 
 * 目前还未涉及服务端分页，到时候可能会需要进行调整
 * 
 * 使用说明：
 * 1. 此组件的父元素高度必须显示指定100%，内部有动态计算表格高度的函数，如果不指定，则表格无法撑开
 * 
 * 2. refs 在组件中，如果满足不了的需求可以用过$refs.tablePage.$refs.xxx 进行获取，理论上可以完成任何操作 refs 说明：
 *     1. keyword 搜索输入框
 *     2. filter 搜索条件删选输入框
 *     3. table table组件
 * 
 * 3. event 组件会触发一些事件，因为事件的触发在代码逻辑中，可能不好一下子看全，所以在此列出来
 *     1. load-error: 加载表格数据失败时触发
 *     2. selection-change: 表格选择改变时，进行触发
 *     3. filter-change: 删选条件改变时进行触发
 * 
 * 4. slots
 *     1. 默认slot：会被渲染到表格里面，所有原来卸载sf-table里面的，都是默认的
 *     2. toolbarBtns slot： 表格的工具栏的slot
 * 
 * 5. props 所有props都写了注释，并且给出了默认值，直接查看代码即可
 * 
 * 6. methods 
 *     1. 所有以下划线_开头的方法，是内部方法，后续可能会调整，建议不要调用。
 *     2. 所有非下划线_开头的方法都可以外部调用，并且每个方法都写上了注释
 * 
 */

import './table_page.css';

import { on, off } from 'src/utils/dom'; 
import { debounce } from 'throttle-debounce';
import flattenTree from 'src/utils/flatten_tree';

export default {

    props: {
        api: { // 表格请求封装的接口
            type: Function,
            default: function () {
                return true;
            }
        },

        bufferView: { // 是否启用高性能模式
            type: Boolean,
            default () {
                return false;
            }
        },

        selectionMode: { // 单选还是多选
            type: String,
            default () {
                return 'multi';
            }
        },

        selectionHide: { // 是否显示勾选框
            type: Boolean,
            default () {
                return false;
            }
        },

        showToolbar: { // 是否显示工具条
            type: Boolean,
            default () {
                return true;
            }
        },

        showFilter: { // 是否显示搜索筛选
            type: Boolean,
            default () {
                return true;
            }
        },

        filters: { // 筛选下拉框需要显示的数据
            type: Array,
            default () {
                return [];
            }
        },

        showSearch: { // 是否显示搜索输入框
            type: Boolean,
            default () {
                return true;
            }
        },
        showPagination: { // 显示分页
            type: Boolean,
            default () {
                return true;
            }
        },
        pageSize: {
            type: Number,
            default () {
                const DEF_PAGE_SIZE = 20; // 默认页数大小
                return DEF_PAGE_SIZE;
            }
        },

        // eslint-disable-next-line vue/require-default-prop
        handleLoadParams: { // 处理参数，会将搜索的，分页的组合成一个参数，可以进行处理。如果return false 则表示不加载
            type: Function
        },

        selectData: {
            type: Array,
            default () {
                return [];
            }
        },
        initHeight: { // 用于兼容IE，弹窗内高度获取不准确
            type: Number,
            default () {
                return 0;
            }
        },
        emptyText: { // 配置表格空状态的文字
            type: String,
            default () {
                return '暂无数据';
            }
        },
        isLoadApi: { // 是否需要加载api
            type: Boolean,
            default () {
                return true;
            }
        },
        tableOption: { // 表格的配置
            type: Object,
            default () {
                return {};
            }
        }
    },
    data () {
        let defTableOptions = {
            data: [],
            bufferView: this.bufferView,
            selectionType: this.selectionMode,
            selectionHide: this.selectionHide,
            emptyText: this.emptyText, // table为空提示

            pageTotal: 'data.count',
            rootData: 'data.data',
            sortDirectionKey: 'asc',
            sortFieldKey: 'sortBy',
            loadParams: {}, // 没有参数也必须传入，组件库没有默认值，否则无法设置参数
            load: this.isLoadApi ? this._loadData.bind(this) : '',
            pagination: {
                pageSize: this.pageSize, // 由props设置默认值
                pageStart: 1,
                pageIndex: 0,
                layout: ['pager', 'sizes', 'jumper'],
                
                // eslint-disable-next-line
                pageSizes: [20, 50, 100, 200]
            }
        };

        if (!this.showPagination) {
            delete defTableOptions.pagination;
        }

        return {
            table: {
                dynicHeight: this.initHeight,
                data: []
            },
            tableKey: new Date().getTime(),

            defTableOptions,

            tableSelected: [],
            toggleColumns: [],

            keyword: '',
            params: {},
            isAnewConfigPage: false,
            anewPageIndex: 1,
            refTable: null,
            searchID: ''
        };
    },

    mounted () {
        this.refTable = this.$refs.table;
        this.tableAdaptive();
        
        this.defTableOptions = Object.assign(this.defTableOptions, this.tableOption);

        on(window, 'resize', this._handleResize());
    },

    beforeDestroy () {
        off(window, 'resize', this._handleResize());
    },

    methods: {
        pageChange (currIndex) { // currIndex, prevIndex, pageSize
            this.pagination.pageIndex = currIndex;
            this.refresh();
        },

        /**
         * 重新渲染table，用于解决一些莫名其妙的bug
         */
        repainTable () { 
            this.tableKey = new Date().getTime();
        },

        /**
         * 刷新表格数据
         */
        refresh () {
            this.refTable.reload();
        },

        /**
         * 清空选中并刷新表格
         *  @param {string} isShowTips: 是否显示加载成功的提示
         * */
        clearReload (isShowTips) {
            this.showSuccessTips = isShowTips;
            this.clearSelection();
            this.$emit('selection-change', []); // 触发调用模块回调
            this.refTable.reload();
        },
        
        /**
         * 设置表格分页参数
         * @param {object} options
         */
        setPagination (options) {
            this.defTableOptions.pagination.activePage = 1;
            this.anewPageIndex = options.pageIndex;
            this.isAnewConfigPage = true;
        },

        /**
         * 查询表格分页参数
         * @param {object} options
         */
        getPagination () {
            return this.defTableOptions.pagination;
        },

        /**
         * 获取当前选中数据
         * @returns {array}
         */
        getSelection () {
            return this.tableSelected.slice(0);
        },

        /**
         * 设置当前数据
         * @returns {array}
         */

        setSelections (record) {
            return this.refTable.setSelections(record);
        },

        /**
         * TODO
         */
        setSelection () {

        },

        /**
         * 清空当前选中数据
         */
        clearSelection () {
            this.tableSelected = [];
            this.refTable.setSelections([]);
            this.refTable.unSelectAll();
        },

        /**
         * columns 更新之后，手动刷新
         */
        updateColumns () {
            this.toggleColumns = this._getColumns();
            this.repainTable();
        },
        setSearchs (keyword) {
            let params = {keyword: keyword || ''};
            this.keyword = keyword;
            if (this.filters.length) {
                params.filter = this.filters[0].value;
            }

            this.refTable.setLoadParams(params);
            this.refTable.reload();
        },

        /**
         * 获取所选择的值
         * @returns {Array}
         * */
        getAllSelections () {
            return this.refTable.getAllSelections();
        },

        async _loadData (params) {
            params.start = params.start || 0;
            params.limit = params.limit || this.pageSize;
            let apiParams = Object.assign({}, params);
            
            if (this.showPagination) {
                apiParams.pageSize = params.limit;
                if (this.isAnewConfigPage) { // 如果配置了分页，使用新的，但只生效一次
                    this.isAnewConfigPage = false;
                    apiParams.pageIndex = this.anewPageIndex;
                } else {
                    apiParams.pageIndex = params.start / params.limit + 1;
                }
                
            }
            if (typeof this.handleLoadParams === 'function') {
                apiParams = this.handleLoadParams(apiParams);
                if (params === void (0)) {
                    return;
                }
                apiParams.searchID = apiParams.addSearchID ? this.searchID : '';
                delete apiParams.addSearchID;
            }

            if (apiParams.asc) {
                apiParams.asc = apiParams.asc.toLowerCase() === 'asc' ? 1 : 0;
            }

            delete apiParams.start;
            delete apiParams.limit;
           

            let resData;
            try {
                let { data } = await this.api(apiParams);
                resData = data;
                if (resData.data.searchID) {
                    this.searchID = resData.data.searchID;
                }
                if (this.showSuccessTips) {
                    this.showSuccessTips = false;
                    const DELAY_TIME = 2000;
                    this.$ok('刷新成功', {autoHide: true, delayTime: DELAY_TIME});
                }
            } catch {
                this.refTable.$unmask();
            }
            if (this.selectData.length) {
                let defaultSelectData = [];
                let loadResData = resData.data.data;
                loadResData.forEach(item => {
                    if (this.selectData.indexOf(item.id) >= 0) {
                        defaultSelectData.push(item);
                    }
                });
                this.refTable.setSelections(defaultSelectData);
            }
            if (resData) {
                resData.success = true;
            }       
            this.$emit('ready-load', resData);
            return resData;
        },

        _getCurrSelection () { // 当传入idProperty，表示需要获取所有的选中数据
            return this.tableOption.idProperty ? this.refTable.getAllSelections() : this.refTable.getSelections();
        },

        _handleSelectionChange () {
            let selected = this._getCurrSelection();
            this.$emit('selection-change', selected);
            this.tableSelected = selected;
        
            this.$nextTick(() => {
                this.tableAdaptive();
            });
        },

        _handleResize  () {
            const DEBOUNCE_TIME = 300;
            return debounce(DEBOUNCE_TIME, () => {
                this.tableAdaptive();
            });
        },
        isIE () {
            if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                return true;
            }
            return false; 
        },
        tableAdaptive () {
            
            const TOOLBAR_HEGIHT = 40; // toolbar高度
            let tableHeight,
                time = 0;

            // ie的下增加延时
            if (this.isIE()) {
                // eslint-disable-next-line
                time = 300;
            }

            // 某些样式会导致，dom挂载到页面上之后，高度还是不对
            // nextTick 微任务 无效，需要使用settimeout
            setTimeout(() => {
                if (this.showToolbar) {
                    tableHeight = this.$el.offsetHeight - TOOLBAR_HEGIHT;
                } else {
                    tableHeight = this.$el.offsetHeight;
                }
                Object.assign(this.table, {dynicHeight : tableHeight});
            }, time);
        },

        _getColumns () {
            const COLUMN_TAG_NAME = 'sf-table-column';
            return flattenTree(this.refTable, '$children')
                .filter(item => {

                    // 遍历所有子节点，找出所有column
                    return item.$options._componentTag === COLUMN_TAG_NAME && item.dataIndex;
                })
                .map(item => {
                    return { dataIndex: item.dataIndex, defaultShow: true };
                });
        },

        _handleSelect () {
            this.$emit('filter-change');
        },
        _handleSearchTxt (keyword) { // 没有过滤搜索条件时
            let params = {
                keyword: keyword || ''
            };
            this.refTable.setLoadParams(params);
            this.refTable.reload();
        },
        _handleSearch (type, searchText) { // 只有回车后，才确定值的变化
            let params = {};
            if (this.showFilter) {
                params.filter = type;
                params.keyword = searchText;
            } else {
                params.keyword = this.keyword;
            }
            this.refTable.setLoadParams(params);
            this.refTable.reload();
        },
        _pagechange (currPage) {
            this.$emit('pagechange', currPage);
        }
    }
};
</script>
