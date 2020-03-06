/**
 * @file 折线图配置
 */

/* global _ */

import { renderInfoToolTip } from '../tooltip';
import { filterNumUnit } from 'src/common/lib/filters';

const LABELS = {
    total: _('全部'),
    lost: _('致命'),
    high: _('高'),
    middle: _('中'),
    low: _('低'),
    info: _('信息')
};

export default  function (data = []) {
    return {
        color: ['#17C1C5'],
        tooltip: {
            trigger: 'item',
            show: true,
            backgroundColor: 'transparent',
            extraCssText: 'box-shadow: 0 0 4px 0 rgba(0,0,0,0.15);padding:0',
            formatter: (params) => {
                let _params = Array.isArray(params) ? params[0] : params;
                let item = data[_params.dataIndex];

                // 根据LABELS常量过滤显示的数据
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
            right: 20,
            bottom: 0,
            top: '5%',
            borderColor: '#eee',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: data.map(item => item.label),
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisPointer: {
                    show: true,
                    type: 'line',
                    label: {
                        show: false
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
                type: 'line',
                smooth: true,
                connectNulls: true,
                areaStyle: {
                    normal: {
                        color: '#17C1C5',
                        opacity: 0.1,
                        origin: 'start'
                    }
                },
                lineStyle: {
                    normal: {
                        color: '#17C1C5'
                    }
                },

                //eslint-disable-next-line
                symbol: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTBweCIgaGVpZ2h0PSIxMHB4IiB2aWV3Qm94PSIwIDAgMTAgMTAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU5LjEgKDg2MTQ0KSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5Eb3Q8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUDbml6Xlv5flrqHorqHkuK3lv4MiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJEb3QiPgogICAgICAgICAgICA8Y2lyY2xlIGlkPSLmpK3lnIblvaIiIGZpbGw9IiNGRkZGRkYiIGN4PSI1IiBjeT0iNSIgcj0iNSI+PC9jaXJjbGU+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9IuakreWchuW9oiIgZmlsbD0iIzE3QzFDNSIgY3g9IjUiIGN5PSI1IiByPSIzIj48L2NpcmNsZT4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==',
                data: data.map(item => item.value)
            }
        ]
    };
}