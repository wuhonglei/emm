/**
 * 全局变量文件
 */

export const QUERY_NAME = {
    startDate: '开始日期',
    endDate: '结束日期',
    uuid: '数据来源',
    srcZone: '源区域',
    srcIp: '源IP',
    dstZone: '目的区域',
    dstIp: '目的IP',
    attackType: '类型',
    url: '域名/URL',
    level: '严重等级',
    action: '动作',
    sid: '规则ID',
    status: '回复状态码',
    emailFrom: '发件人邮箱',
    emailTo: '收件人邮箱',
    siteType: '网站类型',
    destinationDomain: '目标域名',
    userName: '用户',
    admin: '管理员',
    holeId: '漏洞ID',
    usrName: '用户',
    grpName: '组',
    privateType: '服务/应用',
    depict: '描述',
    collectorName: '采集器名称/IP',
    pluginName: '采集器类型',
    content: '日志内容',
    collectorType: '采集器类型',
    logContent: '日志类容',
    tmName: '终端类型',
    siteName: '位置',
    control: '访问控制',
    timeOrder: '时间排序',
    webType: '网站分类',
    grpOrUser: '用户/组',
    keywords: '搜索关键字',
    urlKeywords: 'URL关键字',
    postType: '外发方式',
    mailType: '邮件类别',
    emailFrom: '发件地址',
    emailTo: '收件地址',
    prcnt: '共享终端数',
    showChoice: '显示选项',
    ruleType: '规则类型',
    ruleAction: '违规操作',
    proxyTool: '代理工具',
    freeze: '状态',
    priority: '优先级',
    defenseAction: '防御动作',
    rulesNumber: '规则编号',
    protocol: '协议',
    srcPort: '源端口',
    dstPort: '目的端口',

    type: '日志类型',
    sendType: '发送方式',
    filetype: '文件类型',
    communicateTool: '通讯工具',
    attackZone: '攻击者区域',
    attackIp: '攻击者IP',
    attackedZone: '受攻击者区域',
    attackedIp: '受攻击者IP',
    holeType: '漏洞类型',

    evtType: '事件类型'
};

export const COLLECTOR_TYPES = [{
    name: 'Syslog',
    value: 'Syslog'
}, {
    name: 'WMI',
    value: 'WMI'
}, {
    name: '深信服接入',
    value: 'Slog'
}];

//采集器支持列表上传正则文件最大大小
// eslint-disable-next-line no-magic-numbers
export const REG_FILE_MAX_SIZE = 10 * 1024 * 1024;

//应用控制日志服务/应用字段下拉框
export const FIREWALL_APP_NAME = [{
    name: '服务',
    value: 'service'
}, {
    name: '应用',
    value: 'app'
}];

//源IP/用户单选框
export const SRC_IP_GROUP = [{
    name: '所有',
    value: ''
}, {
    name: 'IP',
    value: 'srcIp'
}, {
    name: '用户',
    value: 'usrName'
}, {
    name: '组',
    value: 'grpName'
}];

//采集器比较最近同步时间与当前时间是否大于一天
// eslint-disable-next-line no-magic-numbers
export const DAY = 24 * 60 * 60 * 1000;

//ac日志时间排序
export const TIME_ORDER =  [
    {value: false, name: '倒序'},
    {value: true, name: '正序'}
];

export const DEFAULT_PICKER_OPTIONS = {
    step: '00:15',
    start: '00:00',
    end: '23:59'
};

export const
    MAX_PORT = '65535',
    MIN_PORT = '0';

export const DEF_TOFIXED_LEN = 2;

// 手动取消请求
export const CANCEL_REQUEST_MSG = 'canceled';

// 单点登录正则表达式
export const PROXY_REG = {
    cssp: /proxy\~[0-9A-Za-z]{32}\~[0-9A-Za-z]{1,10}/
};

// 权限加载等待ID
export const PERMISSION_LOADING_WAITTING_ID = 'waitting-for-permission'; 

export const APP_MOUNTED_WAITTING_ID = 'waitting-for-app-mount';

// 用户角色
export const ROLES = {
    SUPPER_ADMIN: 'admin',
    BACK_ADMIN: 'back_admin',
    SYSTEM_ADMIN: 'sys_admin',
    AUDIT_ADMIN: 'audit',
    SECURITY_ADMIN: 'sec_admin'
};

// 严重级别，分为 'info' 信息 'low'	低 'middle'	中 'high' 高  'lost' 致命
export const LEVELLIST = [{
    key: 'info',
    value: '信息'
}, {
    key: 'low',
    value: '低'
}, {
    key: 'middle',
    value: '中'
}, {
    key: 'high',
    value: '高'
}, {
    key: 'lost',
    value: '致命'
}];

// 资产分组信息
export const ASSETGROUP = [{
    id: 'network',
    name: '网络设备'
}, {
    id: 'safety',
    name: '安全设备'
}, {
    id: 'server',
    name: '服务器设备'
}, {
    id: 'other',
    name: '其他'
}];

// 处理状态
export const DEALSTATUS = [{
    key: '0',
    value: '待处理',
    className: 'untreated'
}, {
    key: '1',
    value: '已处理',
    className: 'processed'
}, {
    key: '2',
    value: '已忽略',
    className: 'neglected'
}];

export const INFO_CHART_DEFAULT_COLOR_LIST = [
    '#19889b',
    '#17c1c5',
    '#ffcc00',
    '#ff9900',
    '#ee5555',
    '#ff8383',
    '#9874ec'
];

// 合规要求最小日志保存天数
export const VALID_LOG_PERSERVE_TIME = 180;

export const MAX_LOG_PRESERVE_YEAR = 3;

export const REPORT_TYPE = [{
    key: 'day',
    value: '日报'
}, {
    key: 'week',
    value: '周报'
}, {
    key: 'month',
    value: '月报'
}];

// 事件等级
export const EVENT_LEVEL = {
    '1': {
        label: '低危',
        class: 'operation-low-label'
    },
    '2': {
        label: '中危',
        class: 'operation-mid-label'
    },
    '3': {
        label: '高危',
        class: 'operation-high-label'
    },
    '4': {
        label: '已失陷',
        class: 'operation-lose-label'
    }
};
