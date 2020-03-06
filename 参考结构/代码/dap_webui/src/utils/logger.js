/**
 * 日志模块
 * 支持：warn/error/info/debug
 * 功能：堆栈、开发（配合堆栈弹出堆栈信息，用于IE/移动端调试）
 */

class Logger {
    constructor () {
        this.logConfig = {}, // 日志级别对象
        this.level = { // 日志类型
            error: 1,
            warn: 2,
            info: 3,
            debug: 4
        },
        this.levelLen = 4; // 默认不开启 debug
        this.tmpLog = ''; // 临时保持日志字符串
        this.countLogSizeQuery = 1; // 统计日志大小查询次数，每100次统计查询
        this.model = ['pub', 'dev']; // 开发/发布模式，主要用于调试期间
        this.isSupport = window.localStorage ? true : false; // 是否支持localStorage
        this.fragNum = 50, // 50KB一个片段，可增加
        this.maxFrag = 500, // 最大可存储，以KB为单位，500KB

        this._init(); // 初始化配置与事件
    }

    _init () { // 初始化日志
        let logInfo = this.getConfig();
        if (this.isEmpty(logInfo)) { // 如果没有设置，则默认一组
            this.logConfig.level = this.level.debug, // 输出日志级别
            this.logConfig.stack = false, // 输出堆栈，默认不开启
            this.logConfig.model = this.model[0]; // 默认模式
            this.logConfig.saveIndex = 0; // 保存的索引位置
            this.logConfig.writePage = false; // 是否输出到页面指定元素
        } else {
            this.logConfig.level = logInfo.level || 1, // 输出日志级别
            this.logConfig.stack = logInfo.stack || false, // 输出堆栈日志级别
            this.logConfig.model = logInfo.model || this.model[0]; // 默认模式
            this.logConfig.saveIndex = logInfo.saveIndex;
            this.logConfig.writePage = logInfo.writePage || false;
        }

        window.onbeforeunload = () => { // 关闭页面时保存未保存的日志
            this.savePrintInfo(this.tmpLog);
            this.tmpLog = '';
        };
    }

    warn () {
        if (!this._logCondition('warn', true, ...arguments)) {
            return false;
        }
        this.log('warn', ...arguments);
    }

    info () {
        if (!this._logCondition('info', false, ...arguments)) {
            return false;
        }
        this.log('info', ...arguments);
    }

    error () { // 参数不填写，但调用必须填写3个：model, event, msg
        if (!this._logCondition('error', true, ...arguments)) {
            return false;
        }
        this.log('error', ...arguments);
    }

    debug () {
        if (!this._logCondition('debug', false, ...arguments)) {
            return false;
        }
        this.log('debug', ...arguments);
    }

    assert (condtion, msg = '') { // 断言
        if (condtion) {
            return;
        }
        try {
            throw new Error(msg);
        } catch (e) {
            // eslint-disable-next-line
            let output = `${e.message} \r\n`;
            if (e.stack) {
                output += e.stack;
            }
            if (this.logConfig.model === this.model[1]) { // 同时启用堆栈与开发模式
                alert(output);
            }
            this.writeLog('error', `asser: ${output}`);
            return output;
        }
    }

    help () { // 日志输出帮助

        /**
         * 获取指定类型日志：localStorage.getItem('logText0').split(';').filter((ele) => ele.indexOf('[error]') >= 0)
         */

        let breakLine = ' \n',
            logRank = `
                Log level: ${breakLine}
                Error: 1 ${breakLine}
                Warn: 2 ${breakLine}
                Info: 3 ${breakLine}
                Debug: 4 ${breakLine}
                set log level："setLevel(num)", Warn: num is 0, log cannot save  ${breakLine}
                get log level: "getLevel()"  ${breakLine}
                set stack log level："setStack(true/false)"  ${breakLine}
                get stack log level: "getStack()"  ${breakLine}
                set log model: setModel(pub/dev) ${breakLine}
                get log model: getModel() ${breakLine}
                get log text: getLog() ${breakLine}
                default log level is 3. stack off ${breakLine}
                stack info 'alert' need  setting 'on stack' and 'dev model'`;

        this.writeLog('info', logRank); // 只打印不保存
    }

    getLog (fragIndex) {
        if (this.isSupport) {
            if (this.isNumber(fragIndex)) {
                this.writeLog('info', (localStorage.getItem(`logText${fragIndex}`) || '').split(';').join('\n'));
                return;
            }
            let logLen = this.maxFrag / this.fragNum;
            for (let i = 0; i < logLen; i++) {
                this.writeLog('info', (localStorage.getItem(`logText${i}`) || '').split(';').join('\n'));
            }
        }
    }

    writeLog (type, msg) { // 输出日志
        if (window.console && window.console[type]) {
            window.console[type](msg);
        }
        if (this.logConfig.writePage) {
            this.writePage(msg);
        }
    }

