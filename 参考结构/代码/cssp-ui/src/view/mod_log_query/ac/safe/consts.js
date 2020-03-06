/**
 * 常量
 */

export const COLUMNS = [
    { value: 'attack_type', text: '事件类型', default: true},
    { value: 'usr_name', text: '用户名', default: true },
    { value: 'grp_name', text: '组名', default: false },
    { value: 'src_ip', text: '源IP', default: false },
    { value: 'dst_ip', text: '目标IP', default: false },
    { value: 'src_port', text: '源端口', default: false },
    { value: 'serv_port', text: '目的端口', default: true },
    { value: 'tm_name', text: '终端类型', default: false },
    { 
        value: 'level', 
        text: '严重等级', 
        computed (rowData) {
            let level = rowData.level_eng;
            return {
                color: level === 'HIGH' ? '#FF5760' : (level === 'MIDDLE' ? '#FFB14D' : '#00C97F')
            };
        },
        default: true 
    },
    { value: 'net_action', text: '访问控制', default: true },
    { value: 'virus', text: '病毒名称', default: true },
    { value: 'url', text: 'url地址', default: true },
    { value: 'site_name', text: '位置', default: false },
    { value: 'time', text: '时间', default: true }
];

const SAVE_TYPE_ID = 4;
const SPAM_LINK_TYPE_ID = 8;
const BOTNET_TYPE_ID = 9;
const ARP_TYPE_ID = 10;
const DOS_TYPE_ID = 11;

export const DETAIL_COLUMNS = [
    {
        types: [SAVE_TYPE_ID],
        columns: [
            { value: 'serv_name', text: '应用类型' },
            { value: 'app_name', text: '具体应用' },
            { value: 'MD5', text: 'MD5' }
        ]
    },
    {
        types: [SPAM_LINK_TYPE_ID, BOTNET_TYPE_ID],
        columns: [
            { value: 'category', text: '病毒分类' },
            { value: 'family', text: '病毒小类' },
            { value: 'packet', text: '数据包' },
            { value: 'serv_name', text: '应用类型' },
            { value: 'app_name', text: '具体应用' },
            { value: 'protocol', text: '协议' }
        ]
    },
    {
        types: [ARP_TYPE_ID, DOS_TYPE_ID],
        columns: [
            { value: 'signame', text: '描述' },
            { value: 'sigclass', text: '防御类型' },
            { value: 'sid', text: '规则编号' },
            { value: 'serv_name', text: '应用类型' },
            { value: 'app_name', text: '具体应用' },
            { value: 'protocol', text: '协议' }
        ]
    }
];