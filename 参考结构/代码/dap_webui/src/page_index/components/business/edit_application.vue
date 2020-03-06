<template>
    <div class="edit-application-wrapper h-100">
        <div class="margin1">
            <sf-light-tree
                ref="treePage"
                :default-width="220"
                :default-height="453"
                :data="treeData"
                @select-node="selectTreeNode" />
        </div>
        <div class="root__right">
            <transfer
                v-if="loadTable"
                ref="chooseTransfer"
                :api="getAllResList"
                :filters="filterSelect"
                :search-options="searchOptions"
                :handle-load-params="handleLoadParams"
                :show-pagination="false"
                :show-filter="false"
                :choose-data="resourceIds"
                search-text="输入名称搜索"
                :transfer-height="445"
                :left-width="402"
                :right-width="325">
                <template slot="leftTable">
                    <sf-table-column 
                        data-index="name"
                        title="名称">
                        <template
                            slot-scope="nameItem">
                            <!-- eslint-disable-next-line -->
                            <i class="iconfont table-iconfont" v-html="handleIcon(nameItem.record, 'icon')"></i>
                            <span>{{ nameItem.record.name }}</span>
                        </template>
                    </sf-table-column>
                    <sf-table-column data-index="description">
                        描述
                    </sf-table-column>
                </template>
                <template slot="rightTable">
                    <sf-table-column data-index="name">
                        名称
                    </sf-table-column>
                    <sf-table-column data-index="description">
                        描述
                    </sf-table-column>
                </template>
            </transfer>
        </div>
    </div>
</template>

<script>

/**
 *  编辑授权应用
 */

import { getResTree, getResList, getResByGrpID } from 'src/api/resource_manage';
import handleExt from 'src/page_index/mixins/handle_ext';
import transfer from 'src/page_index/components/transfer';
import utils from 'src/utils/utils_data';

export default {
    components: { 
        transfer
    },
    mixins: [handleExt],
    props: {
        selectedData: {
            type: Array,
            default () {
                return [];
            }
        }
    },
    data () {
        return {
            getResList, // 加载所有的应用列表
            getResByGrpID, //根据组id 获取组下面所有的应用
            getAllResList: getResList,
            treeData: [],
            tableChecked: [],
            filterSelect: utils.getFilterText(['name']),
            searchOptions: {},
            isNeedParams: false,
            treeID: '',
            loadTable: false, // 控制右边的表格是否显示， 主要作用是是否需要传值
            resourceIds: []
        };
    },

    mounted () {
        this.loadTree();
        
        if (this.selectedData.length) { // 编辑角色，有选中的应用， 打开应用弹框， 需要选中先前的应用
            this.resourceIds = this.selectedData.map(item => {
                return item.id;
            });
        }
    },

    methods: {
        getJsonValue () {
            return this.$refs.chooseTransfer.selectedData;
        },
        reloadResource () {
            this.$refs.chooseTransfer.refresh();
        },
        selectTreeNode (record) {
            this.loadTable = false;
            this.treeID = record.id;
            if (record.id) { // id 为0 默认为显示全部应用
                this.isNeedParams = true;
                this.getAllResList = this.getResByGrpID;
            } else {
                this.isNeedParams = false;
                this.getAllResList = this.getResList;
            }
            this.loadTable = true;
            this.$nextTick(() => {
                this.reloadResource();
            });
        },
        loadTree () {
            getResTree().then((res) => {
                if (!res.data) { // 返回数据失败
                    this.$showErr('加载应用左树失败');
                    return;
                }

                this.loadTable = true;
                this.treeData = [{
                    id: 0,
                    name: '全部应用',
                    children: res.data.data.data
                }];
            }).catch();
        },
        handleLoadParams (params) {
            params.isPage = '0'; // 不需要分页
            if (this.isNeedParams) { // 两个接口，查询所有的应用和应用分类 不需要id 
                params.id = this.treeID;
            }
            return params;
        }
    }
};
</script>

<style lang="postcss">
.edit-application-wrapper {
    display: flex;
}
</style>
