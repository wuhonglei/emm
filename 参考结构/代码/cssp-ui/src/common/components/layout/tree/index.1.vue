<template>
    <div class="left-tree-wrapper"
         :class="{'left-tree--hide': !open}">
        <div class="tree__title">
            <div class="title__text">
                {{ title }}
            </div>
            <i v-if="open"
               class="title__icon el-icon-d-arrow-left"
               @click="toggle"></i>
            <i v-if="!open"
               class="title__icon el-icon-d-arrow-right"
               @click="toggle"></i>
        </div>
        <div class="tree__menu"
             :class="{'tree__menu--hide': !open}">
            <ul class="item__submenu">
                <menu-item 
                    v-for="menuItem in treeData"
                    :key="menuItem.path"
                    :expand="checkExpand(menuItem)"
                    :tree-data="menuItem"
                    :level="1"
                    @toggle="handleItemToggle" />
            </ul>
            <icon-nav :nav-data="treeData" />
        </div>
    </div>
</template>

<script>

/**
 * 左树组件
 */

import menuItem from './menu_item';
import iconNav from './icon_nav';
import Bus, { BUS_EVENT } from 'src/utils/bus';
import checker from 'src/common/lib/permission/checkers';

export default {

    components: {
        menuItem, iconNav
    },

    props: {
        navName: {
            type: String,
            default: 'root'
        },
        title: {
            type: String,
            default: '导航'
        }
    },

    data () {
        return {
            treeData: [],
            open: true,
            expandChild: '' //..当前展开的根目录
        };
    },

    beforeMount () {
        this.loadTreeData();
    },

    methods: {
        toggle () {
            this.open = !this.open;
            Bus.$emit(BUS_EVENT.MENU_COLLOPSE, this.open);
            if (this.$refs.menuItem && this.$refs.menuItem.length > 1) {
                this.$refs.menuItem.forEach((com) => {
                    com.$emit('menu-collopse', this.open);
                });
            }
        },

        handleItemToggle (item, expand) {
            if (expand && item.path !== this.expandChild) {
                this.expandChild = item.path;
            }
        },

        loadTreeData () {
            let navs = this.$navStorage.getNavList(this.navName);
            let res = [];
            navs.forEach(async nav => {
                let checkRes = await checker.check({ to: nav, travers: true });
                checkRes.success && res.push(nav);
            });
            this.treeData = navs;
        },

        checkExpand (menuItem) {
            return this.expandChild === menuItem.path ||
                this.$navState.activeNav.findIndex(
                    nav => nav.name === menuItem.name
                ) > -1;
        }
    }
};
</script>

<style lang="postcss">
.left-tree-wrapper {
    width: 260px;
    background-color: white;
    flex-shrink: 0;
    overflow-y: auto;
    overflow-x: hidden;
    user-select: none;
    box-shadow: 1px 1px 4px 0 #D9DBDC;

    /*动画 */
    transition: all .2s ease-out;

    & .tree__title {
        width: 100%;
        height: 48px;
        display: flex;
        justify-content: stretch;
        align-items: center;
        border-bottom: 1px solid #D9DBDC;

        & .title__text {
            flex: 1;
            height: 40px;
            line-height: 40px;
            padding-left: 20px;
            color: #333;
            font-size: 16px;
        }

        & .title__icon {
            display: inline-block;
            text-align: center;
            line-height: 24px;
            height: 24px;
            width: 24px;
            margin-right: 8px;
            color: #45627B;
            font-size: 10px;
            font-weight: bold;

            background-color: white;
            border: 1px solid #D2DADF;
            border-radius: 3px;
            box-sizing: border-box;
            background-color: #F0F3F6;

            &:hover {
                cursor: pointer;
            }
        }
    }
    &>.tree__menu {
        width: 308px;
        display: flex;
        flex-flow: row nowrap;

        align-items: flex-start;
        justify-content: flex-start;

    }
    &>.tree__icon-nav {
        width: 48px;
        box-sizing: border-box;

        display: inline-block;
        align-items: center;
    }
    & .tree__menu--hide {
        margin-left: -48px;
    }
    &.left-tree--hide {
        margin-left: -212px;
    }
}

</style>

