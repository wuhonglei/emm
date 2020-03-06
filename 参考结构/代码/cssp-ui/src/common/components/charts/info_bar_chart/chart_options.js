/**
 * @file 柱状图配置
 */

/* global _ */

import { renderInfoToolTip } from '../tooltip';
import { filterNumUnit } from 'src/common/lib/filters';

const LABELS = {
    total: _('全部日志'),
    network: _('网络日志'),
    safety: _('安全设备'),
    server: _('服务器'),
    other: _('其他日志')
};

const MIN_HEIGHT = 0.028;

export default  function (data = []) {
    let max = Math.max(...data.map(item => item.value)) || 1;
    return {
        color: ['#17C1C5'],
        tooltip: {
            trigger: 'axis',
            show: true,
            backgroundColor: 'transparent',
            extraCssText: 'box-shadow: 0 0 4px 0 rgba(0,0,0,0.15);padding:0',
            formatter: (params) => {
                let _params = Array.isArray(params) ? params[0] : params;
                let item = data[_params.dataIndex];
                let info = Object.keys(item).filter(
                    key => Object.keys(LABELS).findIndex(l => l === key) > -1
                ).map(key => ({
                    key: key,
                    label: LABELS[key],
                    value: filterNumUnit(item[key])
                }));

                let date = new Date(item.date);
                return renderInfoToolTip(
                    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, 
                    info, 
                    {
                        width: '145px'
                    }
                );
            }
        },
        grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: '5%',
            borderColor: '#eee',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: data.map(item => item.label),
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisLabel: {
                    color: '#495060'
                },
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLabel: {
                    color: '#999',
                    formatter (value) {
                        return filterNumUnit(value);
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                }
            }
        ],
        series: [
            {
                type: 'bar',
                barWidth: '16px',

                // 处理最小柱子高度，避免高度太低和无数据的混淆
                data: data.map(
                    item => item.value / max >= MIN_HEIGHT || item.value === 0 ? 
                        item.value : 
                        max * MIN_HEIGHT
                )
            }
        ]
    };
}