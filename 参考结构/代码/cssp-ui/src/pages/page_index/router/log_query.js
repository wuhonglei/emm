/**
 * 日志导航
 */

const COMMON_CACHE_PARAMS = [
    'uuid',
    'startDate',
    'startTime',
    'endDate',
    'endTime'
];
const COMMON_CACHE_LOADED_DATA = ['uuid'];

export default {
    path: 'log',
    name: 'logQuery',
    meta: {
        navOptions: {
            text: '检索',
            name: 'logQuery',
            icon: 'log-search'
        }
    },
    redirect: {
        name: 'logQueryAf'
    },
    component: () =>
        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/index.vue'),
    children: [
        {
            path: 'global',
            name: 'logQueryGlobal',
            meta: {
                navOptions: {
                    text: '全局搜索'
                }
            },
            component: () =>
                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/global/index.vue')
        },
        {
            path: 'af',
            name: 'logQueryAf',
            meta: {
                cacheParamsAndLoadedData: true,
                cacheDetail: {
                    params: COMMON_CACHE_PARAMS,
                    loadedData: COMMON_CACHE_LOADED_DATA
                },
                navOptions: {
                    text: '下一代防火墙',
                    icon: 'af',
                    name: 'logQueryAf'
                }
            },
            redirect: {
                name: 'logQueryAfWaf'
            },
            component: () =>
                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/af/index.vue'),
            children: [
                {
                    path: 'waf',
                    name: 'logQueryAfWaf',
                    meta: {
                        navOptions: {
                            text: 'WEB应用防护日志'
                        }
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/af/waf/index.vue')
                },
                {
                    path: 'ips',
                    name: 'logQueryAfIps',
                    meta: {
                        navOptions: {
                            text: '漏洞攻击防护日志'
                        }
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/af/ips/index.vue')
                },
                {
                    path: 'utm',
                    name: 'logQueryAfUtm',
                    meta: {
                        navOptions: {
                            text: '僵尸网络日志'
                        }
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/af/utm/index.vue')
                },
                {
                    path: 'firewall',
                    name: 'logQueryAfFirewall',
                    meta: {
                        navOptions: {
                            text: '应用控制日志'
                        }
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/af/firewall/index.vue')
                },
                {
                    path: 'content',
                    name: 'logQueryAfContent',
                    meta: {
                        navOptions: {
                            text: '内容安全日志',
                            name: 'logQueryAfContent'
                        }
                    },
                    redirect: {
                        name: 'logQueryAfContentUrl'
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/af/content/index.vue'),
                    children: [
                        {
                            path: 'url',
                            name: 'logQueryAfContentUrl',
                            meta: {
                                navOptions: {
                                    text: '网站访问日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/af/content/url/index.vue')
                        },
                        {
                            path: 'mail',
                            name: 'logQueryAfContentMail',
                            meta: {
                                navOptions: {
                                    text: '邮件安全日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/af/content/mail/index.vue')
                        }
                    ]
                },
                {
                    path: 'operate',
                    name: 'logQueryAfOperate',
                    meta: {
                        navOptions: {
                            text: '操作日志'
                        }
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/af/operate/index.vue')
                }
            ]
        },
        {
            path: 'ac',
            name: 'logQueryAc',
            meta: {
                cacheParamsAndLoadedData: true,
                cacheDetail: {
                    params: COMMON_CACHE_PARAMS,
                    loadedData: COMMON_CACHE_LOADED_DATA
                },
                navOptions: {
                    text: '上网行为管理',
                    icon: 'ac',
                    name: 'logQueryAc'
                }
            },
            redirect: {
                name: 'logQueryAcBehavior'
            },
            component: () =>
                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/index.vue'),
            children: [
                {
                    path: 'behavior',
                    name: 'logQueryAcBehavior',
                    meta: {
                        navOptions: {
                            text: '用户行为查询',
                            name: 'logQueryAcBehavior'
                        }
                    },
                    redirect: {
                        name: 'logQueryAcBehaviorWeb'
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/behavior/index.vue'),
                    children: [
                        {
                            path: 'web',
                            name: 'logQueryAcBehaviorWeb',
                            meta: {
                                navOptions: {
                                    text: '网站访问日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/behavior/web/index.vue')
                        },
                        {
                            path: 'mail',
                            name: 'logQueryAcBehaviorMail',
                            meta: {
                                navOptions: {
                                    text: '邮件收发日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/behavior/mail/index.vue')
                        },
                        {
                            path: 'post',
                            name: 'logQueryAcBehaviorPost',
                            meta: {
                                navOptions: {
                                    text: '文件审计日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac//behavior/post/index.vue')
                        },
                        {
                            path: 'chat',
                            name: 'logQueryAcBehaviorChat',
                            meta: {
                                navOptions: {
                                    text: '即时通讯日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/behavior/chat/index.vue')
                        },
                        {
                            path: 'bbs',
                            name: 'logQueryAcWebBbs',
                            meta: {
                                navOptions: {
                                    text: '发帖/发微搏日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/behavior/web_bbs/index.vue')
                        },
                        {
                            path: 'key',
                            name: 'logQueryAcKey',
                            meta: {
                                navOptions: {
                                    text: '搜索关键词日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/behavior/key/index.vue')
                        }
                    ]
                },
                {
                    path: 'terminal',
                    name: 'logQueryAcTerminal',
                    meta: {
                        navOptions: {
                            text: '终端接入日志',
                            name: 'logQueryAcTerminal'
                        }
                    },
                    redirect: {
                        name: 'logQueryAcTerminalShare'
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/terminal/index.vue'),
                    children: [
                        {
                            path: 'share',
                            name: 'logQueryAcTerminalShare',
                            meta: {
                                navOptions: {
                                    text: '防共享接入日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/terminal/share/index.vue')
                        },
                        {
                            path: 'tm',
                            name: 'logQueryAcTerminalTm',
                            meta: {
                                navOptions: {
                                    text: '移动终端发现日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/terminal/tm/index.vue')
                        },
                        {
                            path: 'ingress',
                            name: 'logQueryAcTerminalIngress',
                            meta: {
                                navOptions: {
                                    text: '准入日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/terminal/ingress/index.vue')
                        },
                        {
                            path: 'proxy',
                            name: 'logQueryAcTerminalProxy',
                            meta: {
                                navOptions: {
                                    text: '代理工具管理日志'
                                }
                            },
                            component: () =>
                                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/terminal/proxy/index.vue')
                        }
                    ]
                },
                {
                    path: 'safe',
                    name: 'logQueryAcSafe',
                    meta: {
                        navOptions: {
                            text: '上网安全'
                        }
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/safe/index.vue')
                },
                {
                    path: 'operate',
                    name: 'logQueryAcOperation',
                    meta: {
                        navOptions: {
                            text: '操作日志'
                        }
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/ac/operate/index.vue')
                }
            ]
        },
        {
            path: 'edr',
            name: 'logQueryEdr',
            meta: {
                cacheParamsAndLoadedData: true,
                cacheDetail: {
                    params: COMMON_CACHE_PARAMS,
                    loadedData: COMMON_CACHE_LOADED_DATA
                },
                navOptions: {
                    text: 'EDR',
                    icon: 'edr',
                    name: 'logQueryEdr'
                }
            },
            component: () =>
                import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/edr/index.vue'),
            redirect: {
                name: 'logQueryEdrSafe'
            },
            children: [
                {
                    path: 'safe',
                    name: 'logQueryEdrSafe',
                    meta: {
                        navOptions: {
                            text: '安全日志'
                        }
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/edr/safe/index.vue')
                },
                {
                    path: 'linkopr',
                    name: 'logQueryEdrLinkopr',
                    meta: {
                        navOptions: {
                            text: '联动日志'
                        }
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/edr/linkopr/index.vue')
                },
                {
                    path: 'operate',
                    name: 'logQueryEdrOperate',
                    meta: {
                        navOptions: {
                            text: '操作日志'
                        }
                    },
                    component: () =>
                        import(/* webpackChunkName: "log" */ 'src/view/mod_log_query/edr/operation/index.vue')
                }
            ]
        }
    ]
};
