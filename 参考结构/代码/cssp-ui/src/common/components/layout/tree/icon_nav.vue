<template>
    <div class="tree-icon-nav-wrapper">
        <div v-for="item in navData"
             :key="item.name"
             class="icon-nav__menu">
            <el-popover 
                v-if="item.children && item.children.length"
                ref="popper"
                v-model="item._v"
                placement="right"
                trigger="click"
                :offset="computeOffset(item)"
                :visible-arrow="false"
                popper-class="tree-icon-nav-wrapper">
                <pop-nav v-if="item._v"
                         :nav-data="item.children"
                         @skip="resetVisible" />
                <div slot="reference"
                     class="svg-icon-wrap"
                     :class="{'svg-icon-wrap--active': checkActive(item)}"
                     @click.native="handleIconClick(item)">
                    <i
                        v-if="item.icon"
                        ref="icon"
                        class="icon-item"
                        :class="getItemCls(item)"></i>
                </div>
            </el-popover>
            <div v-else
                 class="svg-icon-wrap"
                 :class="{'icon-item--active': checkActive(item)}"
                 @click="handleIconClick(item)">
                <i
                    class="icon-item"
                    :class="getItemCls(item)"></i>
            </div>
        </div>
    </div>
</template>

<script>

/**
 * 纵向图标栏
 */

import popNav from './pop_nav';
export default {
    components: {
        popNav
    },
    props: {
        navData: {
            type: Array,
            required: true
        }
    },
    mounted () {
        this.resetVisible();
    },
    methods: {
        resetVisible () {
            this.navData.forEach(item => {

                //  控制悬浮子目录是否显示
                item._v = false;
            });
        },
        handleIconClick (item) {
            if (item.children && item.children.length) {
                return; 
            }
            this.$router.push(item.path);
        },
        computeOffset (item) {
            if (item.children.length === 1) {
                return 0;
            }

            //  下面的数值为调出来的偏移量
            // eslint-disable-next-line no-magic-numbers
            return item.children.length * 40 / 2 - 20;
        },
        getItemCls (item) {
            return [
                'iconfont',
                `icon-${item.icon}`
            ];
        },
        checkActive (item) {
            return this.$navState.activeNav.findIndex(
                nav => nav.name === item.name
            ) > -1;
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";
.tree-icon-nav-wrapper {
    width: 40px;
    box-sizing: border-box;
    flex-shrink: 0;

    display: inline-block;
    align-items: center;
    & .icon-nav__menu {
        position: relative;
        height: 40px;
        width: 100%;
        line-height: 40px;
        text-align: center;
        border-bottom: 1px solid #ddd;
    }
    & .svg-icon-wrap::after {
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.01); /* TD87268 IE10下面如果不设置颜色 不会触发popover 莫名其妙的*/
    }

    & .icon-item {
        font-size: 16px;
        color: #223d65;
    }

    & .svg-icon-wrap:hover {
        cursor: pointer;
    }

    & .svg-icon-wrap--active .icon-item,
    & .svg-icon-wrap:hover .icon-item,  
    & .icon-item--active {
        color: var(--primary-color);
        & .icon-item {
            color: var(--primary-color);
        }
    }

    &.el-popover {
        width: auto;
        background-color: white;
        border-radius: 2px;
        box-shadow: 0 0 4px 0 #C4C7C9;
        padding: 0;
        border: none;
        margin-left:20px;
    }
    & .none {
        display: none;
    }
}
</style>
