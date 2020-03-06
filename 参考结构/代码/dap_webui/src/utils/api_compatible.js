/**
 * 针对IE不兼容的API做处理
 */

if (!Array.from) { // Array.from在IE上不兼容
    Array.from = function (el) {
        return Array.apply(this, el);
    };
}