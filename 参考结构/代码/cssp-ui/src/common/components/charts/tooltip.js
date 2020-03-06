/**
 * @file echart tooltip 渲染函数
 */

export default function renderTooltip (innerHtml) {
    return renderTooltipFrame(innerHtml);
}

// 渲染浮窗提示框架
function renderTooltipFrame (inner) {
    function _frameStyle () {
        return parseStyleObj({
            position: 'relative',
            display: 'inline-flex',
            height: 'auto',
            'background-color': 'rgba(255,255,255,0.8)',
            'box-shadow': '0 0 4px 0 rgba(0,0,0,0.15)',
            border: '1px solid #ddd',
            color: '#495060'
        });
    }

    return `
        <div class="info-chart__tooltip"
             style="${_frameStyle()}">
            ${inner}
        </div>
    `;
}

export function renderInfoToolTip (title, data, styleObj) {

    // 圆点样式
    function _legendDotStyle (legend = {}) {
        return parseStyleObj({
            display: 'inline-block',
            width: legend.size || '8px',
            height: legend.size || '8px',
            'margin-right': '8px',
            'border-radius': '50%',
            'background-color': legend.color
        });
    }

    // 渲染圆点
    function renderLegendDot (legend) {
        return legend && legend.color ? 
            `<span style="${_legendDotStyle(legend)}"></span>` : 
            '';
    }

    // 单行样式
    function _rowStyle () {
        return parseStyleObj({
            display: 'flex',
            'justify-content': 'flex-start',
            'align-items': 'center',
            'word-wrap': 'break-line',
            height: '22px',
            color: '#495060',
            'font-size': '12px'
        });
    }

    // 渲染数据行
    function renderRow (item) {
        return `
            <div 
                class="info__row"
                style="${_rowStyle()}">
                ${renderLegendDot(item.legend)}
                ${item.label}${item.value ? '：' + item.value : ''}
            </div>`;
    }

    // 标题行样式
    function _titleRowStyle () {
        return parseStyleObj({
            display: 'flex',
            'justify-content': 'flex-start',
            'word-wrap': 'break-line',
            height: 'auto',
            color: '#aaa',
            'font-size': '12px'
        });
    }

    // 渲染标题行
    function renderTitleRow (title) {
        return `
            <div 
                class="info__row date"
                style="${_titleRowStyle()}">
                ${title}
            </div>`;
    }

    // 包裹元素样式
    function _wrapperStyle () {
        return parseStyleObj(Object.assign({
            height: 'auto',
            padding: '7px'
        }, styleObj || {}));
    }

    return renderTooltipFrame(
        `<div style="${_wrapperStyle()}">
            ${title ? renderTitleRow(title) : ''}
            ${data.map(item => renderRow(item)).join('')}
        </div>`
    );
}

// 将对象转换成style字符串
function parseStyleObj (obj = {}) {
    return Object.keys(obj).map(key => `${key}:${obj[key]}`).join(';');
}