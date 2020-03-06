<template>
    <div class="detail-example-wrapper">
        <div class="detail__top">
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
        <div 
            v-show="data.collector_name"
            class="collector-name">
            {{ index }}.{{ data.collector_name }} - {{ data.collector_ip }}
            （<span :class="data.level">{{ data.level | level }}</span>）
        </div>
        <div class="detail__content">   
            <div v-show="typeNum === 'TYPE1'">
                <el-table 
                    v-if="Array.isArray(showTableData)"
                    :data="showTableData"
                    border>
                    <el-table-column 
                        prop="attack_type"
                        label="攻击类型" />
                    <el-table-column 
                        prop="attack_cnt"
                        label="攻击次数" />
                </el-table>
            </div>

            <div 
                v-show="typeNum === 'TYPE2' || typeNum === 'TYPE3'"
                class="time-row">
                <div 
                    v-for="(item, i) in example"
                    :key="i"
                    class="mid-line">
                    <div 
                        class="day-item"
                        :class="{'day-item-bottom': i%2 === 0, 'day-item-top': i%2 === 1}">
                        <span 
                            class="day-dot"
                            @click="clickDay(i)"></span>
                        <span class="day-att-num">
                            攻击：{{ item.attack_cnt }}次
                        </span>
                        <span class="day-att-time">
                            {{ item.attack_time }}
                        </span>
                    </div>
                </div>
            </div>

            <div v-show="typeNum === 'TYPE2'">
                <el-table 
                    v-if="Array.isArray(showTableData)"
                    :data="showTableData"
                    border>
                    <el-table-column 
                        prop="attack_time"
                        label="时间" />
                    <el-table-column 
                        prop="attack_type"
                        label="攻击类型" />
                    <el-table-column 
                        prop="attack_cnt"
                        label="攻击次数" />
                </el-table>
            </div>

            <div v-show="typeNum === 'TYPE3'">
                <el-table 
                    v-if="Array.isArray(example)"
                    :data="example"
                    border>
                    <el-table-column 
                        prop="attack_time"
                        label="时间" />
                    <el-table-column 
                        prop="url"
                        label="访问恶意域名" />
                    <el-table-column 
                        prop="attack_cnt"
                        label="访问次数(次)" />
                </el-table>
            </div>

            <div 
                v-if="typeNum === 'TYPE4'"
                class="one-row">
                病毒文件路径：{{ example[0].virus_path }}
            </div>

            <div 
                v-if="typeNum === 'TYPE5'"
                class="one-row">
                webshell所在url路径：{{ example[0].url }}
            </div>

            <div v-show="typeNum === 'TYPE6'">
                <el-table 
                    v-if="Array.isArray(example)"
                    :data="example"
                    border>
                    <el-table-column 
                        prop="name"
                        label="漏洞类型"
                        show-overflow-tooltip />
                    <el-table-column 
                        prop="level"
                        label="等级">
                        <template slot-scope="scope">
                            <span 
                                class="operation-level-label"
                                :class="eventLevel[scope.row.level] ? eventLevel[scope.row.level].class : ''">
                                {{ eventLevel[scope.row.level] ? eventLevel[scope.row.level].label : '' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        label="漏洞url"
                        prop="url" />
                </el-table>
            </div>
            
            <div 
                v-if="typeNum === 'TYPE7'"
                class="one-row">
                黑链url：{{ example[0].url }}
            </div>

            <div 
                v-if="!data.example"
                class="detail-empty">
                暂无信息
            </div>
        </div>
    </div>
</template>

<script>

/**
 * @file 事件详情举证分析
 * 
 **** 威胁 ****
 * 内部威胁 ‘1001’
 * 持续性攻击 '1002'
 * 暴力破解 '1003'
 * 
 **** 失陷事件 ****
 * 对外攻击 '2001'
 * 横向渗透 '2002'
 * 挖矿病毒 '2003'
 * 勒索病毒 '2004'
 * webshell '2005'
 * 黑链 '2006'
 * 僵尸网络 '2007'
 * 服务器中毒 '2008'
 * 
 **** 脆弱性 ****
 * sql注入漏洞 '3001'
 * 远程文件包含漏洞 '3002'
 * 系统命令注入漏洞 '3003'
 * 文件上传漏洞 '3004'
 * 跨站脚本(XSS)漏洞 '3005'
 * 目录遍历漏洞 '3006'
 * 配置错误漏洞 '3007'
 */

import { EVENT_LEVEL, LEVELLIST } from 'src/utils/consts';

export default {
    filters: {
        level (level) {
            let item = LEVELLIST.filter((item) => {
                return level === item.key;
            });
            return item[0] && item[0].value;
        }
    },

    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        index: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            eventLevel: EVENT_LEVEL,
            curIndex: 0,
            example: {},
            type: '',
            open: true
        };
    },
   
    computed: {

        typeNum () {
            let type = Number.parseInt(this.type, 10);
            if (type === 1001 || type === 2001 || type === 2002) { // eslint-disable-line no-magic-numbers
                return 'TYPE1';
            }
            if (type === 1002 || type === 1003) { // eslint-disable-line no-magic-numbers
                return 'TYPE2';
            }
            if (type === 2007) { // eslint-disable-line no-magic-numbers
                return 'TYPE3';
            }
            if (type === 2003 || type === 2004 || type === 2008) { // eslint-disable-line no-magic-numbers
                return 'TYPE4';
            }
            if (type === 2005) { // eslint-disable-line no-magic-numbers
                return 'TYPE5';
            }
            if (type >= 3001 && type <= 3008) { // eslint-disable-line no-magic-numbers
                return 'TYPE6';
            }
            if (type === 2006) { // eslint-disable-line no-magic-numbers
                return 'TYPE7';
            }
            
            return '';
        },
        showTableData () {
            if (this.typeNum === 'TYPE2' || this.typeNum === 'TYPE3') {
                return this.example && this.example[this.curIndex].detail;
            }
            return this.example;
        }
    },
    watch: {
        data () {
            this.example = this.data.example || {};
            this.type = this.data.type || '';
        }
    },
    methods: {
        
        // 点击时间轴点，获取当天数据
        clickDay (curIndex) {
            this.curIndex = curIndex;
        },

        handleClick () {
            this.open = !this.open;
            this.$emit('toggle', this.open);
        }
    }
};
</script>

