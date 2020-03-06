
/**
 * ie下面这种new Date('2000-11-11 11:11:11')会失败，这里重新写一个
 * @param {String} datetime 日期时间字符串，格式如下：2019-01-20 12:23:34
 * @returns {Date} 返回一个Date对象
 */

function decodeDate (datetime) {
    let dateTime = datetime.toString().split(' ');
    let date = dateTime[0] || '';
    let time = dateTime[1] || '';
    let times = [];
    let index = 0;

    date.split('-').forEach(function (item, i) {
        item = parseInt(item, 10);
        if (i === 1) {

            // 月份要减1
            item -= 1;
        }
        times.push(item);
    });

    time.split(':').forEach(function (item) {
        item = parseInt(item, 10);
        times.push(item);
    });

    return new Date(
        times[index++] || 0,
        times[index++] || 0,
        times[index++] || 0,
        times[index++] || 0,
        times[index++] || 0,
        times[index] || 0
    );
}

// 时间戳转换成例如2019-7-25 16:43:00
function formatDate (data) {
    if (!data) {
        return '';
    }
    let num = 10,
        date = new Date(parseInt(data, num)),
        Y = date.getFullYear() + '-',
        M = date.getMonth() + 1 < num ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-',
        D = date.getDate() < num ? '0' + date.getDate() + ' ' : date.getDate() + ' ',
        h = date.getHours() < num ? '0' + date.getHours() + ':' : date.getHours() + ':',
        m = date.getMinutes() < num ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':',
        s = date.getSeconds() < num ? '0' + date.getSeconds() : date.getSeconds();
        
    return Y + M + D + h + m + s;
}

function formatBegDate () {
    let num = 10,
        date = new Date(),
        Y = date.getFullYear() + '-',
        M = date.getMonth() + 1 < num ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-',
        D = date.getDate() < num ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        
    return Y + M + D + '00:00:00';
}

function formatEndDate () {
    let num = 10,
        date = new Date(),
        Y = date.getFullYear() + '-',
        M = date.getMonth() + 1 < num ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-',
        D = date.getDate() < num ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        
    return Y + M + D + '23:59:59';
}

/* eslint-enable quotes */

export {
    decodeDate,
    formatDate,
    formatBegDate,
    formatEndDate
};