    writePage (text) { // 输出日志到页面（主要用于IE无法保存localStorage、移动端调试时无法查看日志）
        let ele = document.getElementById('sflogger');
        if (!ele) {
            ele = document.createElement('div');
            ele.id = 'sflogger';
            document.body.appendChild(ele);
        }
        ele.innerHTML += `${text} <br/>`;
    }

    log (type) { // 日志中转处理函数
        let logParams = [...arguments].slice(1, arguments.length),
            logText = `[${type}] ${this.jointLogText(...logParams)}`,
            logSavePoint = 20;

        if (!this.isSupport) {
            return false;
        }
        
        if (this.level[type] && this.logConfig.stack && (type === 'error' || type === 'warn')) { // 判断堆栈是否启用
            logText += '\n' + this.assert(false, logText); // 增加堆栈
        }

        // 性能影响，每20条保存一次（欧朋浏览器不支持页面卸载事件，例外处理）
        if (this.countLogSizeQuery > logSavePoint || /\bopr|opera/.test(navigator.userAgent.toLowerCase())) {
            this.countLogSizeQuery = 1;
            this.savePrintInfo(this.tmpLog);
            this.tmpLog = '';
        } else {
            this.countLogSizeQuery += 1;
            this.tmpLog += logText + ';'; //为每条日志增加结束符（便于后期调试和管理）
        }
        this.writeLog(type, logText); // 入口处已拦截，可直接输出
    }

    /*
        由于在后期操作日志影响性能，改为保存500K日志
        分为10个片段保存，平均每个片段保证在50K以内
        当片段大于10个时，自动清空最早日志并覆盖新日志
        为了降低操作频率，每20条日志保存一次（调用之前控制），页面在关闭时会再更新一次日志（欧朋实时更新）
    */
    savePrintInfo (logText) { // 保存日志打印信息
        let maxFragNum = this.maxFrag / this.fragNum, // 最多存放多少片段
            oneKb = 1024, // 1KB
            toFragNum = this.fragNum * oneKb, // 50KB(1024*50)
            logName = 'logText',
            currFrag =  this.getFrag(logName + this.logConfig.saveIndex); // 当前日志片段

        if (!logText || !this.isSupport) {
            return false;
        }

        if ((currFrag.length + logText.length) >= toFragNum) { // 当存储片段不够，则开辟新空间（新空间不区分是否存在，直接设置覆盖）
            this.logConfig.saveIndex += 1;
            if (maxFragNum <= this.logConfig.saveIndex) { // 当满的是最后一个，直接从第一个开始覆盖
                this.logConfig.saveIndex = 0;
            }
            this._setConfig(this.logConfig);
            this._setFrag(logName + this.logConfig.saveIndex, logText); // 开辟新空间存储
        } else {
            currFrag += logText;
            localStorage.setItem(logName + this.logConfig.saveIndex, currFrag);
        }
    }

    jointLogText (moduleName, logDesc, logReason) { // 拼接日志文本
        let anaText = this._analysisLogMsg(...arguments), // 获取解析的日志
            logText = this.getNowFormatDate(); // 获取当前时间

        logText += (moduleName && ' [' + moduleName + ']') || '';
        logText += (logDesc && ' ' + logDesc) || '';
        
        anaText = logReason ? `. Reason: ${anaText}` : ''; // 获取解析的日志
        logText += anaText;
                
        return logText; // 拿到日志并存储（位置预留）
    }

    _analysisLogMsg () { // model, event, msg，后面支持动态配置多个
        let logStr,
            logReg,
            argMinLen = 4, // 参数最小长度，低于数字直接返回
            logAnalysisIndex = 3, // 日志参数开始解析位置
            arg = arguments;
        if (arg.length < argMinLen) {
            return arg[2];
        }
        logStr = arg[2];
        for (let i = logAnalysisIndex; i < arguments.length; i++) {
            logReg = new RegExp('%s'); 
            logStr = logStr.replace(logReg, arg[i]);
        }
        return logStr;
    }

    _logCondition (type, isCheck) { // 日志相同条件，用于初期条件返回，进入具体日志调用，不做判断，便于调用
        let paramsNum = 5;
        if (this.logConfig.level < this.level[type]) { // 排查日志级别
            return false;
        }
        if (isCheck && arguments.length < paramsNum) { // 参数个数
            this.assert(false, 'log params error');
            return false;
        }
        return true;
    }

    setModel (modelName) { // 设置模式（dev：开发/pub：发布）
        if (this.model.indexOf(modelName) < 0) {
            return;
        }
        this.logConfig.model = modelName;
        this._setConfig(this.logConfig);
    }
    
