<template>
    <div
        id="app"
        class="app h-100">
        <navigation />
        <page>
            <left-nav slot="left" />
            <router-view />
        </page>
    </div>
</template>

<script>

/**
 * 主页面根组件
 */

import Navigation from 'src/page_index/components/navigation';
import Page from 'src/page_index/components/layout/page';
import LeftNav from 'src/page_index/components/layout/left_nav';

export default {
    components: {
        Navigation,
        Page,
        LeftNav
    }
};
</script>
