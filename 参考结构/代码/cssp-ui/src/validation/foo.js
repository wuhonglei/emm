/**
 * @from copy from @uedc/validations/dist/index.js
 */

/*eslint-disable*//**
 * Created by ued on 2017/1/9.
 */

/**
 * 增加中文字符长度判断，在UTF8中，通常中文字符占三字节，所以一个中文字符长度==3个英文字符长度
 * @param {string} s
 * @return {number} 字符串实际长度
 */
function getUTF8Length(s) {
    var totalLength = 0;
    var i = void 0;
    var charCode = void 0;
    s = String(s);

    var ONE = 1;
    var TWO = 2;
    var THREE = 3;

    var U_7F = 0x007f;
    var U_80 = 0x0080;
    var U_7FF = 0x07ff;
    var U_800 = 0x0800;
    var U_FFFF = 0xffff;

    for (i = 0; i < s.length; i++) {
        charCode = s.charCodeAt(i);
        if (charCode < U_7F) {
            totalLength = totalLength + ONE;
        } else if (U_80 <= charCode && charCode <= U_7FF) {
            totalLength += TWO;
        } else if (U_800 <= charCode && charCode <= U_FFFF) {
            totalLength += THREE;
        }
    }
    return totalLength;
}

var utf8Bytes = {
    getUTF8Length: getUTF8Length
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 
 * 判断输入是否合法，只允许数字或者字符串
 */

function assertType(input) {
    var isString = typeof input === 'string' || input instanceof String;
    var isNumber = typeof input === 'number' || input instanceof Number;

    if (!input || isString || isNumber) {
        return;
    }

    var invalidType = void 0;
    invalidType = typeof input === 'undefined' ? 'undefined' : _typeof(input);
    if (invalidType === 'object' && input.constructor && input.constructor.hasOwnProperty('name')) {
        invalidType = input.constructor.name;
    } else {
        invalidType = 'a ' + invalidType;
    }
    throw new TypeError('Expected string or number but received ' + invalidType + '.');
}

/**
 * 校验字符串长度
 */

var defaultOptions = {
    min: 1,
    max: 1024,
    utf8Bytes: false
};

/**
 * 校验字符串是否符合长度
 * 
 * @param {string} v
 * @param {object} config
 * @param {number} config.min - 最小长度 default: 1
 * @param {number} config.max - 最大长度 default: 1024
 * @param {boolean} config.utf8Bytes - 是否以utf9字节计算长度（一个中文三个长度） default: false
 * @returns {boolean}
 */
function stringLength(v) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    assertType(v);
    var conf = Object.assign({}, defaultOptions, config);
    if (!v || !v.length) {
        return false;
    }

    var length = conf.utf8Bytes ? utf8Bytes.getUTF8Length(v) : v.length;
    if (conf.min && length < parseInt(conf.min, 10) || conf.max && length > parseInt(conf.max, 10)) {
        return false;
    }
    return true;
}

/**
 * 全局变量文件
 */

// 小写字母正则
var REG_LOWER = /[a-z]+/;

// 大写字母正则
var PRG_UPPER = /[A-Z]+/;

// 数字正则
var REG_NUMBER = /[0-9]+/;

// 特殊字符正则
var REG_SPECIAL = /[`~@#%&<>"',;_\-\^\$\.\*\+\?\=\!\:\|\{\}\(\)\[\]\/\\]+/;

// 非法字符正则
var REG_ILLEGAL = /[^a-zA-Z0-9~\~`@#%&<>"',;_\-\^\$\.\*\+\?\=\!\:\|\{\}\(\)\[\]\/\\]+/;

/**
 * 校验是否符合密码
 */

var defaultOptions$1 = {
    kindLimit: 2,
    blank: true,
    specialReg: null,
    illegalReg: null
};

/**
 * 校验字符串是否符合密码的规则，即字符的种类是否满足要求
 * 只校验种类，不校验长度
 * 种类：大写字母，小写字母，数字，特殊字符
 * 
 * @param {string} v 
 * @param {object} config 
 * @param {number} config.kindLimit - 需要多少种字符类型 default: 2
 * @param {boolean} config.blank - 是否允许空格 default: true
 * @param {regexp} config.specialReg - 自定义特殊字符正则
 * @param {regexp} config.illegalReg - 自定义非法字符正则
 * @returns {boolean}
 */
function kinds(v) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    assertType(v);
    var conf = Object.assign({}, defaultOptions$1, config);

    // 检验是否允许空格
    if (!conf.blank && v.indexOf(' ') > -1) {
        return false;
    }

    // 校验是否包含特殊字符
    if (conf.illegalReg && conf.illegalReg.test(v)) {
        return false;
    } else if (REG_ILLEGAL.test(v)) {
        return false;
    }

    // 校验密码包含符号种类
    var kinds = 0;
    kinds += REG_LOWER.test(v) ? 1 : 0;
    kinds += PRG_UPPER.test(v) ? 1 : 0;
    kinds += REG_NUMBER.test(v) ? 1 : 0;
    kinds += conf.specialReg ? conf.specialReg.test(v) ? 1 : 0 : REG_SPECIAL.test(v) ? 1 : 0;

    return kinds >= conf.kindLimit;
}

