<template>
    <div class="valid-info__wrapper">
        <div 
            ref="valid-tip" 
            class="valid-info">
            <i 
                class="valid-info__icon" 
                :class="iconCls"></i>
            <lang>{{ validInfoTitle }}</lang>
            <div class="valid-info__cornor">
                <div class="valid-info__connor__tirangle"></div>
            </div>
        </div>
        <sf-layer
            trigger="hover"
            default-target="valid-tip"
            anchor="bottom-start"
            :arrow-hide="true"
            :closeable="false">
            <div class="valid-info-tip__text__container">
                <p class="row">
                    <lang>审计记录留存天数满足等保2.0要求</lang>
                </p>
                <p class="row">
                    <lang :duration="VALID_LOG_PERSERVE_TIME">
                        等保2.0要求审计记录留存不少于{duration}天
                    </lang>
                </p>
                <p class="row">
                    <lang :total="computedDiskInfo.total | fullStorageSize">
                        当前存储日志磁盘空间总大小：{total}
                    </lang>
                </p>
                <p class="row">
                    <lang :daily="computedDiskInfo.dailyUsage | fullStorageSize">
                        平均每天产生日志大小：{daily}
                    </lang>
                </p>
                <p class="row">
                    <lang :preservetime="computedDiskInfo.preserveTime | validDayUnit">
                        预计存储日志：{preservetime}
                    </lang>
                </p>
            </div>
        </sf-layer>
    </div>
</template>
<script>

/**
 * @file 合规提示条
 */

import { VALID_LOG_PERSERVE_TIME } from 'src/utils/consts';
import { fullStorageSize, validDayUnit } from 'src/common/lib/filters';
 
export default {
    filters: {
        fullStorageSize,
        validDayUnit
    },
    props: {
        diskInfo: {
            type: Object,
            default: () => ({
                total: 0,
                available: 0,
                dailyUsage: 0,
                preserveTime: 0
            })
        }
    },
    data () {
        return {
            VALID_LOG_PERSERVE_TIME
        };
    },
    computed: {
        computedDiskInfo () {
            let info = Object.assign({}, this.diskInfo);
            info.preserveTime = Math.floor(info.preserveTime);
            return info;
        },
        isValid () {
            return !!(this.diskInfo.preserveTime && 
                this.diskInfo.preserveTime >= VALID_LOG_PERSERVE_TIME);
        },
        iconCls () {
            return this.isValid ? 'valid' : 'warning';
        },
        validInfoTitle () {
            const MONTH = 30;
            let month = Math.floor(VALID_LOG_PERSERVE_TIME / MONTH);

            return this.isValid ? 
                _('能存储{0}日志', validDayUnit(this.computedDiskInfo.preserveTime)) :
                _('空间不足{0}个月', month);
        }
    }
};
</script>
<style lang="postcss">
.valid-info__wrapper {

    & .valid-info__icon {
        width: 15px;
        height: 15px;
        margin-right: 4px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;

        &.valid {
            background-image: url('~src/common/assets/img/homepage/icon_valid.svg');
        }
        &.warning {
            background-image: url('~src/common/assets/img/homepage/icon_warning.svg');
        }
    }

    & .valid-info {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 24px;
        padding: 0 5px;
        background-color: #1cb5bb;
        font-size: 12px;
        color: #fff;
        border-bottom-left-radius: 11px;
    }

    & .valid-info__cornor {
        position: absolute;
        top: 0;
        left: -22px;
        width: 24px;
        height: 24px;
        overflow: hidden;

        & .valid-info__connor__tirangle {
            position: relative;
            top: -17px;
            right: -14px;
            width: 34px;
            height: 34px;
            flex-shrink: 0;
            background-color: #1cb5bb;
            transform: rotate(55deg);
        }
    }
}

.valid-info-tip__text__container {
    padding: 3px 8px;
    margin: 0;
    color: #80848f;

    & .row {
        padding: 5px;
        margin: 0;
    }
}
</style>
