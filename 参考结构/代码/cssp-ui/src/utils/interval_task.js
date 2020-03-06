/**
 * 定时请求文件封装
 */

import { sleep, clearSleep } from './sleep';
import uuid from './uuid';

const STATE = {
    STOPPED: 1,
    RUNNING: 2,
    WAITING: 3
};

function createCallback (task) {
    let next = function (success) {
        if (success === false) {
            task.stop();
        } else {
            task.next();
        }
    };

    return async function (skipFirst) {
        task.state = STATE.RUNNING;
        if (skipFirst) {
            next(true);
        } else {
            try {
                await task.fn.call(task.scope || task);
                next(true);
            } catch (err) {
                next(false);
            }
        }
    };
}

export default class IntervalTask {

    static STATE = STATE;

    constructor (opt = {}) {
        this.skipFirst = !!opt.skipFirst;

        this.interval = opt.interval || 0;
        this.fn = opt.fn;
        this.scope = opt.scope;
        this.state = STATE.STOPPED;

        if (opt.autoStart) {
            this.start();
        }
    }

    start (skipFirst = this.skipFirst) {
        if (this.state === STATE.STOPPED) {
            this.state = STATE.WAITING;
            createCallback(this)(!!skipFirst);
        }
    }

    stop () {
        if (this.tid) {
            clearSleep(this.tid);
            this.tid = null;
        }

        this.state = STATE.STOPPED;
    }

    next () {
        let me = this;
        if (this.state === STATE.RUNNING) {
            this.state = STATE.WAITING;

            this.tid = uuid();
            sleep(this.tid, this.interval).then(function () {
                createCallback(me)();
            });
        }
    }

}