const word = '[a-fA-F\\d:]';
const b = options => options && options.includeBoundaries ?
	`(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` :
	'';

const v4 = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';

const v6seg = '[a-fA-F\\d]{1,4}';
const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

const ip = options => options && options.exact ?
	new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
	new RegExp(`(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(options)})`, 'g');

ip.v4 = options => options && options.exact ? new RegExp(`^${v4}$`) : new RegExp(`${b(options)}${v4}${b(options)}`, 'g');
ip.v6 = options => options && options.exact ? new RegExp(`^${v6}$`) : new RegExp(`${b(options)}${v6}${b(options)}`, 'g');

var ipRegex = ip;

/**
 * 检验是否是IP
 */

var defaultOptions$2 = {
    ipv6: true,
    ipv4: true
};

/**
 * 校验是不是一个IP
 * 
 * @param {string} v 
 * @param {object} config 
 * @param {boolean} config.ipv6 是否校验ipv6
 * @returns {boolean}
 */
function ip$1(v) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    assertType(v);
    var conf = Object.assign({}, defaultOptions$2, config);
    var v4Rs = ipRegex.v4({ exact: true }).test(v);
    var v6Rs = ipRegex.v6({ exact: true }).test(v);

    // 仅有ipv4的情况
    if (conf.ipv4 && !conf.ipv6) {
        return v4Rs;
    }

    // 仅有ipv6的情况
    if (conf.ipv6 && !conf.ipv4) {
        return v6Rs;
    }

    // 配置ipv6 以及 ipv4
    if (conf.ipv4 && conf.ipv6) {
        return v4Rs || v6Rs;
    }

    // ipv6 和 ipv4都没有配置
    return false;
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var ipRegex$1 = createCommonjsModule(function (module) {

const v4 = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';

const v6seg = '[0-9a-fA-F]{1,4}';
const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

const ip = module.exports = opts => opts && opts.exact ?
	new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
	new RegExp(`(?:${v4})|(?:${v6})`, 'g');

ip.v4 = opts => opts && opts.exact ? new RegExp(`^${v4}$`) : new RegExp(v4, 'g');
ip.v6 = opts => opts && opts.exact ? new RegExp(`^${v6}$`) : new RegExp(v6, 'g');
});

var cidrRegex = createCommonjsModule(function (module) {



const v4 = ipRegex$1.v4().source + "\\/(3[0-2]|[12]?[0-9])";
const v6 = ipRegex$1.v6().source + "\\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])";

const cidr = module.exports = opts => opts && opts.exact ?
  new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
  new RegExp(`(?:${v4})|(?:${v6})`, "g");

cidr.v4 = opts => opts && opts.exact ? new RegExp(`^${v4}$`) : new RegExp(v4, "g");
cidr.v6 = opts => opts && opts.exact ? new RegExp(`^${v6}$`) : new RegExp(v6, "g");
});

var isCidr_1 = createCommonjsModule(function (module) {

const re4 = cidrRegex.v4({exact: true});
const re6 = cidrRegex.v6({exact: true});

const isCidr = module.exports = str => {
  if (re4.test(str)) return 4;
  if (re6.test(str)) return 6;
  return 0;
};

isCidr.v4 = str => re4.test(str);
isCidr.v6 = str => re6.test(str);
});

