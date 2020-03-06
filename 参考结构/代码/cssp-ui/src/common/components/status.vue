<template lang="html">
    <div class="task-dialog-status-wrap">
        <span
            v-if="status.status == 'SUCCESS'" 
            style="color: #22b07b">
            {{ status.status | status }}
        </span>

        <span v-if="status.status == 'PENDING'">
            {{ status.status | status }}
        </span>

        <!-- 失败状态 -->
        <span
            v-if="status.status == 'FAILURE'"
            style="color: #f44"
            class="table-item-fail">
            <span>{{ status.status | status }}</span>
            <popover v-if="desp"
                     class="status-tip">
                <div> {{ status.description }} </div>
            </popover>   
        </span>

        <!-- 进度条状态 -->
        <div
            v-if="status.status == 'STARTED'">
            <svg-icon
                icon-class="loading"
                spin />
            <!-- <div class="progress-bar "
        		role="progressbar"
        		aria-valuemax="100"
        		aria-valuemin="0"
        		style="line-height: 13px; background: #00cf95; display:block;height:13px;"
        		:style="{'width':  status.progress + '%'}"></div> -->
        </div>
    </div>
</template>

<script>

/**
 * @file status组件
 */

import popover from 'src/common/components/form_tips/popover_error';
export default {
    components: {
        popover
    },

    filters: {
        status (v) {
            switch (v) {
                case 'FAILURE':
                    return '失败';

                case 'PENDING':
                    return '等待中';

                case 'STARTED':
                    return '运行中';

                case 'SUCCESS':
                    return '成功';
                
                default:
                    return '';
            }
        }
    },
    props: {
        status: {
            required: true,
            type: Object
        },
        desp: {
            type: Boolean
        }
    },

    data () {
        return {
            
        };
    }
};
</script>

<style lang="css">
.task-dialog-status-wrap .progress{
    background-color: #eee;
}
.status-tip{
    position: absolute;
    left: 50px;
    top:10px;
}
</style>
