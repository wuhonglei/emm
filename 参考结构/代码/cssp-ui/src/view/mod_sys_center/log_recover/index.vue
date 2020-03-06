<template>
    <div
        v-loading="loading"
        class="recover-wrapper second-page">
        <div class="recover__top">
            <recover-file />
        </div>
        <div class="recover__bottom">
            <div class="bottom__title">
                恢复记录
            </div>
            <recover-table />
        </div>
    </div>
</template>

<script>

/**
 * 日志恢复
 */

import recoverTable from './table';
import recoverFile from './file';
export default {
    components: {
        recoverTable,
        recoverFile
    },
    data () {
        return {
            loading: false
        };
    }
};
</script>

<style lang="postcss">
@import 'src/common/assets/css/var.css';
.recover-wrapper {
    height: 100%;
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    & .recover__top {
        height: 180px;
        width: 100%;
    }
    & .recover__bottom {
        height: 100%;
        width: 100%;
        display: flex;
        flex-flow: column;
        box-sizing: border-box;
        padding: 16px;
    }
    & .bottom__title {
        font-size: 13px;
        padding-left: 10px;
        padding-bottom: 16px;
        position: relative;
        height: 20px;
        line-height: 20px;
        &::before {
            content: '';
            height: 20px;
            width: 4px;
            position: absolute;
            left: 0;
            right: 0;
            background-color: var(--primary-color);
        }
    }
}
</style>
