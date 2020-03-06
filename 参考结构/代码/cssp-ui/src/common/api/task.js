/**
 * @file 任务队列相关接口
 */

import axios from './index';

export function checkTaskStatus (taskID) {
    return axios({
        url: '/operate_log/',
        method: 'get',
        params: {
            action: 'task_id_log',
            params: JSON.stringify({
                task_id: taskID
            })
        }
    });
}