/**
 * 下载文件
 * @param {string} filename 
 */

export default function (filename) {
    if (typeof filename !== 'string') {
        throw new Error('不是一个文件名');
    }
    location.href =  (process.env.NODE_ENV === 'production' ? '' : '/api') + 
                    '/static/tmp/httpd/excel/' + filename;
};