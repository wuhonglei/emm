<template>
    <div class="tree-pop-nav-wrapper">
        <ul class="nav__menu">
            <template v-for="item in navData">
                <el-popover 
                    v-if="item.children && item.children.length"
                    :key="item.name"
                    placement="right"
                    trigger="hover"
                    :offset="computeOffset(item)"
                    :visible-arrow="false"
                    popper-class="tree-icon-nav-wrapper tree-icon-nav-sub-wrapper">
                    <pop-nav 
                        :nav-data="item.children"
                        @click="handleClick" />
                    <li slot="reference"
                        class="nav__item"
                        :class="item.active ? 'nav__item--active' : 'nav__item--disactive'"
                        @click="handleClick(item)">
                        <span class="item__text">{{ item.text }}</span>
                        <i v-if="item.children && item.children.length"
                           class="el-icon-arrow-right submenu__icon"></i>
                    </li>
                </el-popover>

                <li v-else
                    :key="item.name"
                    class="nav__item"
                    :class="item.active ? 'nav__item--active' : 'nav__item--disactive'"
                    @click="handleClick(item)">
                    <span class="item__text">{{ item.text }}</span>
                    <i v-if="item.children && item.children.length"
                       class="el-icon-arrow-right submenu__icon"></i>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>

/**
 * 浮动导航组件
 */

export default {
    name: 'PopNav',
    props: {
        navData: {
            type: Array,
            required: true
        }
    },
    methods: {
        handleClick (item) {

            //  触发点击事件
            this.$emit('click', item);
            if (!item.active) {

                //  触发路由跳转事件
                this.$emit('skip', item);
                this.$router.push(item.path);
            }
        },
        computeOffset (item) {
            if (item.children.length === 1) {
                return 0;
            }

            // eslint-disable-next-line no-magic-numbers
            return item.children.length * 40 / 2 - 20;
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";
.tree-pop-nav-wrapper {
    background: white;
    width: 176px;
    color: #444444;
    font-size: 14px;

    & .nav__menu {
        list-style: none;
        padding-left: 12px;
        padding: 0;
        margin:8px 0;

        & .nav__item {
            position: relative;
        }

        & .item__text {
            display: inline-block;
            box-sizing: border-box;
            padding-left: 12px;
            width: 100%;
            height: 40px;
            line-height: 40px;
        }
        & .nav__item--disactive:hover {
            cursor: pointer;
            color: var(--primary-color);
        }
        & .nav__item--active {
            background-color: var(--primary-color);
            color: white;
        }
        & .nav__item--active:hover {
            cursor: pointer;
        }

        & .submenu__icon {
            display: inline-block;
            position: absolute;
            top: 10px;
            right: 10px;
            line-height: 20px;
            width: 20px;
            height: 20px;
        }
    }

}
.tree-icon-nav-wrapper{
    &.el-popover{
        &.tree-icon-nav-sub-wrapper{
            margin-left: 8px;
        }
    }
}
</style>
