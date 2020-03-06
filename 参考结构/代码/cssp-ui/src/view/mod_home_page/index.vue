<template>
    <sf-scrollbar>
        <div class="page-home-page__wrapper">
            <top-info class="page-home-page__top-info" />
            <div class="page-home-page__card-row top">
                <log-distribution class="page-home-page__log-distribution card" />
                <log-trend class="page-home-page__log-trend card" />
            </div>
            <div class="page-home-page__card-row bottom">
                <asset-alarm class="page-home-page__asset-alarm card" />
                <alarm-trend class="page-home-page__alarm-trend card" />
            </div>
        </div>
    </sf-scrollbar>
</template>
<script>

/**
 * @file file #具体文件具体命名
 */

import topInfo from './top_info';
import logDistribution from './log_distribution';
import logTrend from './log_trend';
import assetAlarm from './asset_alarm';
import alarmTrend from './alarm_trend';

export default {
    components: {
        topInfo,
        logDistribution,
        logTrend,
        assetAlarm,
        alarmTrend
    }
};
</script>
<style lang="postcss">
.page-home-page__wrapper {
    width: 100%;
    height: auto;
    padding: 16px;
    padding-left: 0;
    box-sizing: border-box;

    & .page-home-page__top-info {
        margin-bottom: 16px;
    }

    & .page-home-page__card-row {
        width: 100%;
        display: flex;
        margin-bottom: 13px;

        &.top {
            height: 350px;
        }
        &.bottom {
            height: 430px;
        }
        & .card {
            margin-right: 13px;
            height: 100%;
            &:last-of-type {
                margin-right: 0;
            }
        }
    }

    & .page-home-page__log-distribution,
    & .page-home-page__asset-alarm {
        width: 43.55128%;
    }
    & .page-home-page__log-trend,
    & .page-home-page__alarm-trend {
        width: 55.66886%;
    }
}
</style>
