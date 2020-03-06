<template>
    <div class="tabs-wrapper">
        <tabs-nav :navs="navs" />
        <slot></slot>
    </div>
</template>

<script>

/**
 * tabs 组件
 * 使用说明：
 * 1. 引入tabs 和 tabs panel
 * 2. tabs 下面 紧接着 tabs-panel组件
 * 3. tabs-panel 必须提供name，value，选填disabled属性
 */

import emitter from 'src/page_index/mixins/emitter';
import TabsNav from './tabs_nav';
import './tabs.css';

export default {
    name: 'Tabs',

    components: { TabsNav },

    mixins: [ emitter ],

    props: {
        value: {
            type: String,
            default () {
                return '';
            }
        }
    },

    data () {
        return {
            navs: []
        };
    },

    mounted () {
        this.$on('update', (name) => {
            this.$emit('input', name);
            this.updatedValue(name);
        });
        this.updatedValue(this.value);
    },

    methods: {
        addTab (tab) {
            this.navs.push(tab);
        },

        updatedValue (name) {
            this.broadcast('TabsPanel', 'update', name);
        }
    }
};
</script>