var ipaddr = createCommonjsModule(function (module) {
(function() {
  var expandIPv6, ipaddr, ipv4Part, ipv4Regexes, ipv6Part, ipv6Regexes, matchCIDR, root, zoneIndex;

  ipaddr = {};

  root = this;

  if ((module !== null) && module.exports) {
    module.exports = ipaddr;
  } else {
    root['ipaddr'] = ipaddr;
  }

  matchCIDR = function(first, second, partSize, cidrBits) {
    var part, shift;
    if (first.length !== second.length) {
      throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
    }
    part = 0;
    while (cidrBits > 0) {
      shift = partSize - cidrBits;
      if (shift < 0) {
        shift = 0;
      }
      if (first[part] >> shift !== second[part] >> shift) {
        return false;
      }
      cidrBits -= partSize;
      part += 1;
    }
    return true;
  };

  ipaddr.subnetMatch = function(address, rangeList, defaultName) {
    var k, len, rangeName, rangeSubnets, subnet;
    if (defaultName == null) {
      defaultName = 'unicast';
    }
    for (rangeName in rangeList) {
      rangeSubnets = rangeList[rangeName];
      if (rangeSubnets[0] && !(rangeSubnets[0] instanceof Array)) {
        rangeSubnets = [rangeSubnets];
      }
      for (k = 0, len = rangeSubnets.length; k < len; k++) {
        subnet = rangeSubnets[k];
        if (address.kind() === subnet[0].kind()) {
          if (address.match.apply(address, subnet)) {
            return rangeName;
          }
        }
      }
    }
    return defaultName;
  };

  ipaddr.IPv4 = (function() {
    function IPv4(octets) {
      var k, len, octet;
      if (octets.length !== 4) {
        throw new Error("ipaddr: ipv4 octet count should be 4");
      }
      for (k = 0, len = octets.length; k < len; k++) {
        octet = octets[k];
        if (!((0 <= octet && octet <= 255))) {
          throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
        }
      }
      this.octets = octets;
    }

    IPv4.prototype.kind = function() {
      return 'ipv4';
    };

    IPv4.prototype.toString = function() {
      return this.octets.join(".");
    };

    IPv4.prototype.toNormalizedString = function() {
      return this.toString();
    };

    IPv4.prototype.toByteArray = function() {
      return this.octets.slice(0);
    };

    IPv4.prototype.match = function(other, cidrRange) {
      var ref;
      if (cidrRange === void 0) {
        ref = other, other = ref[0], cidrRange = ref[1];
      }
      if (other.kind() !== 'ipv4') {
        throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
      }
      return matchCIDR(this.octets, other.octets, 8, cidrRange);
    };

    IPv4.prototype.SpecialRanges = {
      unspecified: [[new IPv4([0, 0, 0, 0]), 8]],
      broadcast: [[new IPv4([255, 255, 255, 255]), 32]],
      multicast: [[new IPv4([224, 0, 0, 0]), 4]],
      linkLocal: [[new IPv4([169, 254, 0, 0]), 16]],
      loopback: [[new IPv4([127, 0, 0, 0]), 8]],
      carrierGradeNat: [[new IPv4([100, 64, 0, 0]), 10]],
      "private": [[new IPv4([10, 0, 0, 0]), 8], [new IPv4([172, 16, 0, 0]), 12], [new IPv4([192, 168, 0, 0]), 16]],
      reserved: [[new IPv4([192, 0, 0, 0]), 24], [new IPv4([192, 0, 2, 0]), 24], [new IPv4([192, 88, 99, 0]), 24], [new IPv4([198, 51, 100, 0]), 24], [new IPv4([203, 0, 113, 0]), 24], [new IPv4([240, 0, 0, 0]), 4]]
    };

    IPv4.prototype.range = function() {
      return ipaddr.subnetMatch(this, this.SpecialRanges);
    };

    IPv4.prototype.toIPv4MappedAddress = function() {
      return ipaddr.IPv6.parse("::ffff:" + (this.toString()));
    };

    IPv4.prototype.prefixLengthFromSubnetMask = function() {
      var cidr, i, k, octet, stop, zeros, zerotable;
      zerotable = {
        0: 8,
        128: 7,
        192: 6,
        224: 5,
        240: 4,
        248: 3,
        252: 2,
        254: 1,
        255: 0
      };
      cidr = 0;
      stop = false;
      for (i = k = 3; k >= 0; i = k += -1) {
        octet = this.octets[i];
        if (octet in zerotable) {
          zeros = zerotable[octet];
          if (stop && zeros !== 0) {
            return null;
          }
          if (zeros !== 8) {
            stop = true;
          }
          cidr += zeros;
        } else {
          return null;
        }
      }
      return 32 - cidr;
    };

    return IPv4;

  })();

  ipv4Part = "(0?\\d+|0x[a-f0-9]+)";

  ipv4Regexes = {
    fourOctet: new RegExp("^" + ipv4Part + "\\." + ipv4Part + "\\." + ipv4Part + "\\." + ipv4Part + "$", 'i'),
    longValue: new RegExp("^" + ipv4Part + "$", 'i')
  };

  ipaddr.IPv4.parser = function(string) {
    var match, parseIntAuto, part, shift, value;
    parseIntAuto = function(string) {
      if (string[0] === "0" && string[1] !== "x") {
        return parseInt(string, 8);
      } else {
        return parseInt(string);
      }
    };
    if (match = string.match(ipv4Regexes.fourOctet)) {
      return (function() {
        var k, len, ref, results;
        ref = match.slice(1, 6);
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          part = ref[k];
          results.push(parseIntAuto(part));
        }
        return results;
      })();
    } else if (match = string.match(ipv4Regexes.longValue)) {
      value = parseIntAuto(match[1]);
      if (value > 0xffffffff || value < 0) {
        throw new Error("ipaddr: address outside defined range");
      }
      return ((function() {
        var k, results;
        results = [];
        for (shift = k = 0; k <= 24; shift = k += 8) {
          results.push((value >> shift) & 0xff);
        }
        return results;
      })()).reverse();
    } else {
      return null;
    }
  };

  ipaddr.IPv6 = (function() {
    function IPv6(parts, zoneId) {
      var i, k, l, len, part, ref;
      if (parts.length === 16) {
        this.parts = [];
        for (i = k = 0; k <= 14; i = k += 2) {
          this.parts.push((parts[i] << 8) | parts[i + 1]);
        }
      } else if (parts.length === 8) {
        this.parts = parts;
      } else {
        throw new Error("ipaddr: ipv6 part count should be 8 or 16");
      }
      ref = this.parts;
      for (l = 0, len = ref.length; l < len; l++) {
        part = ref[l];
        if (!((0 <= part && part <= 0xffff))) {
          throw new Error("ipaddr: ipv6 part should fit in 16 bits");
        }
      }
      if (zoneId) {
        this.zoneId = zoneId;
      }
    }

    IPv6.prototype.kind = function() {
      return 'ipv6';
    };

    IPv6.prototype.toString = function() {
      return this.toNormalizedString().replace(/((^|:)(0(:|$))+)/, '::');
    };

    IPv6.prototype.toRFC5952String = function() {
      var bestMatchIndex, bestMatchLength, match, regex, string;
      regex = /((^|:)(0(:|$)){2,})/g;
      string = this.toNormalizedString();
      bestMatchIndex = 0;
      bestMatchLength = -1;
      while ((match = regex.exec(string))) {
        if (match[0].length > bestMatchLength) {
          bestMatchIndex = match.index;
          bestMatchLength = match[0].length;
        }
      }
      if (bestMatchLength < 0) {
        return string;
      }
      return string.substring(0, bestMatchIndex) + '::' + string.substring(bestMatchIndex + bestMatchLength);
    };

    IPv6.prototype.toByteArray = function() {
      var bytes, k, len, part, ref;
      bytes = [];
      ref = this.parts;
      for (k = 0, len = ref.length; k < len; k++) {
        part = ref[k];
        bytes.push(part >> 8);
        bytes.push(part & 0xff);
      }
      return bytes;
    };

    IPv6.prototype.toNormalizedString = function() {
      var addr, part, suffix;
      addr = ((function() {
        var k, len, ref, results;
        ref = this.parts;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          part = ref[k];
          results.push(part.toString(16));
        }
        return results;
      }).call(this)).join(":");
      suffix = '';
      if (this.zoneId) {
        suffix = '%' + this.zoneId;
      }
      return addr + suffix;
    };

    IPv6.prototype.toFixedLengthString = function() {
      var addr, part, suffix;
      addr = ((function() {
        var k, len, ref, results;
        ref = this.parts;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          part = ref[k];
          results.push(part.toString(16).padStart(4, '0'));
        }
        return results;
      }).call(this)).join(":");
      suffix = '';
      if (this.zoneId) {
        suffix = '%' + this.zoneId;
      }
      return addr + suffix;
    };

    IPv6.prototype.match = function(other, cidrRange) {
      var ref;
      if (cidrRange === void 0) {
        ref = other, other = ref[0], cidrRange = ref[1];
      }
      if (other.kind() !== 'ipv6') {
        throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
      }
      return matchCIDR(this.parts, other.parts, 16, cidrRange);
    };

    IPv6.prototype.SpecialRanges = {
      unspecified: [new IPv6([0, 0, 0, 0, 0, 0, 0, 0]), 128],
      linkLocal: [new IPv6([0xfe80, 0, 0, 0, 0, 0, 0, 0]), 10],
      multicast: [new IPv6([0xff00, 0, 0, 0, 0, 0, 0, 0]), 8],
      loopback: [new IPv6([0, 0, 0, 0, 0, 0, 0, 1]), 128],
      uniqueLocal: [new IPv6([0xfc00, 0, 0, 0, 0, 0, 0, 0]), 7],
      ipv4Mapped: [new IPv6([0, 0, 0, 0, 0, 0xffff, 0, 0]), 96],
      rfc6145: [new IPv6([0, 0, 0, 0, 0xffff, 0, 0, 0]), 96],
      rfc6052: [new IPv6([0x64, 0xff9b, 0, 0, 0, 0, 0, 0]), 96],
      '6to4': [new IPv6([0x2002, 0, 0, 0, 0, 0, 0, 0]), 16],
      teredo: [new IPv6([0x2001, 0, 0, 0, 0, 0, 0, 0]), 32],
      reserved: [[new IPv6([0x2001, 0xdb8, 0, 0, 0, 0, 0, 0]), 32]]
    };

    IPv6.prototype.range = function() {
      return ipaddr.subnetMatch(this, this.SpecialRanges);
    };

    IPv6.prototype.isIPv4MappedAddress = function() {
      return this.range() === 'ipv4Mapped';
    };

    IPv6.prototype.toIPv4Address = function() {
      var high, low, ref;
      if (!this.isIPv4MappedAddress()) {
        throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
      }
      ref = this.parts.slice(-2), high = ref[0], low = ref[1];
      return new ipaddr.IPv4([high >> 8, high & 0xff, low >> 8, low & 0xff]);
    };

    IPv6.prototype.prefixLengthFromSubnetMask = function() {
      var cidr, i, k, part, stop, zeros, zerotable;
      zerotable = {
        0: 16,
        32768: 15,
        49152: 14,
        57344: 13,
        61440: 12,
        63488: 11,
        64512: 10,
        65024: 9,
        65280: 8,
        65408: 7,
        65472: 6,
        65504: 5,
        65520: 4,
        65528: 3,
        65532: 2,
        65534: 1,
        65535: 0
      };
      cidr = 0;
      stop = false;
      for (i = k = 7; k >= 0; i = k += -1) {
        part = this.parts[i];
        if (part in zerotable) {
          zeros = zerotable[part];
          if (stop && zeros !== 0) {
            return null;
          }
          if (zeros !== 16) {
            stop = true;
          }
          cidr += zeros;
        } else {
          return null;
        }
      }
      return 128 - cidr;
    };

    return IPv6;

  })();

  ipv6Part = "(?:[0-9a-f]+::?)+";

  zoneIndex = "%[0-9a-z]{1,}";

  ipv6Regexes = {
    zoneIndex: new RegExp(zoneIndex, 'i'),
    "native": new RegExp("^(::)?(" + ipv6Part + ")?([0-9a-f]+)?(::)?(" + zoneIndex + ")?$", 'i'),
    transitional: new RegExp(("^((?:" + ipv6Part + ")|(?:::)(?:" + ipv6Part + ")?)") + (ipv4Part + "\\." + ipv4Part + "\\." + ipv4Part + "\\." + ipv4Part) + ("(" + zoneIndex + ")?$"), 'i')
  };

  expandIPv6 = function(string, parts) {
    var colonCount, lastColon, part, replacement, replacementCount, zoneId;
    if (string.indexOf('::') !== string.lastIndexOf('::')) {
      return null;
    }
    zoneId = (string.match(ipv6Regexes['zoneIndex']) || [])[0];
    if (zoneId) {
      zoneId = zoneId.substring(1);
      string = string.replace(/%.+$/, '');
    }
    colonCount = 0;
    lastColon = -1;
    while ((lastColon = string.indexOf(':', lastColon + 1)) >= 0) {
      colonCount++;
    }
    if (string.substr(0, 2) === '::') {
      colonCount--;
    }
    if (string.substr(-2, 2) === '::') {
      colonCount--;
    }
    if (colonCount > parts) {
      return null;
    }
    replacementCount = parts - colonCount;
    replacement = ':';
    while (replacementCount--) {
      replacement += '0:';
    }
    string = string.replace('::', replacement);
    if (string[0] === ':') {
      string = string.slice(1);
    }
    if (string[string.length - 1] === ':') {
      string = string.slice(0, -1);
    }
    parts = (function() {
      var k, len, ref, results;
      ref = string.split(":");
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        part = ref[k];
        results.push(parseInt(part, 16));
      }
      return results;
    })();
    return {
      parts: parts,
      zoneId: zoneId
    };
  };

  ipaddr.IPv6.parser = function(string) {
    var addr, k, len, match, octet, octets, zoneId;
    if (ipv6Regexes['native'].test(string)) {
      return expandIPv6(string, 8);
    } else if (match = string.match(ipv6Regexes['transitional'])) {
      zoneId = match[6] || '';
      addr = expandIPv6(match[1].slice(0, -1) + zoneId, 6);
      if (addr.parts) {
        octets = [parseInt(match[2]), parseInt(match[3]), parseInt(match[4]), parseInt(match[5])];
        for (k = 0, len = octets.length; k < len; k++) {
          octet = octets[k];
          if (!((0 <= octet && octet <= 255))) {
            return null;
          }
        }
        addr.parts.push(octets[0] << 8 | octets[1]);
        addr.parts.push(octets[2] << 8 | octets[3]);
        return {
          parts: addr.parts,
          zoneId: addr.zoneId
        };
      }
    }
    return null;
  };

  ipaddr.IPv4.isIPv4 = ipaddr.IPv6.isIPv6 = function(string) {
    return this.parser(string) !== null;
  };

  ipaddr.IPv4.isValid = function(string) {
    try {
      new this(this.parser(string));
      return true;
    } catch (error1) {
      return false;
    }
  };

  ipaddr.IPv4.isValidFourPartDecimal = function(string) {
    if (ipaddr.IPv4.isValid(string) && string.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/)) {
      return true;
    } else {
      return false;
    }
  };

  ipaddr.IPv6.isValid = function(string) {
    var addr;
    if (typeof string === "string" && string.indexOf(":") === -1) {
      return false;
    }
    try {
      addr = this.parser(string);
      new this(addr.parts, addr.zoneId);
      return true;
    } catch (error1) {
      return false;
    }
  };

  ipaddr.IPv4.parse = function(string) {
    var parts;
    parts = this.parser(string);
    if (parts === null) {
      throw new Error("ipaddr: string is not formatted like ip address");
    }
    return new this(parts);
  };

  ipaddr.IPv6.parse = function(string) {
    var addr;
    addr = this.parser(string);
    if (addr.parts === null) {
      throw new Error("ipaddr: string is not formatted like ip address");
    }
    return new this(addr.parts, addr.zoneId);
  };

  ipaddr.IPv4.parseCIDR = function(string) {
    var maskLength, match, parsed;
    if (match = string.match(/^(.+)\/(\d+)$/)) {
      maskLength = parseInt(match[2]);
      if (maskLength >= 0 && maskLength <= 32) {
        parsed = [this.parse(match[1]), maskLength];
        Object.defineProperty(parsed, 'toString', {
          value: function() {
            return this.join('/');
          }
        });
        return parsed;
      }
    }
    throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
  };

  ipaddr.IPv4.subnetMaskFromPrefixLength = function(prefix) {
    var filledOctetCount, j, octets;
    prefix = parseInt(prefix);
    if (prefix < 0 || prefix > 32) {
      throw new Error('ipaddr: invalid IPv4 prefix length');
    }
    octets = [0, 0, 0, 0];
    j = 0;
    filledOctetCount = Math.floor(prefix / 8);
    while (j < filledOctetCount) {
      octets[j] = 255;
      j++;
    }
    if (filledOctetCount < 4) {
      octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - (prefix % 8);
    }
    return new this(octets);
  };

  ipaddr.IPv4.broadcastAddressFromCIDR = function(string) {
    var cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
    try {
      cidr = this.parseCIDR(string);
      ipInterfaceOctets = cidr[0].toByteArray();
      subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
      octets = [];
      i = 0;
      while (i < 4) {
        octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
        i++;
      }
      return new this(octets);
    } catch (error1) {
      throw new Error('ipaddr: the address does not have IPv4 CIDR format');
    }
  };

  ipaddr.IPv4.networkAddressFromCIDR = function(string) {
    var cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
    try {
      cidr = this.parseCIDR(string);
      ipInterfaceOctets = cidr[0].toByteArray();
      subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
      octets = [];
      i = 0;
      while (i < 4) {
        octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
        i++;
      }
      return new this(octets);
    } catch (error1) {
      throw new Error('ipaddr: the address does not have IPv4 CIDR format');
    }
  };

  ipaddr.IPv6.parseCIDR = function(string) {
    var maskLength, match, parsed;
    if (match = string.match(/^(.+)\/(\d+)$/)) {
      maskLength = parseInt(match[2]);
      if (maskLength >= 0 && maskLength <= 128) {
        parsed = [this.parse(match[1]), maskLength];
        Object.defineProperty(parsed, 'toString', {
          value: function() {
            return this.join('/');
          }
        });
        return parsed;
      }
    }
    throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
  };

  ipaddr.isValid = function(string) {
    return ipaddr.IPv6.isValid(string) || ipaddr.IPv4.isValid(string);
  };

  ipaddr.parse = function(string) {
    if (ipaddr.IPv6.isValid(string)) {
      return ipaddr.IPv6.parse(string);
    } else if (ipaddr.IPv4.isValid(string)) {
      return ipaddr.IPv4.parse(string);
    } else {
      throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
    }
  };

  ipaddr.parseCIDR = function(string) {
    try {
      return ipaddr.IPv6.parseCIDR(string);
    } catch (error1) {
      try {
        return ipaddr.IPv4.parseCIDR(string);
      } catch (error1) {
        throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format");
      }
    }
  };

  ipaddr.fromByteArray = function(bytes) {
    var length;
    length = bytes.length;
    if (length === 4) {
      return new ipaddr.IPv4(bytes);
    } else if (length === 16) {
      return new ipaddr.IPv6(bytes);
    } else {
      throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
    }
  };

  ipaddr.process = function(string) {
    var addr;
    addr = this.parse(string);
    if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
      return addr.toIPv4Address();
    } else {
      return addr;
    }
  };

}).call(commonjsGlobal);
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var defaultOptions$3 = {
    ipv6: true,
    ipv4: true,
    cidr: true, // 192.168.1.0/24
    mask: true, // 192.168.1.0/255.255.252.0
    range: true,
    noCompare: false,
    rangeEqual: true
};

