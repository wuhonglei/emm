<template>
    <div class="page-home-page__top-info__wrapper">
        <div class="page-home-page__top-info__left">
            <info-item>
                <template v-slot:icon>
                    <i class="top-info__icon log-cnt"></i>
                </template>
                <template v-slot:title>
                    <lang>日志总数</lang>
                </template>
                <template v-slot:value>
                    <span class="top-info__item-info__main">
                        {{ logCnt.total | filterNumUnit }}
                        <span class="top-info__item-info__sub">
                            近七天 {{ logCnt.week | filterNumUnit }}
                        </span>
                    </span>
                </template>
            </info-item>
            <info-item>
                <template v-slot:icon>
                    <i class="top-info__icon assets"></i>
                </template>
                <template v-slot:title>
                    <lang>接入资产</lang>
                </template>
                <template v-slot:value>
                    {{ assetCnt | filterNumUnit }}
                </template>
            </info-item>
        </div>
        <div class="vertical-line"></div>
        <div class="page-home-page__top-info__right">
            <info-item>
                <template v-slot:icon>
                    <i class="top-info__icon storage"></i>
                </template>
                <template v-slot:title>
                    <lang>总储存空间</lang>
                </template>
                <template v-slot:value>
                    <span class="top-info__item-info__main">
                        {{ diskInfo.total | fullStorageSize }}
                        <span class="top-info__item-info__sub">
                            剩余 {{ diskInfo.available | fullStorageSize }}
                        </span>
                    </span>
                </template>
            </info-item>
            <disk-info-item
                :total="diskInfo.total"
                :available="diskInfo.available">
                <template v-slot:title>
                    <lang>磁盘使用率</lang>
                </template>
                <template v-slot:value>
                    <span 
                        class="top-info__disk-rate"
                        :class="diskUsageRateCls">
                        {{ diskUsageRateText }}%
                    </span>
                </template>
            </disk-info-item>
        </div>
        <valid-info 
            class="top-info__valid-info"
            :disk-info="diskInfo" />
    </div>
</template>
<script>

/**
 * @file 首页上端展示
 */

import infoItem from './info_item';
import diskInfoItem from './disk_info_item';
import validInfo from './valid_info';
import { fullStorageSize, filterNumUnit } from 'src/common/lib/filters';
import { getDiskInfo } from 'src/common/api/home_page';
import { getAssetLogCnt } from 'src/common/api/proxied_api';

export default {
    components: {
        infoItem,
        diskInfoItem,
        validInfo
    },
    filters: {
        fullStorageSize,
        filterNumUnit
    },
    data () {
        return {
            logCnt: {
                total: 0,
                week: 0
            },
            diskInfo: {
                total: 0,
                available: 0,
                dailyUsage: 0,
                preserveTime: 0
            },
            assetCnt: 0
        };
    },
    computed: {

        // 磁盘使用率
        diskUsageRate () {
            let used = this.diskInfo.total - this.diskInfo.available;
            return used / (this.diskInfo.total || 1);
        },

        // 磁盘使用率文字
        diskUsageRateText () {
            let percision = 2;
            let handred = 100;
            return (this.diskUsageRate * handred).toFixed(percision);
        },

        // 磁盘使用率文字class
        diskUsageRateCls () {
            let safeMax = 0.8;
            let warnningMax = 0.9;

            return this.diskUsageRate <= safeMax ? 'safe' :
                (this.diskUsageRate <= warnningMax ? 'warnning' : 'danger');
        }
    },
    mounted () {
        this.loadAssetLogCnt();
        this.loadDiskInfo();
    },
    methods: {

        // 加载日志数量
        async loadAssetLogCnt () {
            try {
                let res = await getAssetLogCnt();
                let data = res.data && res.data.data;
                if (!data) {
                    return;
                }

                this.logCnt = {
                    total: data.log_total ? data.log_total : 0,
                    week: data.week_log_total ? data.week_log_total : 0
                };
                this.assetCnt = data.collector_num ? data.collector_num : 0;
            } catch (err) {
                if (err.data && err.data.mesg) {
                    this.$error(err.data.mesg);
                }
            }
        },

        // 加载磁盘信息
        async loadDiskInfo () {
            try {
                let res = await getDiskInfo();
                let data = res.data && res.data.data;
                if (!data) {
                    return;
                }

                this.diskInfo = {
                    total: data.data_total > 0 ? data.data_total : 0,
                    available: data.free_disk_size > 0 ? data.free_disk_size : 0,
                    dailyUsage: data.average_daily_usage > 0 ? data.average_daily_usage : 0,
                    preserveTime: data.keep_time > 0 ? data.keep_time : 0
                };
            } catch (err) {
                if (err.data && err.data.mesg) {
                    this.$error(err.data.mesg);
                }
            }
        }
    }
};
</script>
<style lang="postcss">
.page-home-page__top-info__wrapper {
    position: relative;
    width: 100%;
    height: 140px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background: 
        left no-repeat url('~src/common/assets/img/homepage/homepage_top_left.png'),
        right no-repeat url('~src/common/assets/img/homepage/homepage_top_right.png'),
        linear-gradient(0deg, #0083b8 2%, #028d93 100%);
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.30);
    border-radius: 2px;

    & .page-home-page__top-info__left,
    & .page-home-page__top-info__right {
        width: calc(50% - 1px);
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    & .vertical-line {
        width: 1px;
        height: 48px;
        background-color: rgba(255, 255, 255, 0.18)
    }

    & .top-info__item-info__main {
        position: relative;
        display: inline-block;
        & .top-info__item-info__sub {
            position: absolute;
            bottom: 0;
            right: -105px;
            display: inline-flex;
            jusify-content: center;
            align-items: center;
            min-width: 95px;
            height: 25px;
            font-size: 12px;
            color: #fff;

            @media screen and (max-width: 1680px) {
                bottom: -25px;
                left: 0;
            }
        }
    }

    & .top-info__icon {
        width: 24px;
        height: 24px;
        background-position: center;
        background-repeat: no-repeat;
        box-shadow: 0 2px 4px 0 rgba(26,191,191,0.29);
        
        &.log-cnt {
            background-image: url('~src/common/assets/img/homepage/icon_log_cnt.svg');
        }
        &.assets {
            background-image: url('~src/common/assets/img/homepage/icon_assets.svg');
        }
        &.storage {
            background-image: url('~src/common/assets/img/homepage/icon_storage.svg');
        }
    }

    & .top-info__disk-rate {
        &.safe {
            color: #fff;
        }
        &.warnning {
            color: #ff9900
        }
        &.danger {
            color: #d4453d
        }
    }

    & .top-info__valid-info {
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>
