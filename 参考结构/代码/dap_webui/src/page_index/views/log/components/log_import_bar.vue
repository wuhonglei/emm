<template>
    <div class="log-import__wrapper">
        <div class="log-import__bg">
            <div class="log-import__bar"
                 :style="{'width':width + '%'}"></div>
        </div>
        <div class="log-import__schedule">
            {{ width }}%
        </div>
    </div>
</template>

<script>

/**
 * 日志导出进度条模板
 */

export default {
    name: 'LogImport',
    data () {
        return {
            width: 0
        };
    }
};
</script>

<style lang="postcss">
.log-import__wrapper {
    box-sizing: border-box;
    padding: 0px 20px;
    overflow: hidden;
    margin-top: 50px;

    & .log-import__bg {
        background-color: #f5f5f5;
        height: 10px;
        margin-top: 2px;
        display: inline-block;
        width: 388px;
        border-radius: 10px;
        overflow: hidden;
        & .log-import__bar {
            background-color: #64c2f8;
            height: 10px;
            margin: 0;
            z-index: 1;
            border-radius: 10px;
        }
    }
    & .log-import__schedule {
        width: 40px;
        margin-left: 10px;
        display: inline-block;
    }
}
</style>