/**
 * 校验 是不是一个IP范围
 * 
 * @param {string} v 校验是不是ip
 * @param {object} config 
 * @param {boolean} config.ipv6 是否校验IPv6
 * @param {boolean} config.cidr 是否校验掩码格式（ip/24)
 * @param {boolean} config.mask 是否校验掩码格式（ip/255.255.255.0）
 * @param {boolean} config.range 是否校验IP范围搁置 (ip1-ip2)
 * @param {boolean} config.noCompare 是否校验前后的IP范围
 * @param {boolean} config.rangeEqual 是否校验IP范围搁置，是否允许范围IP相等
 * @returns {boolean}
 */
function ipRange(v) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    assertType(v);

    var conf = Object.assign({}, defaultOptions$3, config);
    var ipConf = {
        ipv6: conf.ipv6,
        ipv4: conf.ipv4
    };

    // range 校验
    if (v.indexOf('-') > -1) {
        var VALID_IP_NUM = 2;

        // 包含 - 但没有配置
        if (!conf.range) {
            return false;
        }

        var rs = v.split('-');
        if (rs.length !== VALID_IP_NUM) {
            return false;
        }

        var _rs = _slicedToArray(rs, 2),
            first = _rs[0],
            last = _rs[1];

        var firstValid = ip$1(first, ipConf);
        var lastValid = ip$1(last, ipConf);

        // 前后ip任意一个没有校验通过，校验失败
        if (!firstValid || !lastValid) {
            return false;
        }

        // 不需要校验前后范围
        if (conf.noCompare) {
            return true;
        }

        var diff = compareIp(first, last);

        if (diff === false) {
            return false;
        }
        return conf.rangeEqual ? diff >= 0 : diff > 0;
    }

    // mask cidr 校验
    if (v.indexOf('/') > -1) {

        // 检测出掩码格式但未配置
        if (!conf.mask && !conf.cidr) {
            return false;
        }

        var splitArr = v.split('/');

        // 判断分割后的长度是否为2
        if (!isOneSymbol(v, '/')) {
            return false;
        }

        var _splitArr = _slicedToArray(splitArr, 2),
            ipAddr = _splitArr[0],
            mask = _splitArr[1];

        // 单纯校验ip部分是否合法


        if (!ip$1(ipAddr, ipConf)) {
            return false;
        }

        var cidrRs = isCidr_1(v);
        var maskRs = ip$1(mask, { ipv6: false });

        if (maskRs && conf.mask) {
            return true;
        }
        if (cidrRs !== 0 && conf.cidr) {
            return true;
        }
        return false;
    }
    return ip$1(v, ipConf);
}

