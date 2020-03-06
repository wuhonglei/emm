/**
 * 判断GA是否可用，并加载GA
 * 在某些情况下，ga代码会一直处于正在加载的状态，导致页面一直转圈
 */

const GA_DOMAIN = 'https://www.googletagmanager.com';
const DEFAILT_TIMEROUT = 3000;

/**
 * 判断GA是否可用，并加载GA
 * 
 * @param {string} id GA id
 * @param {string} [domain = GA_DOMAIN] - 用于检测GA是否可用的域名
 * @param {number} [timeout = DEFAILT_TIMEROUT] - 超时时间 单位为毫秒
 */
function ga (id, domain = GA_DOMAIN, timeout = DEFAILT_TIMEROUT) {
    canGaAvailable(domain, timeout)
        .then(() => {
            (function (w, d, s, l, i) {
                w[l] = w[l] || []; w[l].push({
                    'gtm.start':
                        new Date().getTime(), event: 'gtm.js'
                });

                let f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), 
                    dl = l !== 'dataLayer' ? '&l=' + l : ''; 
                j.async = true; j.src =
                    GA_DOMAIN + '/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', id);
        })
        .catch(() => {});

}

/**
 * 判断当前能否在特定时间内加载GA
 * 
 * @param {string} [domain = GA_DOMAIN] - 用于检测GA是否可用的域名
 * @param {numner} [timeout = DEFAILT_TIMEROUT] - 超时时间 单位为毫秒
 * @returns {promise} 
 */
function canGaAvailable (domain = GA_DOMAIN, timeout = DEFAILT_TIMEROUT) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        let timer = null;
        img.onload = check;
        img.onerror = check;
        img.src = domain;

        // 超过设定的时间即为超时
        timer = setTimeout(() => {
            check(true);
        }, timeout);

        // 加载报错也无所谓，只要不阻塞就行了
        function check (timeout = false) {
            if (!timer) {
                return;
            }

            // 清空定时器和timer，避免重复执行
            clearTimeout(timer);
            timer = null;

            // 终止请求，避免阻塞
            img.src = '';

            // 释放
            img = null;

            if (timeout) {
                reject();
            } else {
                resolve();
            }
        }
    });
}


export default ga;