/**
 * @file 饼图的options
 */

import { INFO_CHART_DEFAULT_COLOR_LIST } from 'src/utils/consts';

export default function (data = [], colorList = INFO_CHART_DEFAULT_COLOR_LIST) {
    return {
        series: [
            {
                name: 'infoChart',
                type: 'pie',
                radius: ['75%', '100%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: data.map(item => ({
                    value: item.value,
                    label: item.label,
                    name: item.key
                })),
                color: colorList.slice(0, data.length)
            }
        ]
    };
}