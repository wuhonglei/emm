<template>
    <div class="table-detail-wrapper"> 
        <div class="detail__container">
            <p class="detail__index">
                序号{{ index }}
            </p>
            <p  
                v-for="item in configures"
                :key="item[id]"
                class="detail__line">
                <span class="line__title">{{ item[name] }}</span>

                <pre
                    v-if="item.pre"
                    class="line__content">{{ detailData[item[id]] }}</pre>

                <span
                    v-else
                    class="line__content"
                    :style="item.style ||
                        (item.computed && item.computed(detailData)) ||
                        null">
                    {{ detailData[item[id]] }}
                </span>
            </p>
        </div>
    </div>
</template>

<script>

/**
 * 表格查看详情
 */

export default {
    props: {
        configures: {
            type: Array,
            required: true
        },
        detailData: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        id: {
            type: String,
            default: 'key'
        },
        name: {
            type: String,
            default: 'name'
        }
    }
};
</script>

<style lang="postcss">
.table-detail-wrapper {
    max-height: 400px;
    width: 300px;
    overflow-y: auto;

    & .detai__container {
        display: flex;
        flex-flow: column nowrap;
        width: 100%;
    }

    & .detail__index {
        font-weight: bold;
    }

    & .detail__line {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        width: 100%;

        & .line__title {
            min-width: 80px;
            font-weight: bold;
        }
        & .line__title::after {
            content: ':';
        }
        & .line__content {
            word-break: break-all;
            white-space: normal;
        }
    }

}
</style>