/**
 * 判断字符串中是否存在单个符号
 *
 * @param {string} str 需要判断的字符串
 * @returns {boolean}
 */
function isOneSymbol(str) {
    var reg = new RegExp('\\/', 'g');
    var rs = String(str).match(reg);
    return rs && rs.length === 1;
}

/**
 * 比较两个ip的大小
 * 1： left > right
 * -1： left < right
 * 0: ip 相等
 * false : ip 转化失败，或者无法比较，或者ipv4 ipv6混合比较
 *
 * @param {string} left ip 
 * @param {string} right ip
 * @returns {boolean|number} 比较结果
 */
function compareIp(left, right) {
    var leftArray = void 0;
    var rightArray = void 0;
    try {
        leftArray = spIp(left) ? parseSpV6(left) : ipaddr.parse(left).toByteArray();
        rightArray = spIp(right) ? parseSpV6(right) : ipaddr.parse(right).toByteArray();
    } catch (err) {
        return false;
    }

    // byte array 数组不相等说明是 ipv4 ipv6 混用
    if (!leftArray || !rightArray || leftArray.length !== rightArray.length) {
        return false;
    }

    // IP相等
    if (leftArray.toString() === rightArray.toString()) {
        return 0;
    }

    // 从起始位开始比较
    for (var i = 0, len = leftArray.length; i < len; i++) {
        if (leftArray[i] > rightArray[i]) {
            return -1;
        }
        if (leftArray[i] < rightArray[i]) {
            return 1;
        }
    }
}

