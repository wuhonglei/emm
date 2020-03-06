/**
 * edr 联动日志
 */

export const TABLE_COLUMNS = [
    { value: 'time', text: _('联动时间'), 'min-width': '200px', default: true },
    { value: 'src_ip', text: _('联动设备IP'), 'min-width': '150px', default: true },
    { value: 'op_src', text: _('设备类型'), default: true },
    { value: 'host_name', text: _('联动终端'), 'min-width': '250px', default: true },
    { value: 'module_opr', text: _('联动类型'), 'min-width': '200px', default: true },
    { value: 'desc', text: _('联动描述'), 'min-width': '300px', default: true }
];

export const QUERY_NAME = {
    opSrc: _('联动设备'),
    module: _('联动类型'),
    srcIp: _('IP地址'),
    hostName: _('终端名称')
};

export const LINK_DEV = [
    { value: '', name: _('全部平台') },
    { value: 'AF', name: _('下一代防火墙（AF）') },
    { value: 'SIP', name: _('安全感知平台（SIP）') },
    { value: 'AC', name: _('上网行为管理（AC）') },
    { value: 'X-central', name: _('深信服云图（X-Central）') },
    { value: 'SOC', name: _('安全运营中心（SOC）') }
];

export const LINK_TYPES = [
    { value: '', name: _('全部类型') },
    { value: 'virus', name: _('联动查杀') },
    { value: 'file_deal', name: _('联动文件处置') },
    { value: 'blocklist', name: _('联动网络阻隔') },
    { value: 'evidence', name: _('联动专家取证') },
    { value: 'botnet', name: _('联动网络举证') },
    { value: 'timing_upload_log', name: _('联动日志上报') },
    { value: 'other', name: _('其他') }
];