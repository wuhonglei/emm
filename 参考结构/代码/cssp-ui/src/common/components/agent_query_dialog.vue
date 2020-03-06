<template>
    <el-dialog
        v-if="showDialog"
        v-model="showDialog"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        custom-class="agent-query-dialog-wrapper">
        <div class="dialog-left-wrapper">
            <div class="tree-wrapper">
                <div class="dialog__title">
                    {{ title }}
                </div>
                <div class="dialog__content">
                    <el-tree
                        v-if="hackReset"
                        ref="tree"
                        :data="treeData"
                        show-checkbox="show-checkbox"
                        default-expand-all="default-expand-all"
                        :expand-on-click-node="false"
                        node-key="name_ip"
                        :props="{label: 'name'}"
                        :empty-text="treeLoading ? '加载中' : '暂无数据'"
                        :render-content="renderContent" 
                        :default-checked-keys="treeValue" 
                        @node-click="handleNodeClick" 
                        @check-change="handleCheckChange" />
                </div>
            </div>
            <div
                v-loading="tableLoading"
                class="table-wrapper">
                <div class="dialog__title">
                    <span>搜索</span>
                    <el-input
                        v-model="searchQuery"
                        class="right"
                        icon="search" />
                </div>
                <div class="dialog__content">
                    <el-table
                        ref="pageTable"
                        :data="tableData"
                        stripe="stripe"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" />
                        <el-table-column
                            :label="currentNode.name"
                            prop="name_ip" />
                    </el-table>
                </div>
                <div class="grp-pagination">
                    <el-pagination
                        small="small"
                        layout="total, prev, pager, next"
                        :current-page="pagination.page"
                        :total="pagination.total"
                        :page-size="pagination.size"
                        @current-change="handleCurrentChange" />
                </div>
            </div>
        </div>
        <div class="dialog-right-wrapper">
            <div class="dialog__title dialog__title-bottom">
                <span>已选列表</span>
                <svg-icon
                    class="right"
                    icon-class="clear"
                    @click.native="handleClearSelecet" />
            </div>
            <div class="dialog__content">
                <el-tree
                    expand-on-click-node="expand-on-click-node"
                    node-key="name"
                    :data="selectsTree"
                    :default-expanded-keys="selectsExpands"
                    :props="{label: 'name'}"
                    :render-content="renderContent"
                    empty-text="没有选择数据"
                    @node-expand="handleSelectTreeExpand"
                    @node-collapse="handleSelectTreeCollapse" />
            </div>
        </div>
        
        <span slot="title">{{ title }}</span>

        <span slot="footer">
            <el-button
                type="primary"
                @click="handleSubmit">确定</el-button>
            <el-button @click="showDialog = false">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>

/**
* 弹窗
*/

import treeHandler from 'src/common/mixins/tree_handler';

