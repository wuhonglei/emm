<template>
    <div class="breadcrumb-wrapper">
        <router-link
            v-for="nav in breadcrumbData"
            :key="nav.name"
            class="breadcrumb__item"
            :to="{name: nav.name}">
            {{ nav.text }}
        </router-link>
    </div>
</template>

<script>

/**
 *  面包屑组件
 */

export default {
    computed: {
        breadcrumbData () {
            return this.$navState.activeNav.slice(1);
        }
    }
};
</script>

<style lang="postcss">
.breadcrumb-wrapper {
    height: 18px;
    padding: 11px 0;
    font-size: 14px;
    & .breadcrumb__item {
        margin-right: 2px;
        color: rgba(0, 0, 0, 0.7);
    }
    & .breadcrumb__item:hover {
        text-decoration: none;
    }
    & .breadcrumb__item:focus {
        text-decoration: none;
    }
    & .breadcrumb__item::after {
        content: '>';
        color: rgba(0, 0, 0, 0.7);
        margin-left: 2px;
    }
    & .breadcrumb__item:nth-last-child(1)::after {
        display: none;
    }
    & .breadcrumb__item.router-link-exact-active {
        color: rgba(0, 0, 0, 0.5);
    }
}
</style>

