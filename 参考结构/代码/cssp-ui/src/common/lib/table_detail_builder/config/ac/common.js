/**
 * @file ac 日志详情配置
 */

export default {
    chat: {
        name: '即时通讯日志',
        detail: [
            { key: 'user_name', name: '用户名' },
            { key: 'grp_name', name: '组名' },
            { key: 'src_ip', name: '源IP' },
            { key: 'tm_name', name: '终端类型' },
            { key: 'site_name', name: '位置' },
            { key: 'dst_ip', name: '目的IP' },
            { key: 'chat_from', name: '发送账号' },
            { key: 'chat_to', name: '接收账号' },
            { key: 'msg', name: '聊天摘要' },
            { key: 'app_name', name: '聊天工具' },
            { key: 'net_action', name: '访问控制' },
            { key: 'time', name: '时间' }
        ]
    },
    key: {
        name: '搜索关键词日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'user_name', name: '用户名' },
            { key: 'grp_name', name: '组名' },
            { key: 'src_ip', name: '源IP' },
            { key: 'tm_name', name: '终端类型' },
            { key: 'site_name', name: '位置' },
            { key: 'keyword_original', name: '搜索关键字' },
            { key: 'url', name: 'URL地址' },
            { key: 'net_action', name: '访问控制' }
        ]
    },
    mail: {
        name: '邮件收发日志',
        detail: [
            { key: 'user_name', name: '用户名' },
            { key: 'grp_name', name: '组名' },
            { key: 'src_ip', name: '源IP' },
            { key: 'tm_name', name: '终端类型' },
            { key: 'site_name', name: '位置' },
            { key: 'dst_ip', name: '目的IP' },
            { key: 'mail_title', name: '邮件标题' },
            { key: 'mail_body', name: '正文摘要' },
            { key: 'email_from', name: '发件地址' },
            { key: 'email_to', name: '收件地址' },
            { key: 'net_action', name: '访问控制' },
            { key: 'app_name', name: '具体应用' },
            { key: 'time', name: '时间' }
        ]
    },
    upfile: {
        name: '文件审计日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'user_name', name: '用户名' },
            { key: 'grp_name', name: '组名' },
            { key: 'src_ip', name: '源IP' },
            { key: 'tm_name', name: '终端类型' },
            { key: 'site_name', name: '位置' },
            { key: 'dst_ip', name: '目的IP' },
            { key: 'filename', name: '文件名' },
            { key: 'filesize', name: '文件大小' },
            { key: 'trace_t', name: '发送方式' },
            { key: 'net_action', name: '访问控制' }
        ]
    },
    web: {
        name: '网站访问日志',
        detail: [
            { key: 'user_name', name: '用户名' },
            { key: 'grp_name', name: '组名' },
            { key: 'src_ip', name: '源IP' },
            { key: 'tm_name', name: '终端类型' },
            { key: 'site_name', name: '位置' },
            { key: 'dst_ip', name: '目的IP' },
            { key: 'app_name', name: '网站分类' },
            { key: 'title', name: '标题' },
            { key: 'host', name: '访问域名' },
            { key: 'url', name: 'URL地址' },
            { key: 'net_action', name: '访问控制' },
            { key: 'time', name: '时间' }
        ]
    },
    bbs: {
        name: '发帖/发微搏日志',
        detail: [
            { key: 'time', name: '时间' },
            { key: 'user_name', name: '用户名' },
            { key: 'grp_name', name: '组名' },
            { key: 'src_ip', name: '源IP' },
            { key: 'tm_name', name: '终端类型' },
            { key: 'site_name', name: '位置' },
            { key: 'dst_ip', name: '目的IP' },
            { key: 'title', name: '标题' },
            { key: 'body', name: '正文摘要' },
            { key: 'url', name: 'URL地址' },
            { key: 'net_action', name: '访问控制' }
        ]
    },
    operate: {
        name: '操作日志',
        detail: [
            { key: 'user_name', name: '用户名' },
            { key: 'ip_addr', name: '主机IP' },
            { key: 'obj_type', name: '操作对象' },
            { key: 'opr_type', name: '操作' },
            { key: 'time', name: '日期时间' },
            { key: 'depict', name: '描述' }
        ]
    }
};