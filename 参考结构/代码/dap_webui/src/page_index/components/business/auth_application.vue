<template>
    <div class="auth-application-wrapper inline-block">
        <sf-grid>
            <sf-toolbar ref="toolbar">
                <sf-button-blank
                    @click="authorizedApplication">
                    授权应用
                    <i slot="icon"
                       class="iconfont icon-bar-compatible">
                        &#xe660;
                    </i>
                </sf-button-blank>
            </sf-toolbar>
            <sf-table 
                ref="table"
                :options="tableOptions"
                :default-height="320">
                <sf-table-column data-index="name"
                                 title="名称">
                    <template
                        slot-scope="nameItem">
                        <!-- eslint-disable-next-line -->
                        <i class="iconfont table-iconfont" v-html="handleIcon(nameItem.record, 'icon')"></i>
                        <span>
                            {{ nameItem.record.name }}
                        </span>
                    </template>
                </sf-table-column>
                <sf-table-column data-index="type"
                                 title="类型">
                    <template
                        slot-scope="scope">
                        <span v-if="scope.record.type === 'resourceGrp'">应用分类</span>
                        <span v-else>{{ scope.record.type }}</span>
                    </template>
                </sf-table-column>
                <sf-table-column data-index="level"
                                 title="应用等级">
                    <template 
                        slot-scope="scope">
                        {{ handleLevel(scope.record.level) }}
                    </template>
                </sf-table-column>
                <sf-table-column data-index="description">
                    描述
                </sf-table-column>
            </sf-table>
        </sf-grid>
    </div>
</template>

<script>

/**
 *  授权应用
 */

import EditApplication from  'src/page_index/components/business/edit_application';
import handleExt from 'src/page_index/mixins/handle_ext';

export default {
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
            tableOptions: {
                rowHeight: 40,

                // 不显示勾选框列
                selectionHide: true,
                data: []
            }
        };
    },
    watch: {
        selectedData () {
            this.tableOptions.data = this.selectedData;
        }
    },
    mounted () {
        
        // 初始化表格的数据
        this.tableOptions.data = this.selectedData;
    },
    methods: {
        authorizedApplication () { // 编辑授权应用
            let that = this;
            let EditApplicationWin = this.$modal(EditApplication, {
                title: '授权应用',
                autoDestroy: true,
                width: 960,
                height: 540,
                props: {
                    selectedData: this.selectedData
                },
                submit: function () {
                    let winThis = this;
                    let params = winThis.formRoot.getJsonValue();
                    that.tableOptions.data = params.filter(item => { // 去掉表格的选中， 初始化全部为不选中
                        return delete item.selected;
                    });
                    that.$emit('table-change', that.tableOptions.data);
                    EditApplicationWin.destroy();
                    EditApplicationWin = null;
                }
            });
            EditApplicationWin.open();
        }
    }
};
</script>
<style lang="postcss">
.auth-application-wrapper {
    max-width: 768px;
    border: 1px solid var(--border-second-color);
}
</style>