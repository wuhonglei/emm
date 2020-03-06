/* eslint-disable */

import { allInterface } from 'src/config/all_interface';

// 获取 all_interface 配置中的路径
function getReqUrl(name) {
    for (let i = 0; i < allInterface.length; i++) {
        if (name === allInterface[i].name) {
            return allInterface[i].url;
        }
    }
}

// 配置需要去除tips和错误日志打印的请求路径以及对应的错误码数组对象的格式，code数组格式可配置多个
const ERROR_CONFIG = [{
    url: getReqUrl('getProgressValue'),
    codeArr: [7201]
}];

export default ERROR_CONFIG;