<template>
    <div class="popover">
        <el-popover
            placement="right"
            :width="width"
            trigger="hover">
            <slot></slot>
            <div
                slot="reference"
                class="el-icon-information"></div>
        </el-popover>
    </div>
</template>

<script>

/** 
 * @description 提示错误信息的popover
 */

export default {
    props: {
        width: {
            type: Number,
            default: 150
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";

.popover {
    display: inline-block;
    & .el-icon-information {
        margin-left: 5px;
        color: #209797;
    }
}
</style>