/**
 * 判断是否是::1.1.1.1 特殊ip
 * 
 * @param {string} ip ip 
 * @returns {boolean} 是否是特殊ip
 */
function spIp(ip) {
    var exactV6 = ipRegex.v6({ exact: true }).test(ip);
    var exactV4 = ipRegex.v4({ exact: true }).test(ip);
    var v4 = ipRegex.v4().test(ip);

    if (exactV6 && !exactV4 && v4) {
        return true;
    }
    return false;
}

/**
 * 解析特殊的V6格式（混合IPV4的特殊IPV6格式）
 *
 * @param {string} ip ipv6
 * @returns {array} 16位IP数组
 */
function parseSpV6(ip) {
    var IPV4_ARR_LEN = 4;
    var temp = ip;
    var v4Part = temp.match(ipRegex.v4());
    v4Part = Array.isArray(v4Part) ? v4Part[0] : v4Part;
    var v6Part = temp.replace(v4Part, '');

    // ::aaaa:1.1.1.1 这种情况截断之后，ipv6的最后一段要补0
    if (!/::$/.test(v6Part)) {
        v6Part += '0';
    }

    var arr1 = ipaddr.parse(v4Part).toByteArray();
    var arr2 = ipaddr.parse(v6Part).toByteArray();
    arr2.splice(-IPV4_ARR_LEN);
    return arr2.concat(arr1);
}

