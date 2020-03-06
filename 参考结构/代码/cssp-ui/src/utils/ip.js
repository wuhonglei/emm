var ip = {};

ip.ipRange2Array = function(str) {
    var arr = str.split(/(?:[\s\uFEFF\xA0]*\r?\n[\s\uFEFF\xA0]*)+/);
    var rs = [];
    arr.forEach((v) => {
        if (v) {
            rs.push(v.trim());
        }
    });
    return rs;
};

ip.ip = function(v) {
    const tmp = '(?:\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])';
    const regStr = `^(${tmp}\\.${tmp}\\.${tmp}\\.${tmp})$`;
    const IPAddress = new RegExp(regStr);
    return IPAddress.test(v);
};

ip.prefixIp = function(v, prefix) {
    let ipInfo;
    if (prefix) {
        ipInfo = [v, prefix];
    } else {
        ipInfo = v.split('/');
    }
    return ipInfo.length === 2 && ip.ip(ipInfo[0]) && ip.isValidSubNetPrefix(ipInfo[1]);
};

ip.isValidSubNetPrefix = function(v) {
    var vString = v.trim(),
        vNumber = Number(vString);

    // 排除掩码前面有0的情况
    if (vString !== ('' + vNumber)) {
        return false;
    }

    // 排除掩码是2.这种情况
    if (vString.indexOf('.') > -1) {
        return false;
    }
    return !isNaN(vNumber) && 0 <= vNumber && vNumber <= 32 && ip.isInteger(vNumber);
};

ip.rawIpRange = function(v, option) {
    var ipInfoArr = v.split('-');
    if (ipInfoArr.length !== 2) {
        return false;
    }

    var result = ip.ip2int(ipInfoArr[1]) - ip.ip2int(ipInfoArr[0]);

    if (option.enableEqual) {
        if (result === 0) {
            result = 1;
        }
    }

    return ip.ip(ipInfoArr[0]) &&
        ip.ip(ipInfoArr[1]) && (result > 0);
};

ip.ip2int = function(v) {
    var a = v.split('.');
    return parseInt(a[0], 10) * 256 * 256 * 256 +
        parseInt(a[1], 10) * 256 * 256 +
        parseInt(a[2], 10) * 256 +
        parseInt(a[3], 10);
};
ip.isInteger = function(num) {
    return (num | 0) === num;
};

ip.maskIp = function(v, mask) {
    const value = Number(v);
    return (value > 0 && value <= 32);

    // var ipInfo;
    // if (mask) {
    //     ipInfo = [v, mask];
    // } else {
    //     ipInfo = v.split('/');
    // }
    //
    // ipInfo[1] = ipInfo[1] && trim(ipInfo[1]);
    // return !!ipInfo[1] && x.ip(ipInfo[0]) && R_Validate.mask(ipInfo[1]);
};

ip.mask = function(v) {
    var num, binMask;
    if (ip.ip(v)) {
        num = ip.ip2int(v);
        binMask = ip.leftPad(num.toString(2), 32, '0');
        if (/^(1+0*|0+)$/.test(binMask)) {
            return true;
        }
    }
    return false;
};


ip.leftPad = function(string, size, character) {
    var result = String(string);
    character = character || ' ';
    while (result.length < size) {
        result = character + result;
    }
    return result;
};

export default ip;
