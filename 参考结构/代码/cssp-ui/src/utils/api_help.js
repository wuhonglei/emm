/**
 * api辅助函数
 */

function pipe (key, ...handlers) {
    return (value) => {
        return handlers.reduce((v, handler) => handler(v, key), value);
    };
}

// 需要以逗号分隔成数组的key
const SPLIT_LIST = ['src_ip', 'dst_ip', 'ip_list', 'block_port', 'duration'];

//  用逗号分隔字符串参数
function splitParaByComma (value, key) {
    if (value && SPLIT_LIST.indexOf(key) > -1 && typeof value === 'string') {
        return value.split(',');
    }
    return value;
}

//  用[]包裹非数组型参数
export function prefixParaWithList (value, key) {
    if (key === 'product' || key === 'type' || key === 'uuid') {
        return value;
    }
    if (value && !Array.isArray(value)) {
        return [value];
    }
    
    return value;
}

//ac时间排序，name与value转换
export function exchangeTimeOrder (obj, value) {
    obj.forEach(item => {
        if (item.name === value) {
            value = item.value;
        }
    });
    return value;
}

/**
 * 根据产品名和模块名自动构造对应的接口参数 productName 
 * @param {function} api 
 * @param {string} productName 
 * @param {string} moduleName 
 * @param {array} [blacklist=[]] - 需要自定去除参数的key的数组，优先级最高
 * @param {function} paramsHandler(value, key):newValue - 定义过滤参数的函数，每个参数最后都会经过这个函数
 * @return {function} 处理参数后的接口函数
 */
export function normalizeParams (api, productName, moduleName, blacklist = [], ...paramsHandlers) {
    return (controlPara = {}, sortPara = {}) => {
        let payload = {
            control_para: controlPara,
            sort_para: null
        };
        let temp = {};

        Object.keys(sortPara).forEach((key) => {
            let value = sortPara[key];

            if (blacklist.indexOf(key) > -1) {
                return;
            }

            value = pipe(key, splitParaByComma, ...paramsHandlers)(value);

            if (!value && value !== 0) { // 逻辑值为false, 但不为0
                return;
            }

            if (typeof value === 'object' && Object.keys(value).length === 0) { //  空对象
                return;
            } 

            if (Array.isArray(value) && value.length === 0) {   //  空数组
                return;
            }

            temp[key] = value;
        });

        temp.product = productName;
        temp.type = moduleName;
        payload.sort_para = temp;

        return api(payload);
    };
};

/**
 * 轮询部分
 */

const DEFAULT_OPTIONS = {
    delay: '200',     //轮询间隔时间
    // wait: {         //是否等待前一个请求完毕（）
    //     delay: '1000',    //最久等待时间，（毫秒）
    //     onSuccess() {},  //前一个请求成功，
    //     onError() {}     //前一个请求失败
    // },
    onSuccess () {    //当前请求成功
    },
    onFailed () {     //当前请求失败

    }
};


/**
 * 使用方法:
 *      let poll = new Poll(api, options);
 *      poll.start();开启轮询
 *      poll.isRunning();检查是否开启
 *      poll.stop();关闭轮询
 * @param {Promise} task为一个Promise对象
 * @param {Object} options为配置对象 详细见上面的默认参数
 * @returns {Poll} Poll对象
 */
export class Poll {
    constructor (task, options) {
        this.options = {
            ... DEFAULT_OPTIONS, ...(options || {})
        };
        this.task = task;
        this.running = false;

        this._asyncProccess = this._asyncProccess.bind(this);
        this._syncProccess = this._syncProccess.bind(this);
        this.stop = this.stop.bind(this);
    }

    _asyncProccess () {
        let options = this.options;
        let wait = options.wait;
        let overtime = false;   //是否超时
        this.task()
            .then(res => {
                options.onSuccess && options.onSuccess(res, this.stop);
                wait.onSuccess && wait.onSuccess(res, this.stop);
            })
            .catch(err => {
                options.onFailed && options.onFailed(err, this.stop);
                wait.onFailed && wait.onFailed(err, this.stop);
            })
            .finally(() => {
                let running = this.running;
                if (running) {
                    let delay = options.delay;

                    //  延时发起请求
                    setTimeout(() => {
                        if (overtime) {
                            return;
                        }
                        overtime = true;
                        this._asyncProccess();
                    }, delay);
                }
            });
        if (+wait.delay) {

            //  请求超时时
            setTimeout(() => {
                if (overtime) {
                    return;
                }
                overtime = true;
                this._asyncProccess();
            }, wait.delay);
        }
    }

    _syncProccess () {
        let options = this.options;

        this.task()
            .then(res => {
                options.onSuccess && options.onSuccess(res, this.stop);
            })
            .catch(err => {
                options.onFailed && options.onFailed(err, this.stop);
            });
        
        let running = this.running;
        if (running) {

            //  延时调用
            setTimeout(this._syncProccess, options.delay);
        }
    }

    stop () {
        this.running = false;
    }

    start () {
        this.running = true;
        if (this.options.wait) {
            this._asyncProccess();
        } else {
            this._syncProccess();
        }
        
    }

    isRunning () {
        return this.running;
    }
}