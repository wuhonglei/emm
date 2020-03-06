<template>
    <div class="net_deploy_wrapper h-100">
        <path-panel
            ref="pathPanel"
            :root="paths.list">
            <path-panel-item
                name="list">
                <list
                    ref="list"
                    @change-panel-path="handleChangePanelPath" />
            </path-panel-item>
        </path-panel>
    </div>
</template>
<script>

/**
 * 系统日志
 */

import PathPanel from 'src/page_index/components/path_panel';
import PathPanelItem from 'src/page_index/components/path_panel/item';
import List from './list';

export default {
    name: 'SystemLog',
    components: {
        PathPanel,
        PathPanelItem,
        List
    },
    data () {
        return {
            paths: {
                list: {
                    name: _('系统日志'),
                    value: 'list'
                }
            }
        };
    },
    methods: {
        
        /*
         *  toPath 跳转位置
         *  model 模式，对应所需要的操作，操作同时对应paths，操作的中文名字同时在paths中对应
         *  payload 传递的数据（格式可根据业务制定，一般建议为数组）
         *  toBack 需要跳转指定位置名称，默认为空
         */
        handleChangePanelPath (toPath) {
            this.$refs.pathPanel.push(this.paths[toPath]);
        }
    }
};
</script>
