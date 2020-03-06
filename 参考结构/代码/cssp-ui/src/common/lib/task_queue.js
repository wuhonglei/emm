/**
 * @file 等待任务队列任务完成
 */

/* global Promise:true */

import { checkTaskStatus } from 'src/common/api/task';
import { sleep } from 'src/utils/sleep';

const POLLING_INTERVAL = 2000;

// export const STATUS_FAILURE = 'FAILURE';
// export const STATUS_PENDING = 'PENDING';
// export const STATUS_STARTED = 'STARTED';
export const STATUS_SUCCESS = 'SUCCESS';

export default function waitForTask (taskID) {

    let reqStatus = async () => {
        let res = await checkTaskStatus(taskID);
        if (!res.data || !res.data.data) {
            throw new Error();
        }

        let data = res.data.data;

        return data.length > 0 && data[0].status === STATUS_SUCCESS;
    };

    let poll = async () => {
        let success;
        try {
            success = await reqStatus();
        } catch (err) {
            return err;
        }
        
        if (success) {
            return true;
        }

        await sleep(POLLING_INTERVAL);
        return await poll();
    };

    return new Promise(async (resolve, reject) => {
        let res = await poll();
        res === true ? resolve() : reject(res);
    });
}