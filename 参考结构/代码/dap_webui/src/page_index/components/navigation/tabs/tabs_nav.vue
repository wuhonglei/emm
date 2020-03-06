<template>
    <div 
        class="nav">
        <div 
            v-for="nav in navs"
            :key="nav.name"
            class="nav__item"
            :class="{'is-active': nav.active, 'is-disabled': nav.disabled}"
            @click="handleNavClick(nav)">
            {{ nav.label }}
        </div>
    </div>
</template>

<script>

/**
 * tabs 头部组件
 */

export default {
    props: {
        navs: {
            required: true,
            type: Array
        }
    },

    methods: {
        handleNavClick (nav) {
            if (nav.disabled) {
                return;
            }
            
            this.$parent.$emit('update', nav.name);
        }
    }
};
</script>