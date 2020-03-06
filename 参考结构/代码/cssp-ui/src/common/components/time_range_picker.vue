<template>
    <div class="query__content">
        <div class="form"> 
            <div class="form__label">
                开始时间
            </div>
            <div class="form__content">
                <el-date-picker
                    :value="startDate"
                    :editable="false"
                    :clearable="false"
                    @input="handleStartDateChange" />
                <div class="form__split"></div>
                <el-time-select
                    :value="startTime"
                    :editable="false"
                    :clearable="false"
                    :picker-options="startTimeOption"
                    @input="handleStartTimeChange" />
            </div>
        </div>
        <div class="form">
            <div class="form__label">
                结束时间
            </div>
            <div class="form__content">
                <el-date-picker
                    :value="endDate"
                    :editable="false"
                    :clearable="false"
                    @input="handleEndDateChange" />
                <div class="form__split"></div>
                <el-time-select
                    :value="endTime"
                    :editable="false"
                    :clearable="false"
                    :picker-options="endTimeOption"
                    @input="handleEndTimeChange" />
            </div>
        </div>
    </div>
</template>

<script>

/**
 * 用户表单中的日期时间选择
 */

const HOUR = 24;
const MINUTE = 3600;
const SECOND = 1000;
const ONE_DAY_TIME = HOUR * MINUTE * SECOND; //一天毫秒数

export default {
    props: {
        startDate: {
            type: [Date, String],
            required: true,
            default () {
                return new Date().setHours(0, 0, 0, 0);
            }
        },
        startTime: {
            type: String,
            required: true,
            default: '00:00'
        },
        endDate: {
            type: [Date, String],
            required: true,
            default () {
                return new Date(new Date().setHours(0, 0, 0, 0).getTime() + ONE_DAY_TIME);
            }
        },
        endTime: {
            type: String,
            required: true,
            default: '00:00'
        }
    },
    data () {
        return {
            startTimeOption: {
                start: '00:00',
                end: '23:59',
                step: '00:15'
            },
            endTimeOption: {
                start: '00:00',
                end: '23:59',
                step: '00:15'
            }
        };
    },
    computed: {
        endDateBeforeStartTime () {
            return this.startDate.getTime() >= this.endDate.getTime();
        },

        sameDay () {
            return this.startDate.toLocaleDateString() === this.endDate.toLocaleDateString();
        }
    },
    watch: {
        startDate () {
            this.handleAnyTimeChange('end');
        },
        endDate () {
            this.handleAnyTimeChange('start');
        },
        startTime () {
            this.handleAnyTimeChange('end');
        },
        endTime () {
            this.handleAnyTimeChange('start');
        }
    },
    methods: {
        handleStartDateChange (v) {
            this.$emit('update:startDate', v);
        },
        handleEndDateChange (v) {
            this.$emit('update:endDate', v);
        },
        handleStartTimeChange (v) {
            this.$emit('update:startTime', v);
        },
        handleEndTimeChange (v) {
            this.$emit('update:endTime', v);
        },

        handleAnyTimeChange (type) {
            if (!this.endDateBeforeStartTime) {
                return false;
            }

            if (this.sameDay && this.startTime < this.endTime) {
                return false;
            }
            this.restTime(type);
        },

        restTime (type) {
            if (type === 'start') {
                this.$emit(`update:startDate`, new Date(this.endDate.getTime() - ONE_DAY_TIME));
            } else {
                this.$emit(`update:endDate`, new Date(this.startDate.getTime() + ONE_DAY_TIME));
            }
        }
    }
};
</script>
