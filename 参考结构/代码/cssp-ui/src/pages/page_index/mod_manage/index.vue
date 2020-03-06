<template>
    <div class="mod-manage-wrapper mod-page">
        <tree root-path="/manage" />
        <div class="content">
            <breadcrumb />
            <router-view />
        </div>
    </div>
</template>

<script>

/**
 * 日志管理模块入口 
 */

import tree from 'src/common/components/layout/tree/index';
import breadcrumb from 'src/common/components/breadcrumb';
export default {
    components: {
        tree,
        breadcrumb
    }
};
</script>

<style lang="postcss">
.mod-manage-wrapper {
    display: flex;
}
.mod-manage-wrapper > .content {
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    box-sizing: border-box;
    width: 100%;
}
</style>
