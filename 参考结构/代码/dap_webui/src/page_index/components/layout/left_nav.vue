<template>
    <div ref="leftNavWrapper"
         class="left-nav-wrapper">
        <sf-nav-menu
            v-if="treeData.length"
            ref="menuGroup2"
            :key="navKey"
            :menu-height="navHeight"
            :title="moduleTitle"
            :options="treeData"
            :default-horizontal-expand="isExpand"
            :default-active="uniqueSample.defaultActive"
            :unique-opened="uniqueSample.uniqueOpened"
            :expand-all="uniqueSample.expandAll"
            theme="bright-theme"
            @horizontalExpandClick="horizontalExpandClick"
            @clickItem="clickFn" />
    </div>
</template>

<script>

/**
 * @file 左侧菜单
 */

import utils from 'src/utils/utils_data';
import { on, off } from 'src/utils/dom'; 
import { debounce } from 'throttle-debounce';

let navAllArr = {};

export default {
    inject: ['reload'],
    data () {
        return {
            navHeight: 0,
            uniqueSample: {
                defaultActive: '',
                uniqueOpened: true,
                expandAll: false
            },
            treeData: [],
            moduleTitle: '',
            moduleName: '',
            navKey: new Date().getTime(),
            isExpand: true // 是否收缩左边侧边栏
        };
    },
    watch: {
        $route () {
            let currPath = this.$route.matched[0].name,
                currNav = navAllArr[currPath],
                navAllObj = utils.navObj;
                
            if (this.moduleName !== currPath && currNav) {
                this.moduleName = currPath;
                this.moduleTitle = currNav.title;
                this.treeData = currNav.children || [];
                this.navKey = new Date().getTime();
            }
            this.isExpand = localStorage.getItem('isExpand') !== '0'; // 默认为展开
            if (currNav) {
                this.uniqueSample.defaultActive = navAllObj[this.$route.name].index;
            }
        }
    },
    mounted () {
        if (utils.navData.length) {
            utils.navData.map((dataItem) => {
                navAllArr[dataItem.id] = dataItem;
            });
        }
        this.isExpand = localStorage.getItem('isExpand') !== '0'; // 默认为展开
        this.setNavHeight();
        on(window, 'resize', this.handleResize());
    },
    beforeDestroy () {
        off(window, 'resize', this.handleResize());
    },
    methods: {
        handleResize () {
            const DEBOUNCE_TIME = 300;
            return debounce(DEBOUNCE_TIME, () => {
                this.setNavHeight();
            });
        },
        setNavHeight () {
            const HEAD_HEIGHT = 60;
            this.navHeight = document.documentElement.clientHeight - HEAD_HEIGHT;
        },
        clickFn (e, item) {
            if (this.$route.name === item.data.id) {
                this.reload();
            } else {
                this.$router.push({name: item.data.id});

            }
            this.$nextTick(() => {
                this.uniqueSample.defaultActive = item.data.index;
            });
        },
        horizontalExpandClick (data) {
            let resData = data ? '1' : '0'; // resData 为'1'表示默认展开， 为'0'表示为收缩
            localStorage.setItem('isExpand', resData);
        }
    }
};

</script>

<style lang="postcss">
.left-nav-wrapper {
    overflow: hidden;
    flex-shrink: 0;
    height: 100%;

    & .is-expand {
        width: 220px;
    }
    & .fa {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    & .fa-user-log:before {
        content: "\e78f";
    }
    & .fa-admin-log:before {
        content: "\e878";
    }
    & .fa-system-log:before {
        content: "\e7b0";
    }
    & .fa-log-config:before {
        content: "\e7c9";
    }
    & .fa-system-set:before {
        content: "\e7ba";
    }
}
</style>