<style lang="postcss">

.detail-example-wrapper {
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
    border-radius: 2px;
    flex-shrink: 0;
    display: flex;
    flex-flow: column nowrap;
    height:100%;
    font-size: 14px;
   
    & .detail__top {
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
    & .collector-name {
        background: #F8FBFD;
        padding: 10px 21px;
        color: #80848F;
        box-shadow: 0 1px 0 0 rgba(0, 0, 0, .10);
        & .info {
            color: #3DC4BB;
        }
        & .low {
            color: #FFDD55;
        }
        & .middle {
            color: #FF9900;
        }
        & .high {
            color: #F66868;
        }
        & .lost {
            color: #AA0000;
        }
    }
    & .detail__content {
        overflow-y: scroll;
        padding: 10px 21px;
        height: 100%;
        & .one-row {
            color: #80848F;
        }
        & .time-row {
            padding: 80px 50px;
            height: 3px;
            display: flex;
            margin-bottom: 20px;
            background: #f6f9fc;
            & .mid-line {
                position: relative;
                flex: 1;
                display: inline-block;
                max-width: 170px;
                height: 3px;
                background-color: #c8c8c8;
            }
            & .day-item {
                display: inline-block;
                width: 100px;
                & .day-dot {
                    position: absolute;
                    left: -8px;
                    top: -7px;
                    z-index: 1;
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 6px;
                    background: #e74c3c;
                    border: 1px solid #e74c3c;
                    cursor: pointer;
                }
                & .day-att-num {
                    color: #e74c3c;
                }
            }
            & .day-item-top {
                position: absolute;
                left: 30px;
                bottom: 0;
                padding: 6px 0 20px 20px;
                border-left: 1px solid #c8c8c8;
                border-top: 1px solid #c8c8c8;
                & .day-att-time {
                    position: absolute;
                    top: -20px;
                    left: 20px;
                    color: #999;
                }
            }
            & .day-item-bottom {
                position: absolute;
                left: 30px;
                top: 0;
                padding: 20px 0 6px 20px;
                border-left: 1px solid #c8c8c8;
                border-bottom: 1px solid #c8c8c8;
                & .day-att-time {
                    position: absolute;
                    bottom: -16px;
                    left: 20px;
                    color: #999;
                }
            }
        }

        & .detail-empty{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            color: #80848F;
        }

        & .operation-level-label {
            display: inline-block;
            width: 64px;
            border-radius: 20px;
            text-align: center;
            line-height: 18px;
            font-size: 12px;
            color: #fff;
        }

        & .operation-screen-level-label {
            display: inline-block;
            width: 48px;
            border-radius: 2px;
            text-align: center;
            padding: 0 8px;
            line-height: 18px;
            font-size: 12px;
            color: #fff;
        }

        & .operation-lose-label {
            background-color: #c33;
        }

        & .operation-risk-label {
            background-color: #f90;
        }

        & .operation-healthy-label {
            background-color: #00c2c1;
        }

        & .operation-low-label {
            background-color: #4d8dd9;
        }

        & .operation-mid-label {
            background-color: #ff9900;
        }

        & .operation-high-label {
            background-color: #ee5555;
        }

        & .operation-label-row {
            position: relative;
            height: 25px;
            padding-right: 24px;
            white-space: nowrap;
            overflow: hidden;
        }

        & .operation-event-label {
            float: left;
            line-height: 12px;
            padding: 3px 6px;
            margin: 2px 8px;
            font-size: 12px;
            border: 1px solid #ffcccc;
            border-radius: 2px;
            background: #fff;
            color: #ee5555;
            text-align: center;
        }

        & .operation-label-width {
            width: 90px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        & .no-margin-left {
            margin-left: 0;
        }

        & .label-more {
            position: absolute;
            right: 0;
            top: 0;
            padding: 6px;
            cursor: pointer;
        }

        & .not-handle {
            color: #DB4839;
        }

        & .has-handle {
            color: #22B07B;
        }

        & .has-ignore {
            color: #333;
        }

    }
}

</style>