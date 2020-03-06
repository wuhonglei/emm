<template>
    <svg :class="svgClass"
         aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script>

/** 
 * svg组件
*/

export default {
    name: 'SvgIcon',
    props: {
        iconClass: {
            type: String,
            required: true
        },
        className: {
            type: String,
            default: ''
        },
        spin: Boolean
    },
    computed: {
        iconName () {
            return `#icon-${this.iconClass}`;
        },
        svgClass () {
            let rs = ['svg-icon'];
            if (this.className) {
                rs.push(this.className);
            }
            if (this.spin) {
                rs.push('is-spin');
            }
            return rs.join(' ');
        }
    }
};
</script>

<style lang="postcss" scoped>
@-webkit-keyframes rotation{
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    &.is-spin {
        animation: rotation 1s linear infinite;
    }
}
</style>
