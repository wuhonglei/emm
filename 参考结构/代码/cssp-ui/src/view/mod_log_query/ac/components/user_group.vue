<template lang="pug">
.user-group-dialog-wrapper
    el-dialog.user-group-dialog-wrapper(
        ref="dialog"
        v-model="dialogVisiable"
        v-if="dialogVisiable"
        :before-close="cancels"
        custom-class="cssp-dialog-m")
        .dialog-left-wrapper
            .tree-wrapper
                .dialog__title {{title}}
                .dialog__content
                    el-tree(:data="treeData"
                        ref="tree"
                        show-checkbox
                        :expand-on-click-node="false"
                        :node-key="dataKey"
                        :props="{label:dataLabel}"
                        :empty-text="treeLoading ? '加载中' : '暂无数据'"
                        :render-content="renderContent"
                        @node-click="handleNodeClick"
                        @check-change="handleCheckChange")
            .table-wrapper(v-loading="tableLoading")
                .dialog__title 
                    span 搜索
                    el-input(icon="search" v-model="searchQuery")
                .dialog__content
                    .table
                        el-table(:data="tableData" 
                            ref="pageTable"
                            @selection-change="handleSelectionChange")
                            el-table-column(type="selection")
                            el-table-column(label="名称" :prop="dataLabel")
                            el-table-column(label="类型" width="80")
                                template(slot-scope="scope") {{dataType(scope.row)}}
                .grp-pagination
                    el-pagination(:current-page="pagination.page"
                        :total="pagination.total"
                        :page-size="pagination.size"
                        @current-change="handleCurrentChange"
                        layout="total, prev, pager, next")
        .dialog-right-wrapper
            .dialog__title  已选列表
            .dialog__title.dialog__title-bottom
                span 用户
                svg-icon.clear-icon(icon-class="clear" @click.native="handleClearSelecet")
            .dialog__content
                ul
                    li(v-for="item in selectTableData"
                        :key="item[dataKey]") 
                        svg-icon(:icon-class="computeIcon(item)")
                        span {{ item[dataLabel] || '所有' }}
        .clearfix
        span(slot="title") {{title}}
        span(slot="footer")
            el-button(type="primary" @click="handleSubmit") 确定
            el-button(@click="cancels") 取消

</template>

<script>

/**
* AC 用户组组件
*/

