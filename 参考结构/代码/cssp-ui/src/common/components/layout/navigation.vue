<template>
    <div class="navigation-wrapper">
        <div class="nav__logo">
            <product-logo />
        </div>
        <!-- <div class="options">
        </div>
        <div class="logo">
        </div> -->
        <!-- <div class="menu">
            <router-link
                v-for="route in routes"
                :key="route.name"
                class="menu__item"
                :to="{name: route.name}">
                {{ route.options.text }}
            </router-link>
        </div> -->
    </div>
</template>

<script>

/**
 * 导航组件
 */

import checker from 'src/common/lib/permission/checkers';
import { wait } from 'src/utils/wait_until';
import { PERMISSION_LOADING_WAITTING_ID } from 'src/utils/consts';
import productLogo from '@/common/components/product_logo';

export default {
    components: {
        productLogo
    },
    data () {
        return {
            routes: []
        };
    },

    // mounted () {
    //     this.getRoutes();
    // },
    methods: {
        async getRoutes () {
            let navs = this.$navStorage.getNavList('root');

            let res = [];
            await wait(PERMISSION_LOADING_WAITTING_ID);
            for (let item of navs) {
                let checkRes = await checker.check({ to: item, travers: true });
                if (checkRes.success) {
                    res.push(item);
                }
            }

            this.routes = res;
        }
    }
};
</script>


<style lang="postcss">
@import "src/common/assets/css/var.css";
.navigation-wrapper {
    width: 100%;
    height: 60px;
    line-height: 60px;
    //background: linear-gradient(180deg, #1A484C 8%, #1B7881 93%);
    background-color: var(--nav-bg);
    padding-bottom: 2px;
    & .nav__logo {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 365px;
        height: 58px;
        float: left;
        margin-right: 60px;
        margin-left: 14px;
    }
}
</style>
