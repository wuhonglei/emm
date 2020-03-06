<template>
    <div class="data-package-wrapper">
        <div class="pkg__top">
            <span>详细信息</span>
            <el-button
                type="text"
                :style="{color: '#209797'}"
                @click="handleClick">
                {{ open ? '收起详情' : '展开详情' }}
                <i
                    style="margin-left: 4px;"
                    :class="open ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
            </el-button>
        </div>
        <div class="pkg__body">
            <div
                v-if="data.time"
                class="pkg__title">
                {{ index }}.{{ data.attack_type || '-' }}（
                <span :class="'level--' + level ">{{ data.level || '-' }}</span>
                <span>, {{ data.net_action || '-' }}）</span>
            </div>
            <div
                v-else
                class="pkg__title">
                -
            </div>
            <div class="pkg__info"> 
                <template v-for="(item, idx) in items">
                    <span 
                        :key="item[1]"
                        class="info__item">{{ item[1] }}：{{ data[item[0]] || '-' }}</span>
                    <br v-if="idx % 2"
                        :key="idx">
                </template>
            </div>
            <div class="pkg__content">
                <p> 数据包内容 </p>
                <p :style="{'word-break': 'break-all'}">
                    <!-- eslint-disable -->
                    <template v-for="(item, index) in package">
                        {{ item }}
                        <br :key="index">
                    </template>
                    <!-- eslint-enable -->
                </p>
            </div>
        </div>
    </div>
</template>

<script>

/**
 * 显示数据包组件
 */

export default {
    props: {
        data: {     
            type: Object,
            required: true
        },
        items: {    //  中间层显示的数据项
            type: Array,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            open:true
        };
    },
    computed: {
        level () {
            if (typeof this.data.level_eng === 'string') {
                return this.data.level_eng.toLowerCase();
            }
            return 'low';
        },
        package () {
            if (!this.data.package) {
                return ['-'];
            }
            return this.data.package.split('\n');
        }
    },
    watch: {
        data () {
            if (this.index !== 1) {
                return;
            }
            if (!this.data.package) {
                this.open = false;
                this.$emit('toggle', false);
            } else {
                this.open = true;
                this.$emit('toggle', true);
            }
        }
    },
    methods: {
        handleClick () {
            this.open = !this.open;
            this.$emit('toggle', this.open);
        }
    }
};
</script>

<style lang="postcss">
@import "src/common/assets/css/var.css";
.data-package-wrapper {
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
    border-radius: 2px;
    flex-shrink: 0;
    display: flex;
    flex-flow: column nowrap;
    height:100%;

    & .pkg__top {
        height: 32px;
        flex-shrink: 0;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        padding:0 21px;
        box-shadow: 0 1px 0 0 rgba(0,0,0,0.10);
        border-radius: 2px;
        box-sizing: border-box;
        font-size:12px;
        z-index:0;
    }

    & .pkg__body {
        display: flex;
        flex-flow: column nowrap;
        flex: 1;
        color: #444444;
        font-size:13px;
        overflow-y: auto;

        & .pkg__title {
            background-color: #F4F8FC;
            height: 34px;
            line-height: 34px;
            box-shadow: 0 1px 0 0 rgba(0,0,0,0.10);
            box-sizing: border-box;
            padding-left: 21px; 
        }

        & .level--high {
            color: var(--level-high-color);
        }

        & .level--middle {
            color: var(--level-middle-color);
        }

        & .level--low {
            color: var(--level-low-color);
        }

        & .pkg__info {
            padding:20px 0 0 21px;
            box-shadow: 0 1px 0 0 rgba(0,0,0,0.10);
        }
        & .info__item {
            padding: 8px 0;
            display: inline-block;
            min-width: 240px;
        }
        & .pkg__content {
            padding:20px 0 0 21px;
        }
    }
}
</style>