export default {
    props: {
        title: {
            type: String,
            required: true
        },
        resultFilter: {
            type: Function,
            required: true
        },
        icon: {
            type: [Boolean, Function],
            default: false
        },
        loadTreeData: {
            type: Function,
            required: true
        },
        loadNodeData: {
            type: Function,
            required: true
        },
        searchFilter: {
            type: [Boolean, Function],
            default: false
        },
        dataKey: {
            type: String,
            default: 'id'
        },
        dataLabel: {
            type: [String, Function],
            default: 'real_name'
        },
        dataType: {
            type: Function,
            required: true
        },
        initSelects: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            dialogVisiable: false,
            treeData: [],
            nodeData: [],
            currentNode: {},
            selectTableData:[],
            treeLoading: false,
            ifTableInit: false,
            tableLoading: false,
            searchQuery: '',
            pagination: {
                page: 1,
                total: 0,
                size: 6
            }
        };
    },

    computed: {

        //处理用户数据表格分页
        tableData () {
            let page = this.pagination.page;
            let size = this.pagination.size;
            let filter = this.searchFilter || this.defaultSearchFilter;
            
            this.changeTableInitStatus(true);

            return  this.nodeData.filter(item => filter(item, this.searchQuery)).slice((page - 1) * size, size * page);
        }
    },

    watch: {
        nodeData () {
            this.pagination.total = this.nodeData.length;
        },
        tableData () {
            this.$nextTick(() => {
                this.changeTableInitStatus(false);
                this.$refs.pageTable.setSelections(this.tableData.filter(item => item._checked));
            });
        },
        treeData () {
            this.selectTree();
        }
    },

    updated () {
        this.updateTreeView();
    },

    mounted () {
        this.$on('open', (data) => {
            this.dialogVisiable = true;
            this.initForm(data);
            if (!this.treeData.length) {
                this.loadTree();
            }
            
            this.$nextTick(() => {
                document.body.appendChild(this.$refs.dialog.$el);
            });
        });
        this.hideNodes = [];
    },

    methods: {

        initForm (data) {
            this.selectTableData = [];
            if (data && data.length) {
                this.selectTableData = data;
            }
            this.searchQuery = '';
            this.nodeData = [];
            this.pagination = {
                page: 1,
                total: 0,
                size: 6
            };
            this.selectTree();
        },

        selectTree () {
            this.$nextTick(() => {
                if (this.initSelects && this.initSelects.length) {
                    this.initSelects.forEach(item => {
                        if (item.id === '0') {
                            this.$refs.tree.setChecked('0', true, true);
                        } else {
                            this.$refs.tree.setChecked(item[this.dataKey], true, false);
                        }
                    });
                } else {
                    this.$refs.tree.setChecked('0', true, true);
                }
            });
        },

        changeTableInitStatus (status = true) {
            this.ifTableInit = status;
        },

        defaultSearchFilter (data, query) {
            if (!query) {
                return true;
            }
            return data[this.dataLabel].indexOf(query) >= 0;
        },

        loadTree () {
            this.treeLoading = true;
            this.loadTreeData()
                .then(({data}) => {
                    this.treeData = data.data || [];
                    if (this.treeData[0]) {
                        this.treeData[0][this.dataLabel] = '所有';
                        this.treeData[0][this.dataKey] = '0';
                        this.currentNode = this.treeData[0];
                    }
                })
                .catch(() => {})
                .finally(() => {
                    this.treeLoading = false;
                });
        },

        // 点击节点时，加载详情
        handleNodeClick (node) {
            if (this.nodeData === node.children) {
                return;
            }
            
            // 设置当前显示表格，激活的节点
            this.currentNode = node;

            //将组下的用户放入pageTableData
            if (node.loaded) {
                this.nodeData = node.children;
                return;
            }

            // api 加载数据
            this.tableLoading = true;
            this.loadNodeData(node)
                .then(({data}) => {
                    if (data.data && data.data.length) {
                        data.data.forEach(item => item._checked = node._checked);
                        node.children.push(...data.data);
                    }
                    node.loaded = true;
                    this.nodeData = node.children;
                })
                .catch((err) => {
                    this.$error(err, '加载详情失败');
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },

        handleClearSelecet () {
            let tree = this.$refs.tree;
            tree.getCheckedNodes().forEach(item => {
                tree.setChecked(item, false, true);
            });

            // 解决点删除按钮会残留组问题
            this.$nextTick(()=>{
                this.$refs.pageTable.clearSelection();
                this.nodeData.forEach(item=>{
                    item._checked = false;
                });
                this.selectTableData = [];
            });
        },

        setTreeChecked (tree, checked = true) {
            tree._checked = true;
            if (tree.children) {
                tree.childrenChecked = true;
                tree.children.forEach(node => this.setTreeChecked(node, checked));
            }
        },

        handleCurrentChange (page) {
            this.pagination.page = page;
        },

        handleCheckChange (node, checked, childrenChecked) {
            if (node._checked === checked) {
                return;
            }
            node._checked = checked;
            node.childrenChecked = childrenChecked;
            if (this.tableData.indexOf(node) >= 0) {
                this.$refs.pageTable.toggleRowSelection(node);
            }
            this.resolveSelect();
        },

        handleSelectionChange (selects) {
            if (this.ifTableInit) {
                return;
            }
            let tree = this.$refs.tree;
            this.tableData.forEach(item => {
                if (item._checked === (selects.indexOf(item) !== -1)) {
                    return;
                }
                item._checked = selects.indexOf(item) !== -1;
                tree.setChecked(item, item._checked, true);
            });
            this.resolveSelect();
        },

        computeIcon (data) {
            if (this.icon) {
                return this.icon(data);
            }
            return data.children ? 'folder' : '';
        },

        renderContent (createEl, { data, node }) {
            let icon = createEl('svg-icon', { attrs:{ iconClass: this.computeIcon(data) } });
            let el = createEl('span', data.children ? [icon, node.label] : node.label);
            if (! data.children) {
                this.hideNodes.push(el);
            }
            return el;
        },

        updateTreeView () {
            this.hideNodes.forEach(node => {
                node.elm.parentNode.parentNode.style.display = 'none';
            });
            this.hideNodes = [];
        },

        resolveSelect () {
            if (!this.resultFilter) {
                this.selectTableData = this.$refs.tree.getCheckedNodes();
            } else {
                this.selectTableData = [];
                this.travelTree(this.treeData[0]);
            }
        },

        travelTree (root) {
            let [ select, travelDown ] = this.resultFilter(root);
            if (select) {
                this.selectTableData.push(root);
            }
            
            if (travelDown && root.children) {
                root.children.forEach(node => {
                    if (!node.children && select) {
                        return;
                    }
                    this.travelTree(node);
                });
            }
        },

        handleSubmit () {
            this.dialogVisiable = false;
            this.$emit('submit', this.selectTableData);
        },

        cancels () {
            this.dialogVisiable = false;
        }
    }
};
</script>

<style lang="postcss">
.user-group-dialog-wrapper{
    & .el-tree {
        border: none;
    }
    & .el-tree-node__children {
        overflow: inherit;
    }
    & .el-dialog__body {
        padding: 8px !important;
    }
    & .dialog-left-wrapper {
        float: left;
        & .tree-wrapper {
            width: 414px;
            height: 222px;
            max-height: 222px;
            border: 1px solid #ddd;
            margin-bottom: 9px;
        }
        & .table-wrapper {
            width: 414px;
            height: 310px;
            border: 1px solid #ddd;
        }
    }
    & .dialog-right-wrapper {
        float: right;
        width: 198px;
        height: 543px;
        border: 1px solid #ddd;
    }
    & .clearfix{
        clear: both;
    }
    & .dialog__title {
        font-size: 13px;
        padding-left: 8px;
        padding-top: 7px;
        color: #000;
        height: 25px;
        background: #eaeff5;
        box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.15);
    }
    & .dialog__content {
        height: calc(100% - 32px);
        color: #3B4967;
        overflow: auto;
        &>.table {
            height: 100%;
        }
        &>ul li {
            margin-left: -30px;
            list-style: none;
        }
    }
    & .dialog__title-bottom {
        background: #F3F8FC;
    }
    & .el-input {
        width: 220px;
        height: 24px;
        padding-left: 125px;
        margin-top: -3px;
    }
    & .el-input__inner {
        height: 24px;
    }
    & .clear-icon {
        width: 14px;
        height: 14px;
        padding-left: 135px;
    }
    & .grp-pagination {
        height: 32px;
        box-sizing: border-box;
        background-color: #F8FBFD;
        flex-shrink: 0;
    }
}
</style>

