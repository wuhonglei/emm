/**
 * @file 上网安全配置
 */

export default function netsafe (type) {
    const COLUMNS = [
        { key: 'attack_type', name: '事件类型', default: true},
        { key: 'usr_name', name: '用户名', default: true },
        { key: 'grp_name', name: '组名', default: false },
        { key: 'src_ip', name: '源IP', default: false },
        { key: 'dst_ip', name: '目标IP', default: false },
        { key: 'src_port', name: '源端口', default: false },
        { key: 'serv_port', name: '目的端口', default: true },
        { key: 'tm_name', name: '终端类型', default: false },
        { 
            key: 'level', 
            name: '严重等级', 
            computed (rowData) {
                let level = rowData.level_eng;
                return {
                    color: level === 'HIGH' ? '#FF5760' : (level === 'MIDDLE' ? '#FFB14D' : '#00C97F')
                };
            },
            default: true 
        },
        { key: 'net_action', name: '访问控制', default: true },
        { key: 'virus', name: '病毒名称', default: true },
        { key: 'url', name: 'url地址', default: true },
        { key: 'site_name', name: '位置', default: false },
        { key: 'time', name: '时间', default: true }
    ];
    
    const SAVE_TYPE_ID = 4;
    const SPAM_LINK_TYPE_ID = 8;
    const BOTNET_TYPE_ID = 9;
    const ARP_TYPE_ID = 10;
    const DOS_TYPE_ID = 11;

    const DETAIL_COLUMNS = [
        {
            types: [SAVE_TYPE_ID],
            columns: [
                { key: 'serv_name', name: '应用类型' },
                { key: 'app_name', name: '具体应用' },
                { key: 'MD5', name: 'MD5' }
            ]
        },
        {
            types: [SPAM_LINK_TYPE_ID, BOTNET_TYPE_ID],
            columns: [
                { key: 'category', name: '病毒分类' },
                { key: 'family', name: '病毒小类' },
                { key: 'packet', name: '数据包' },
                { key: 'serv_name', name: '应用类型' },
                { key: 'app_name', name: '具体应用' },
                { key: 'protocol', name: '协议' }
            ]
        },
        {
            types: [ARP_TYPE_ID, DOS_TYPE_ID],
            columns: [
                { key: 'signame', name: '描述' },
                { key: 'sigclass', name: '防御类型' },
                { key: 'sid', name: '规则编号' },
                { key: 'serv_name', name: '应用类型' },
                { key: 'app_name', name: '具体应用' },
                { key: 'protocol', name: '协议' }
            ]
        }
    ];

    let res = [].slice.call(COLUMNS);
            
    let detailColumns = DETAIL_COLUMNS.find(
        group => group.types.findIndex(t => t.toString() === type) > -1
    );

    if (detailColumns) {
        res.push(...detailColumns.columns);
    }

    return res;
}