/**
 * 校验字符串是否是数字
 */

var defaultOptions$4 = {
    min: null,
    max: null,
    includBoundary: false,
    interger: true,
    strict: true
};

/**
 * 判断输入的字符串是否是数组
 * 
 * @param {string} v 判断输入字符串是否为数组
 * @param {object} config 配置
 * @param {number} config.min 最大值
 * @param {number} config.max 最小值
 * @param {boolean} config.includBoundary 最大最小值是否包含边界值
 * @param {boolean} config.max 是要要求整数
 * @param {boolean} config.strict 严格模式，当 输入 0123 123. 123.0 这种会报错
 * @returns {boolean}
 */
function num(v) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    assertType(v);
    var conf = Object.assign({}, defaultOptions$4, config);

    var num = Number(v);

    if (isNaN(num)) {
        return false;
    }

    if (conf.min !== null && num <= conf.min) {

        // 处理边界值
        if (!conf.includBoundary || conf.min !== num) {
            return false;
        }
    }

    if (conf.max !== null && num >= conf.max) {

        // 处理边界值
        if (!conf.includBoundary || conf.max !== num) {
            return false;
        }
    }

    if (conf.interger && num !== parseInt(num, 10)) {
        return false;
    }

    // 严格模式，0123 123.0 123. 123.1110这些都不是
    if (conf.strict && num.toString() !== v) {
        return false;
    }
    return true;
}

/**
 * 入口主文件
 */

export { stringLength, kinds, ip$1 as ip, ipRange, num };
