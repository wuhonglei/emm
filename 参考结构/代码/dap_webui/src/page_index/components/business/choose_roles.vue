<template>
    <div class="choose-roles-wrapper">
        <transfer
            ref="chooseTransfer"
            :api="getRoleList"
            :filters="filterSelect"
            :search-options="searchOptions"
            :show-pagination="false"
            :choose-data="selectData"
            :handle-load-params="handleLoadParams">
            <template slot="leftTable">
                <sf-table-column data-index="name">
                    角色名称
                </sf-table-column>
                <sf-table-column data-index="description">
                    描述
                </sf-table-column>
            </template>
            <template slot="rightTable">
                <sf-table-column data-index="name">
                    角色名称
                </sf-table-column>
                <sf-table-column data-index="description">
                    描述
                </sf-table-column>
            </template>
        </transfer>
    </div>
</template>

<script>

/**
 * 选择用户
 */

import transfer from 'src/page_index/components/transfer';
import { getRoleList } from 'src/api/role_manage';
import utils from 'src/utils/utils_data';

export default {
    components: { 
        transfer
    },

    props: {
        roleIdList: { // 选中角色的数组
            type: Array,
            default () {
                return [];
            }
        }
    },

    data () {
        return {
            getRoleList,
            filterSelect: utils.getFilterText(['roleName', 'description']),
            searchOptions: {},
            selectData: [] // 编辑的时候，开始被选中的数据
        };
    },
    mounted () {
        this.selectData = this.roleIdList;
    },
    methods: {
        getJsonValue () {
            return this.$refs.chooseTransfer.selectedData;
        },

        // 表格传参数
        handleLoadParams (params) {
            params.isPage = '0'; // 不需要分页
            return params;
        }
    }
};
</script>

<style lang="postcss">
.choose-roles-wrapper {
    font-size: 12px;
}
</style>
