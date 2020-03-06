
/**
 * 主要是处理l3vpn 中的批量新增地址
 */

export default {
    methods: {
        getIpAndPort (str) {
            let addrArr = [],
                ipAddrArr = str.split('\n'), // 得到IP地址数组（注意含协议与端口号）
                protocol;
            const AGREEMENTS = ['http://', 'https://'];

            for (let i = 0; i < ipAddrArr.length; i++) {
                let currIpAddr = ipAddrArr[i];
                for (let m = 0; m < AGREEMENTS.length; m++) { // 去掉开头的协议（协议与后面的“:”和"/"不好区分）
                    let agreementIndex = currIpAddr.substr(0, AGREEMENTS[m].length).indexOf(AGREEMENTS[m]);
                    if (agreementIndex >= 0) {
                        currIpAddr = currIpAddr.substr(AGREEMENTS[m].length);
                        protocol = AGREEMENTS[m];
                        break;
                    } else {
                        protocol = '';
                    }
                }
                let ipPort = '',
                    portPrefix; // 判断以什么符号区分端口

                if (currIpAddr.indexOf('/') >= 0) {
                    portPrefix = '/';
                } else if (currIpAddr.indexOf(':') >= 0) {
                    portPrefix = ':';
                }
                if (portPrefix) { // 存在则表示已输入端口，反之无
                    ipPort = currIpAddr.substr(currIpAddr.indexOf(portPrefix) + 1); // 得到端口
                    currIpAddr = currIpAddr.substr(0, currIpAddr.indexOf(portPrefix)); // 得到去除了端口号的IP
                }

                addrArr.push(
                    {
                        port: ipPort ? ipPort.split(',') : [], // 用于获取数据
                        ip: currIpAddr.split('-'), // 得到具体的IP数组
                        address: currIpAddr,
                        protocol: protocol
                    }
                );
            }
            return addrArr;
        },
        validateIP (startIP, endIP) { // 校验起始与结束IP
            let startIPArray = startIP.split('.');
            let endIPArray = endIP.split('.');

            const MAX_IP_NUM = 256; // 最大的IP数
            const TWO_IP = 2; // 第三个IP
            const THREE_IP = 3; // 第四个IP
            const IP_NUM = 4; // IP数量

            if (startIPArray.length < IP_NUM || endIPArray.length < IP_NUM) {
                return false;
            }

            let startIPNum = [],
                endIPNum = [];

            for (let i = 0; i < IP_NUM; i++) {
                startIPNum[i] = parseInt(startIPArray[i].trim(), 10);
                endIPNum[i] = parseInt(endIPArray[i].trim(), 10);
            }

            let startIPNumTotal = startIPNum[0] * MAX_IP_NUM * MAX_IP_NUM * MAX_IP_NUM + 
                startIPNum[1] * MAX_IP_NUM * MAX_IP_NUM + 
                startIPNum[TWO_IP] * MAX_IP_NUM + 
                startIPNum[THREE_IP];
            let endIPNumTotal = endIPNum[0] * MAX_IP_NUM * MAX_IP_NUM * MAX_IP_NUM + 
                endIPNum[1] * MAX_IP_NUM * MAX_IP_NUM + 
                endIPNum[TWO_IP] * MAX_IP_NUM + 
                endIPNum[THREE_IP];

            if (startIPNumTotal < endIPNumTotal) {
                return true;
            } else if (startIPNumTotal === endIPNumTotal) {
                return true;
            }
            return false;
        },
        isReservedIp (ipstr) {
            let tmpArr = ipstr.split('.');
            for (let i = 0, len = tmpArr.length; i < len; i++) {
                tmpArr[i] = tmpArr[i] * 1;
            }
            ipstr = tmpArr.join('.');

            // 0.0.0.0 or 255.255.255.255 or 127.0.0.1
            let scopeReg = /^((0\.0\.0\.0)|(255\.255\.255\.255)|(127\.0\.0\.1))$/;
            if (scopeReg.test(ipstr)) {
                return true;
            }
            let ipReg = /^(22[4-9]|23[0-9])(\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/;
            if (ipReg.test(ipstr)) {
                return true;
            }    
            
            return false;
        },
        isSpecialIp (str) {
            let arr = str.split('.'),
                sip = parseInt(arr[0], 10),
                eip = parseInt(arr[3], 10);

            const LOCAL_ADDR = 127;
            const MAX_IP = 255;
            const SPECIAL_IP = 224;

            if (sip === LOCAL_ADDR || sip === 0 || sip > SPECIAL_IP) {
                return true;
            }
            if (eip === 0 || eip === MAX_IP) {
                return true;
            }	
            return false;
        },
        getIpAndMask (str) {
            let addrArr = [],
                ipAddrArr = str.split('\n'); // 得到IP地址数组

            for (let i = 0; i < ipAddrArr.length; i++) {
                let currIpAddr = ipAddrArr[i];
                let subnetMask = '';

                if (currIpAddr.indexOf('/') >= 0) {
                    subnetMask = currIpAddr.substr(currIpAddr.indexOf('/') + 1); // 得到端口
                    currIpAddr = currIpAddr.substr(0, currIpAddr.indexOf('/')); // 得到去除了端口号的IP
                }

                addrArr.push(
                    {
                        subnetMask: subnetMask, // 获取掩码数据
                        ip: currIpAddr.split('-'), // 得到具体的IP数组
                        address: currIpAddr
                    }
                );
            }
            return addrArr;
        }
    }
};