export default {
    mixins: [treeHandler],
    props: {
        title: {
            type: String,
            default () {
                return '';
            }
        },
        resultFilter: {
            type: Function,
            default () {
                return false;
            }
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
        initSelects: {
            type: Array,
            required: true
        },
        initTreeData: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            treeData: [],
            nodeData: [],
            currentNode: {},
            rootNode: {},
            hackReset: true,
            treeValue: ['0'],
            selectsTree: [],
            selectsExpands: [],
            treeLoading: false,
            ifTableInit: false,
            tableLoading: 0,
            showDialog: false,
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

    mounted () {
        this.$on('open', () => {
            this.showDialog = true;
            this.initForm();
            if (!this.treeData.length) {
                this.loadTree();
            }
            if (this.initSelects.length) {
                this.$nextTick(() => this.selectsTree = this.resolveSelectTree(this.treeData[0].children));
            }
        });
        this.$on('close', () => {
            this.showDialog = false;
        });
        this.hideNodes = [];
        
    },

    updated () {
        this.updateTreeView();
    },

    methods: {

        initForm () {
            this.selectsTree = [];
            this.treeData = [];
            this.currentNode = {};
            this.rootNode = {};
            this.selectsExpands = [];
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
                        this.$refs.tree.setChecked(item.name_ip, true, false);
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
            let nameIp = 'name_ip';
            let dataName = data[nameIp].toUpperCase();
            query = query.toUpperCase();
            if (!query) {
                return true;
            }
            return dataName.indexOf(query) >= 0;
        },

        loadTree () {
            if (this.initTreeData && this.initTreeData.length) {
                this.treeData = this.initTreeData;
                return;
            }
            this.treeLoading = true;
            this.loadTreeData()
                .then(({data}) => {
                    let treeData = data.data || [];

                    if (treeData[0]) {
                        treeData[0]._root = true;
                        treeData[0][this.dataLabel] = '所有';
                        this.rootNode = this.currentNode = treeData[0];

                        // this.$nextTick(() => {
                        //     this.$refs.tree.setChecked(treeData[0], true, true);
                        // })
                        this.setTree(this.currentNode, false);
                        this.treeData = treeData;
                    }
                })
                .catch(() => {})
                .finally(() => {
                    this.treeLoading = false;
                });
        },

        loadNode (node) {
            let groupLeaves = [], 
                agents = [];
            let inCurrent = this.isSuper(this.currentNode, node);
            this.findLeaves(node, groupLeaves, agents);
            if (node === this.currentNode) {
                this.nodeData = agents;
            }
            groupLeaves = groupLeaves.filter(leaf => !leaf._loading);
            if (groupLeaves.length) {
                this.tableLoading += groupLeaves.length;
                groupLeaves.forEach(leaf => {
                    leaf._loading = true;
                    this.loadNodeData(leaf)
                        .then(({data}) => {
                            if (data.data) {
                                data.data.forEach(item => { 
                                    item._checked = leaf._checked;
                                });
                                leaf.children = data.data;
                                this.hackReset = false;
                                this.$nextTick(() => {
                                    this.hackReset = true;
                                });

                                //  为当前节点的后代节点时，自动加入表格展示的数据
                                if (!inCurrent) {
                                    this.selectsTree = this.resolveSelectTree(this.treeData[0].children);
                                }
                            }
                        })
                        .catch(() => {})
                        .finally(() => {
                            leaf._loading = false;
                            this.tableLoading -= 1;
                            if (!this.tableLoading && inCurrent) {
                                let agents = [];
                                this.findLeaves(this.currentNode, [], agents);
                                this.nodeData = agents;
                            }
                        });
                });
            }
        },

        //  寻找叶子组和终端，分别放在groups和agents中
        findLeaves (node, groups, agents) {
            if (node.children) {
                node.children.forEach(item => {
                    this.findLeaves(item, groups, agents);
                });
            } else {
                node._notAgent ? groups.push(node) : agents.push(node);
            }
        },

        // subNode是否是node的后代节点
        isSuper (node, subNode) {
            if (node === subNode) {
                return true;
            }
            return node.children && node.children.some(item => this.isSuper(item, subNode));
        },

        handleNodeClick (node) {
            this.currentNode = node;
            this.loadNode(node);
        },

        handleClearSelecet () {
            let tree = this.$refs.tree;
            tree.setCheckedNodes([]);
        },

        setTree (tree) {
            tree._notAgent = true;
            tree.name_ip = tree.name;
            if (tree.children) {
                tree.children.forEach(node => this.setTree(node));
            }
        },

        handleCurrentChange (page) {
            this.pagination.page = page;
        },

        handleCheckChange (node, checked, childrenChecked) {
            if (node._checked === checked) {
                return;
            }
            this.treeValue = this.$refs.tree.getCheckedKeys();
            node._checked = checked;
            node._childrenChecked = childrenChecked;
            if (this.tableData.indexOf(node) >= 0) {
                this.$refs.pageTable.toggleRowSelection(node, checked);
            }
            if (checked) {
                this.loadNode(node);
            }
            this.selectsTree = this.resolveSelectTree(this.treeData[0].children);
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
            this.selectsTree = this.resolveSelectTree(this.treeData[0].children);
        },

        computeIcon (data) {
            if (this.icon) {
                return this.icon(data);
            }
            return data._notAgent ? 'folder' : '';
        },

        renderContent (createEl, { data }) {
            let el;
            if (data._notAgent) {
                let icon = createEl('svg-icon', {attrs: { iconClass: this.computeIcon(data)}});
                el = createEl('span', [icon, ' ' + data.name]);
            } else {
                el = createEl('span', {'class': ['node--agent', 'ellipsis'], attrs: {title: data.name}}, [data.name]);
            }

            //  左边树的终端才不显示
            if (!data._notAgent && !data.realNode) {
                this.hideNodes.push(el);
            }
            return el;
        },

        //显示名称，终端将显示包含ip的名称
        displayName (data) {
            if (data._notAgent) {
                return data.name;
            }
            return data.name_ip;
        },

        updateTreeView () {
            this.hideNodes.forEach(node => {
                node.elm.parentNode.parentNode.style.display = 'none';
            });
            this.hideNodes = [];
        },

        //  生成右侧树
        resolveSelectTree (level) {
            return level.reduce((res, item) => {
                let node = {
                    id: item.id,
                    name: item.name_ip || item.name,
                    _notAgent: item._notAgent,
                    realNode: item
                };
                if (!item._notAgent && item._checked) {
                    res.push(node);
                } else if (item.children) {
                    let children = this.resolveSelectTree(item.children);
                    if (children.length) {
                        node.children = children;
                        res.push(node);
                    }
                }
                return res;
            }, []);
        },

        // 右侧选择树的展开项记录
        handleSelectTreeExpand ({name}) {
            this.selectsExpands.push(name);
        },
        handleSelectTreeCollapse ({name}) {
            this.selectsExpands.splice(this.selectsExpands.indexOf(name), 1);
        },

        handleSubmit () {
            let selectsList = this.$refs.tree.getCheckedNodes();
            this.$emit('submit', selectsList, this.treeData);
            this.showDialog = false;
        }
    }
};
</script>

<style lang="postcss">
.agent-query-dialog-wrapper{ 
    width: 630px;
    & .el-dialog__body {
        height: 500px;
        display: flex;
        flex-flow: row nowrap;
        align-items: stretch;
        justify-content: space-around;
        padding: 8px !important;
    }
    & .dialog-left-wrapper {
        display: flex;
        width: 350px;
        flex-flow: column nowrap;
        justify-content: space-between;

        & .tree-wrapper {
            width: 100%;
            height: 180px;
        }
        & .table-wrapper {
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
            width: 100%;
            height: 315px;
        }
    }
    & .dialog-right-wrapper {
        width: 250px;
        display: flex;
        flex-flow: column nowrap;
    }
    & .dialog__title {
        position: relative;
        font-size: 13px;
        padding: 2px 5px;
        height: 30px;
        line-height: 30px;
        color: #000;
        background: #eaeff5;
        box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.15);

        &>.right {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    & .dialog__content {
        flex-grow: 1;
        box-sizing: border-box;
        border: 1px solid #ddd;
        max-height: calc(100%-30px);
        max-width: 100%;
        overflow-y: auto;

        &>.el-table, &>.el-tree {
            height: 100%;
            border: none;
            max-width: 100%;
            overflow-x: auto;
        }
        & .node--agent {
            display: inline-block;
            max-width: 160px;
        }
    }
    & .dialog__title-bottom {
        background: #F3F8FC;
    }
    & .el-input {
        width: 150px;
    }
    & .grp-pagination {
        box-sizing: border-box;
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        height: 32px;
    }
}
</style>

