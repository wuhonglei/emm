<template>
    <div v-show="active">
        <slot></slot>
    </div>
</template>

<script>

/**
 * 
 */

export default {
    name: 'TabsPanel',

    props: {
        label: { // tab 显示的标题
            required: true,
            type: String
        },

        name: {
            required: true,
            type: String
        },

        disabled: { // 是否禁用
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            active: false
        };
    },

    mounted () {
        this.$on('update', (name) => {
            this.active = name === this.name;
        });
        this.$parent.addTab(this);
    }
};
</script>
