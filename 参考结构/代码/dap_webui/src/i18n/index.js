/**
 * Created by ued on 2016/11/8.
 */
/* eslint-disable */

import { fetchConfig } from 'src/util/fetch';
import co from '../util/co_not_reject';
import logger from '../util/logger';

import en from './en';
import zh from './zh_cn';

const LANGUAGE = {
    'zh_CN': zh,
    'en_US': en
};

let devLangMap = {
    'zh_CN': {},
    'en_US': {}
};

/**
 * 当前语言
 */
let cur;

/**
 * _ 中英文替换函数
 * @param {String} str    _('我是中文{0}、{1}', 'replace0', 'replace1')
 * @param {String} args   {N} 占位符
 * @returns {String}      替换后的字符串
 */
function _ (str, ...args) {

    let langMap = Object.assign({}, LANGUAGE[cur], devLangMap[cur]);

    if (langMap && langMap.hasOwnProperty(str)) {
        str = langMap[str];
    }

    return replaceMark(str, ...args);
}

/**
 * 字串中可以包含形如 {#mark#} 的文本，它的作用是用于附加额外语境信息。
 * 例如中文里“启用”，可以是形容词，表示此条记录启用；也可以是动词，点击即启用此记录；
 * 如果没有额外标识，它们翻译成英文只能有一个结果，但实际上它们应该分别翻译为：“Enabled”与“Enable”
 * 有额外标识后，翻译表中，就是这样的了：
 * “启用{#adj#}” -> “Enabled”
 * “启用{#verb#}” -> “Enable”
 * 如果没有翻译表，则自动去掉额外标识，翻译为“启用”
 */
function replaceMark (str, ...args) {
    return str.replace(/\{(\d+|#\w+#)\}/g, function (m, i) {
        i = parseInt(i, 10);
        if (isNaN(i)) {
            return '';
        }
        if (i >= 0 && i < args.length) {
            return args[i];
        }
        return m;
    });
}


/**
 * 初始化中英文，全局注册 _()
 * @param {Object} Vue Vue
 * @param {Object} opt i18n配置
 * @return {Boolean} 成功注册
 */
function initI18n (Vue, opt) {
    cur = opt.lang;

    if (typeof window !== 'undefined') {
        let old;

        if (window._) {
            logger.log('function _ () {} found...');
            old = window._;
            window._ = function (str, ...args) {
                let enText = _(str, ...args);
                let oldEnText = old(str, ...args);
                let replaceMarkStr = replaceMark(str);

                if (replaceMarkStr !== enText) {
                    return enText;
                }

                if (replaceMarkStr !== oldEnText) {
                    return oldEnText;
                }

                return _(replaceMarkStr, ...args);
            };
        } else {
            window._ = _;
        }

        Vue.prototype._ = window._;

        return true;
    }
    return false;
}

export default {
    install (Vue, opt = { lang: 'zh-CN' }, isIndex = true) {
        initI18n(Vue, opt);

        if (isIndex) {
            let mapProtect = ['AC', 'WOC', 'MIG', 'aBOS', 'AF', 'IAM', 'SG', 'NGAF'];
            mapProtect.forEach(item => {
                co(function * () {
                    let config = yield fetchConfig(`static/dev/${item}/i18n.js`);
                    let configDev = {};

                    //给每个产品的翻译都加上产品的后缀，以便区分
                    for (let key in config) {
                        if (!config.hasOwnProperty(key)) {
                            return;
                        }

                        configDev[key + `{#${item}#}`] = config[key];
                    }
                    Object.assign(devLangMap.en_US, configDev || {});
                });
            });
        }

    }
};