    getModel () { // 获取模式（开发/发布）      
        let logConfig = this.getConfig();
        this.writeLog('debug', logConfig.model);
    }
    
    setLevel (num) { // 设置日志等级(0~4,0不开启)
        if (!this.isNumber(num) && num < this.levelLen && num >= 0) { // 传入数字不在级别内
            return false;
        }
        this.logConfig.level = num; // 保证无刷新下页面执行
        this._setConfig(this.logConfig);
    }

    getLevel () { // 获取当前日志等级
        let logConfig = this.getConfig();
        this.writeLog('debug', logConfig.level);
    }

    setStack (flag) { // 设置堆栈日志状态（开启：true，关闭：false）
        if (!this.isBool(flag)) { // 不支持或传入数字不在级别内
            return false;
        }
        this.logConfig.stack = flag; // 保证无刷新下页面执行
        this._setConfig(this.logConfig);
    }

    getStack () { // 获取堆栈日志是否开启状态
        let logConfig = this.getConfig();
        this.writeLog('debug', logConfig.stack);
    }

    setWritePage (flag) { // 设置输出到页面状态
        if (!this.isBool(flag)) { // 不支持或传入数字不在级别内
            return false;
        }
        this.logConfig.writePage = flag; // 保证无刷新下页面执行
        this._setConfig(this.logConfig);
    }

    getWritePage () { // 获取输出到页面启状态
        let logConfig = this.getConfig();
        this.writeLog('debug', logConfig.writePage);
    }

    getFrag (fragName) { // 获取日志片段
        let currFrag = '';
        try {
            if (this.isSupport) {
                currFrag = localStorage.getItem(fragName) || '';
            }
        } catch (e) {
            return currFrag;
        }
        return currFrag;
    }

    _setFrag (fragName, logText) { // 保存日志片段
        try {
            if (this.isSupport) {
                localStorage.setItem(fragName, logText);
            }

        // eslint-disable-next-line
        } catch (e) {}
        
    }

    getConfig () { // 获取数据：从localStorage
        let logConfig = localStorage.getItem('logConfig');
        if (this.isEmpty(this.logConfig) && !this.isSupport) {
            return ''; // 不支持场景且没有缓存数据
        }
        if (!logConfig && this.isEmpty(this.logConfig)) { // 缓存对象与localStorage没有
            return '';
        }
        try {
            return JSON.parse(logConfig) || this.logConfig;
        } catch (e) {
            this.writeLog('error', 'log format error. please check');
            return this.logConfig; // 格式错误直接使用缓存对象
        }
    }

    _setConfig (logOpt) { // 设置，只在内部设置，不允许动态指定传参
        if (this.isEmpty(logOpt)) { // 没有传入参数
            this.writeLog('debug', '_setConfig params error');
            return false;
        }

        localStorage.setItem('logConfig', JSON.stringify(logOpt));
    }

    _setSaveIndex (index) {
        if (!this.isNumber(index)) { // 不支持或传入数字不在级别内
            return false;
        }
        this.logConfig.saveIndex = index; // 保证无刷新下页面执行
        this._setConfig(this.logConfig);
    }

    getSaveIndex () { // 获取保存的日志信息
        let logConfig = this.getConfig();
        this.writeLog('debug', logConfig.saveIndex);
    }

    getNowFormatDate () { // 获取当前时间
        let date = new Date(),
            month = date.getMonth() + 1,
            dateStr = date.getDate(),
            dateSalting = 10; // 时间个位数临界点
        if (month >= 1 && month < dateSalting) {
            month = `0${month}`;
        }
        if (dateStr >= 0 && dateStr < dateSalting) {
            dateStr = `0${dateStr}`;
        }
        let currDate = `${date.getFullYear()}-${month}-${dateStr} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return currDate;
    }

    isBool = function (ele) { // 是否布尔类型
        return ele === !!ele || ele instanceof Boolean;
    }

    isNumber (ele) { // 是否数字类型
        return (typeof ele === 'number') || ele instanceof Number;
    }

    isFn = function (ele) { // 是否函数
        return (typeof ele === 'function');
    }

    isObject = function (ele) { // 是否对象
        return ele === Object(ele);
    }

    isEmpty (container) { // 是否为空
        if (Array.isArray(container)) {
            return container.length === 0;
        } else if (this.isObject(container)) {

            // when an object has a valueOf function that doesn't return an object,
            // object is empty if value is empty
            if (this.isFn(container.valueOf) && !this.isObject(container.valueOf())) {
                return this.isEmpty(container.valueOf());
            }

            // eslint-disable-next-line @sxf/sfchecklist/for-in-condition-enhance
            for (let item in container) {
                if (Object.prototype.hasOwnProperty.call(container, item)) {
                    return false;
                }
            }
            return true;
        }
        return !container;
    }
}

export default new Logger();
