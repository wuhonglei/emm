/**
 * @file ac 日志详情配置
 */

import common from './common';
import terminal from './terminal';
import netsafe from './netsafe';

export default {
    name: '上网行为管理',
    detail: Object.assign(
        {}, 
        common, 
        terminal, 
        {
            netsafe: {
                name: '上网安全',
                detail: netsafe
            }
        }
    )
};