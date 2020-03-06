<template>
    <page-content>
        <router-view />
    </page-content>
</template>

<script>

/**
 * 日志管理
 */

import PageContent from 'src/page_index/components/layout/page_content';
import './style/log_manage.css';

export default {
    name: 'LogManage',
    components: {
        PageContent
    }
};
</script>
