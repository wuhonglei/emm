<template>
    <li class="menu-item-wrapper"
        :class="wrapperCls">
        <span
            class="item__content"
            :class="ctClass"> 
            <i 
                v-if="treeData.icon"
                class="item__icon"
                :class="iconCls"
                @click.prevent="toggle"></i>
            <div 
                v-if="hasChild && level !== 1"
                class="toggle__icon__wrapper"
                :class="{'is-open': open}"
                @click.prevent="toggle">
                <i class="icon__triangle"></i>
            </div>
            <div
                v-if="treeLeaf && level === 3"
                class="dot__icon__wrapper">
                <i class="icon__dot"></i>
            </div>
            <span
                class="item__text"
                @click="locate">{{ treeData.text }}
            </span>
            <i
                v-if="hasChild && level === 1"
                class="submenu__icon el-icon-arrow-right"
                :class="{'is-open': open}"
                @click.prevent="toggle">
            </i>
        </span>

        <transition
            v-if="hasChild && open"
            name="item__submenu">
            <ul class="item__submenu"
                :class="{ 'menu-open': open }">
                <menu-item
                    v-for="item in treeData.children"
                    :key="item.path"
                    :level="level + 1"
                    :tree-data="item"
                    :expand="expandChild === item.path"
                    @toggle="handleItemToggle" />
            </ul>
        </transition>
    </li>
</template>

<script>

/**
 * 左树组件 
 */


import Bus, { BUS_EVENT } from 'src/utils/bus';

export default {
    name: 'MenuItem',

    props: {
        treeData: {
            required: true,
            type: Object
        },
        level: {
            required: true,
            type: Number
        },
        expand: {
            type: Boolean,
            default: true
        }
    },

    data () {
        return {
            open: false,
            openCache: null,
            expandChild: ''
        };
    },

    computed: {
        isActive () {
            return this.$navState.activeNav.findIndex(
                nav => nav.name === this.treeData.name
            ) > -1;
        },
        hasChild () {
            return this.treeData.children && this.treeData.children.length;
        },
        treeLeaf () {
            return !this.hasChild;
        },
        treeLeafActive () {
            return !this.hasChild && this.isActive;
        },
        wrapperCls () {
            let cls = ['level' + this.level];
            this.treeLeaf && cls.push('tree__leaf');
            this.treeLeafActive && cls.push('tree__leaf--active');
            return cls;
        },
        ctClass () {
            let cls = 'level' + this.level;
            if (this.hasChild && this.isActive) {
                cls += ' selected';
            }
            return cls;
        },
        iconCls () {
            return [
                'iconfont',
                `icon-${this.treeData.icon}`
            ];
        }
    },

    watch: {
        open () {
            this.$emit('toggle', this.treeData, this.open);
        },
        expand () {
            this.open = this.expand;
        }
    },

    mounted () {
        this.open = this.isActive;
        Bus.$on(BUS_EVENT.MENU_COLLOPSE, this.handleCollospe);
    },

    beforeDestroy () {
        Bus.$off(BUS_EVENT.MENU_COLLOPSE, this.handleCollospe);
    },

    methods: {
        locate () {
            if (this.hasChild) {
                this.toggle();
                return;
            }
            this.$router.push(this.treeData.path);
        },
        toggle () {
            this.open = !this.open;
        },

        handleCollospe (open) {
            if (!open) {
                this.openCache = this.open;
                this.open = false;
            } else {
                this.open = this.openCache;
            }
        },

        handleItemToggle (item, expand) {
            if (expand && item.path !== this.expandChild) {
                this.expandChild = item.path;
            }
        }
    }

};
</script>


<style lang="postcss">
@import "src/common/assets/css/var.css";

.tree__menu {
    width: 100%;
    box-sizing: content-box;
    background-color: white;
    color: var(--basic-font-color);

    &>.item__submenu{
        width: 100%;
        margin: 0;
        flex-grow: 0;
        flex-shrink: 0;
    }
    & .item__submenu{
        list-style: none;
        padding-left: 0;
    }
    & .item__submenu.menu-open {
        background: #f3fbfc;
    }
    & .menu-item-wrapper {
        line-height: 1.5;
        color: var(--basic-font-color);

        &>.item__content {
            display: flex;
            justify-content: stretch;
            align-items: center;
            box-sizing: border-box;
            height: 40px;
            width: 100%;
        }

        &.level1>.item__submenu.menu-open {
            border-bottom: 1px solid #ddd;
        }

        &.level1>.item__content {
            padding-left: 20px;
            border-bottom: 1px solid #ddd;
        }
        &.level2>.item__content {
            padding-left: 36px; 
        }
        &.level3>.item__content {
            padding-left: 52px; 
        }
        &.level4>.item__content {
            padding-left: 68px;
        }
        &>.item__content:hover {
            background-color: var(--nav-hover-bg);
        }
    }
    & .menu-item-wrapper.tree__leaf--active {
        &>.item__content {
            background: var(--primary-color);
            color: white;
        }
    }
    & .item__icon {
        font-size: 16px;
        vertical-align: middle;
    }
    & .toggle__icon__wrapper {
        width: 16px;
        height: 16px;
        display: inline-flex;
        justify-content: center;
        align-items: center;

        transition: transform 0.2s ease-out;
        transform-origin: center;
        &.is-open {
            transform: rotate(90deg);
        }

        & .icon__triangle {
            display: inline-block;
            flex-grow: 0;
            flex-shrink: 0;
            width: 0;
            height: 0;
            border: 6px solid transparent;
            border-left-color: #7a8896;
            margin-left: 6px;
        }
    }
    & .dot__icon__wrapper {
        width: 16px;
        height: 16px;
        display: inline-flex;
        justify-content: center;
        align-items: center;

        & .icon__dot {
            width: 6px;
            height: 6px;
            background-color: #b7d1ef;
            border-radius: 6px;
        }
    }
    & .item__text {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        flex-grow: 1;
        height: 100%;
        cursor: pointer;
        padding-left: 8px; 
        font-size: 14px;
    }
    & .submenu__icon {
        margin-right: 8px;
        cursor: pointer;
        display: inline-block;
        transition: transform 0.2s ease-out;
        transform-origin: center;
        font-size: 12px;
        &.is-open {
            transform: rotate(90deg);
        }
    }
}

</style>
