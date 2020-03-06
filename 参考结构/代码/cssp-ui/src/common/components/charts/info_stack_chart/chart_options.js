/**
 * @file 柱状图配置
 */

/* global _ */

import { renderInfoToolTip } from '../tooltip';
import { filterNumUnit } from 'src/common/lib/filters';

const SERIES = {
    lost: _('致命'),
    high: _('高'),
    middle: _('中'),
    low: _('低'),
    info: _('信息')
};

const COLORS = {
    lost: '#963C32',
    high: '#D4453D',
    middle: '#EE5555',
    low: '#FF9900',
    info: '#FFCC00'
};

const MAX_NAME_LENGTH = 12; // 数据项label名的最大长度
const MIN_LENGTH = 0.028; // 每项数据在图上的最小长度

export default  function (data = [], levels = []) {

    // 是否需要计算最小的宽度（现在当没有堆叠的时候计算）
    let doCalcMinHeight = levels.length === 1;
    if (doCalcMinHeight) {
        let max = Math.max(...data.map(item => item.data[levels[0]])) || 1;
        data.forEach(item => {
            let num = item.data[levels[0]];
            item.value = num / max > MIN_LENGTH ? 
                num : 
                max * MIN_LENGTH;
        });
    }

    return {
        tooltip: {
            trigger: 'item',
            show: true,
            backgroundColor: 'transparent',
            extraCssText: 'box-shadow: 0 0 4px 0 rgba(0,0,0,0.15);padding:0',
            formatter: (params) => {
                let _params = Array.isArray(params) ? params[0] : params;
                return renderInfoToolTip(_params.name, [{
                    label: _params.seriesName,
                    legend: {
                        color: COLORS[
                            Object.keys(SERIES).find(
                                key => SERIES[key] === _params.seriesName
                            )
                        ]
                    },
                    value: filterNumUnit(
                        doCalcMinHeight ? 
                            data[_params.dataIndex].data[levels[0]] : 
                            _params.value
                    )
                }]);
            }
        },
        legend: {
            show: true,
            data: levels.map(level => SERIES[level]),
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 30,
            bottom: 0,
            textStyle: {
                color: '#80848F',
                fontSize: 12
            },
            selectedMode: false
        },
        grid: {
            left: 0,
            right: 20,
            bottom: 30,
            top: '5%',
            borderColor: '#eee',
            containLabel: true
        },
        yAxis: [
            {
                type: 'category',
                data: data.map(item => ({
                    value: item.name
                })),
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisLabel: {
                    formatter: (value, index) => {
                        let item = data[index];
                        let name = item.name.length > MAX_NAME_LENGTH ? 
                            item.name.slice(0, MAX_NAME_LENGTH) + '...' : 
                            item.name;
                        return item ? `{title|${name}}\n{sub|${item.ip}}` : '';
                    },
                    rich: {
                        title: {
                            color: '#495060',
                            fontSize: 12,
                            align: 'right'
                        },
                        sub: {
                            color: '#999',
                            fontSize: 12,
                            align: 'right'
                        }
                    }
                },
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        xAxis: [
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
        series: levels.map(level =>({
            name: SERIES[level],
            id: level,
            type: 'bar',
            stack: 'total',
            barWidth: '12px',
            legendHoverLink: false,
            itemStyle: {
                normal: {
                    color: COLORS[level]
                }
            },

            // 当么有堆叠的时候处理最小高度（levels长度为1）
            data: data.map(item => doCalcMinHeight ? item.value : item.data[level])
        }))
    };
}