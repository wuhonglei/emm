
/**
 * 处理用户和用户管理
 */

import ChooseRoles from 'src/page_index/components/business/choose_roles';
import modelUtils from 'src/page_index/views/service/ext_user_manage/user_manage_utils';
import Bus, { EVENTS } from 'src/utils/bus';

let operateModel = modelUtils.model;
let extAlterValue = { // 外部用户批量编辑
    'expiredTime': 'enableExpireDate',
    'status': 'enableAccount',
    'authComposeId': 'enableAuth',
    'trustStrategyId': 'enableTrustStrategy',
    'roleIdList': 'enableRole'
};

let localAlterValue = { // 本地用户批量编辑
    'status': 'enbaleSatus',
    'password': 'enablePassword',
    'confirmPassword': 'enableConfirmPassword',
    'expiredTime': 'enableExpireDate',
    'groupId': 'enablePath',
    'authComposeId': 'enableAuths',
    'trustStrategyId': 'enableTrustStrategy',
    'roleIdList': 'enableRole'
};

export default {
    methods: {

        /**
         * 
         * 转换账号状态的属性
         * 
         */

        handleStatusRadio (value) {
            if (value === 'on') {
                return {
                    status: 1,
                    localAccountStatus: 0
                };
            } else if (value === 'off') {
                return {
                    status: 1,
                    localAccountStatus: 1
                };
            }
            return {
                status: 0,
                localAccountStatus: 0
            };
        },

        /**
         * 
         * 处理虚拟ip，过期时间，描述，手机号码和电子邮箱
         * 
         */

        handleEditData (value) {
            if (value === 'server' || typeof value === 'undefined') {
                return {attr: 0, value: '', isSetting: 0 };
            }
            if (value === 'auto') {
                return {attr: 1, value: '', isSetting: 0};
            }
            return {attr: 1, value: value, isSetting: 1 }; // 是手动设置
        },

        /**
         * 
         * 处理单个的属性映射的值
         * 
         */

        handleAttribute (radio, value) {
            if (radio === 0) {
                return 'server';
            }
            if (value === 0) {
                return 'auto';
            }
            return false;
        },

        /**
         * 
         * 将属性映射转换出来
         * flag 布尔值 标识是否为批量新增编辑， 或者用户组进入，如果是则不需要处理
         * query 对象 存储用户名，信任策略等
         * attributeData 对象存储所有属性
         * 
         */

        handleSubmitData (query, attributeData) {
            let queryData = Object.assign({}, query);
            queryData.status = attributeData.status === 0 ? 'server' : (attributeData.localAccountStatus === 0 ? 'on' : 'off');
            queryData.expiredTime = this.handleAttribute(attributeData.expireDate, attributeData.localExpireDate) || attributeData.expireDateDetail;

            // 用户组或者用户是批量新增， 批量编辑， 或者是从中间页面点击上面标题返回的
            if (!modelUtils.isBatchAddModel && !modelUtils.isBatchEditModel && !modelUtils.isBatchEditFromNext && !modelUtils.isBatchAddFromNext) {
                queryData.description = this.handleAttribute(attributeData.desc) || attributeData.manualDesc;
                if (!modelUtils.tabIndex) { // 处理用户
                    queryData.phone = this.handleAttribute(attributeData.phone) || attributeData.manualPhone;
                    queryData.email = this.handleAttribute(attributeData.mail) || attributeData.localMail;
                }
            }
            return queryData;
        },

        /**
         * 
         * 下拉框 根据id， 获取对应的名字
         * selectOptions 下拉框配置项
         */

        getLabelNameByID (selectOptions, id) {
            if (!selectOptions || !selectOptions.length || !id) {
                return;
            }
            for (let i = 0; i < selectOptions.length; i++) {
                if (selectOptions[i].value === id) { // 认证组合，拿出选中的id的名字
                    return selectOptions[i].label;
                }
            }
            return;
        },

        /**
         * 
         * 处理下一步的数据
         * isTransferExt 布尔值 标识是否需要将ext 进行转化 // todo
         * query 对象 存储用户名，信任策略等
         * attributeData 对象存储所有属性
         * alterData 授权外部用户或用户组的 路径，手机号码，账号状态等属性
         * 
         */

        handleNextData (isTransferExt, query, attributeData, alterData = []) {
            let addBatchData = this.handleSubmitData(query, attributeData);
            addBatchData.authComposeName = this.getLabelNameByID(this.authServer, addBatchData.authComposeId); // 认证组合查询label
            addBatchData.trustStrategyName = this.getLabelNameByID(this.trustLevel, addBatchData.trustStrategyId); // 信任等级查询label

            if (!alterData.length) {
                return [];
            }
            let extAttribute, // 存用户属性的ext
                tableData = [];
            alterData.forEach(item => {
                extAttribute = item.ext;
                if (isTransferExt) { // 判断是否需要转换ext
                    let tempExt = {};
                    let attributeArray = [ 'path', 'status', 'expiredTime', 'description', 'phone', 'email' ];
                    attributeArray.forEach(attribute => { // 将对应从外部服务器中获取的数据保存到ext里面
                        tempExt[attribute] = {
                            'type': 'text',
                            'value': item[attribute]
                        };
                    });
                    extAttribute = JSON.stringify(tempExt);
                }

                tableData.push({ // 将数据处理成跟前面的列表保持一致
                    ext: extAttribute,
                    name: item.name,
                    trustStrategyId: query.trustStrategyId,
                    authComposeId: query.authComposeId,
                    trustStrategyName: addBatchData.trustStrategyName,
                    authComposeName: addBatchData.authComposeName,
                    roleList: query.roleArray, // 包含角色的id 和 角色名
                    roleIdList: query.roleIdList, // 角色id的数组
                    rolesName: query.rolesName,
                    expiredTime: addBatchData.expiredTime,
                    status: addBatchData.status,
                    description: addBatchData.description,
                    email: addBatchData.email,
                    phone: addBatchData.phone
                });
            });

            return tableData;
        },

        findKey (obj, value, compare = (a, b) => a === b) {
            
            return Object.keys(obj).find(k => compare(obj[k], value));
        },

        /**
         * 用于新编辑的数据区替换表格中的数据
         * oldData 存储最开始批量新增选择的数据
         * newData 存储批量编辑或单个编辑修改后的数据
         */

        updateOldEditData (oldData, newData) {
            oldData.forEach((oldItem, oldIndex) => {
                newData.forEach((newItem) => {
                    if (oldItem.name === newItem.name) {
                        oldData[oldIndex] = newItem;
                    }
                });
            });
            return oldData;
        },


        /**
         * 更换中间页面表格数据（操作批量编辑和单个编辑之后）
         * params 对象 存储用户名，信任策略等
         * attributeData 对象存储所有属性
         * newEditData 存储批量编辑修改后的数据
         * oldEditData 存储最开始批量新增选择的数据
         * enableParams 存储各个属性对应的开关
         */

        updateTableData (params, attributeData, newEditData, oldEditData) {
            let tableData = this.handleNextData(false, params, attributeData, newEditData);
            modelUtils.setEditData(operateModel.batchAdd, this.updateOldEditData(oldEditData, tableData));
        },

        /**
         * 更换中间页面表格数据（操作批量编辑和单个编辑之后）
         * params 对象 存储用户名，信任策略等
         * attributeData 对象存储所有属性
         * newEditData 存储批量编辑修改后的数据
         * oldEditData 存储最开始批量新增选择的数据
         * enableParams 存储各个属性对应的开关
         */

        updateBacthTableData (params, attributeData, newEditData, oldEditData, enableParams) {
            let currKey;
            let addBatchData = this.handleSubmitData(params, attributeData);

            // 想对应的属性， 根据开或者关，来确定是否需要批量编辑

            for (let key in enableParams) { // 循环params对象
                if (enableParams.hasOwnProperty(key)) {
                    currKey = this.findKey(extAlterValue, key);
                    if (enableParams[key]) { // 开启了该属性批量编辑
                        for (let i = 0; i < newEditData.length; i++) {
                            newEditData[i][currKey] = addBatchData[currKey];
                            
                            // 对应的id 修改了下面的对应的name值也需要修改
                            if (key === 'enableAuth') {
                                newEditData[i].authComposeName = this.getLabelNameByID(this.authServer, addBatchData.authComposeId); // 认证组合查询label
                            }
                            if (key === 'enableTrustStrategy') { 
                                
                                // 查询信任策略的id相对应
                                newEditData[i].trustStrategyName = this.getLabelNameByID(this.trustLevel, addBatchData.trustStrategyId);
                            }
                            if (key === 'enableRole') {

                                // id 修改相对应的name值也需要修改
                                newEditData[i].rolesName = addBatchData.rolesName;   
                            }
                        }
                    }
                }
                
            }
            modelUtils.setEditData(operateModel.batchAdd, this.updateOldEditData(oldEditData, newEditData));
        },
        
        /**
         * 处理批量编辑用户用户组的函数
         * enableParams 某单个属性是否开启批量编辑
         * queryData 需要处理的所有属性值
         * editData 选中编辑的用户
         * value 查找的key和value的替换
         * isExtUserOrGrp 是否为外部用户或用户组
         */

        updateEditData (enableParams, queryData, editData, value, isExtUserOrGrp) {
            let currKey,
                editParams = {},
                tempValue = {};
            
            if (isExtUserOrGrp) { // 外部用户管理模块， 需要中的认证服务器的id
                editParams.authServerId = modelUtils.authServerId;
            }
            editParams.idList = editData.map(item => { // 服务端定义批量编辑， 需要传的值
                return item.id;
            });
            for (let key in enableParams) { // 循环params对象
                if (enableParams.hasOwnProperty(key)) {
                    currKey = this.findKey(value, key);
                    if (enableParams[key]) { // 开启了该属性批量编辑
                        tempValue[currKey] = queryData[currKey];
                    }
                }
            }
            editParams.value = tempValue;
            return editParams;
        },

        /**
         * 批量编辑外部用户或用户组
         * params 存储用户名，信任策略等
         * editData 选中编辑的用户
         * enableParams 某单个属性是否开启批量编辑
         * attribute 用户属性
         */

        updateExtBacthEditData (params, attribute, enableParams, editData) {
            let addBatchData = this.handleSubmitData(params, attribute);
            return this.updateEditData(enableParams, addBatchData, editData, extAlterValue, true);
        },

        /**
         * 批量编辑用户
         * configParams 本地用户所有的配置
         * enableParams 某单个属性是否开启批量编辑
         * editData 选中编辑的用户
         */

        updateLocalBacthEditData (configParams, enableParams, editData) {
            configParams.expiredTime = this.handleAttribute('', configParams.expireDate) || configParams.expireDateDetail;
            return this.updateEditData(enableParams, configParams, editData, localAlterValue);
        },

        /**
         * 
         * 打开角色窗口
         * data 需要传到ChooseRoles页面的参数
         */

        openRoleWin (data) {
            let that = this;
            let chooseRolesWin = this.$modal(ChooseRoles, {
                title: '选择角色',
                autoDestroy: true,
                width: 640,
                props: {
                    roleIdList: data
                },
                submit: function () {
                    let winThis = this;
                    let params = winThis.formRoot.getJsonValue();
                    let roles = that.handleRoleNameAndId(params);
                    let roleArray = params.map(item => {
                        return { id: item.id, name: item.name};
                    });
                    Bus.$emit(EVENTS.CHOOSE_ROLES_PARAMS, {
                        roleArray: roleArray,
                        rolesName: roles.rolesName,
                        roleIdList: roles.roleIdList
                    });
                    chooseRolesWin.destroy();
                    chooseRolesWin = null;
                }
            });
            chooseRolesWin.open();
        },

        /**
         * 转换radio配置的信息
         * 
         */

        transferAttribute (data, type) {
            if (data[type] === 'server') {
                if (data.ext) {
                    let tempExt = JSON.parse(data.ext);
                    return (tempExt[type] || {}).value || '-';
                }
                return '-';
            }
            if (data[type] === 'auto') {
                return type === 'expiredTime' ? '永不过期' : '自动获取';
            }
            return data[type] || '-';
        },

        /**
         * 转换账号状态
         * 
         */

        transferStatus (data) {
            if (data.status === 'server') {
                if (data.ext) {
                    let tempExt = JSON.parse(data.ext);
                    return (tempExt.status || {}).value === 'on';
                }
                return false;
            }
            return data.status === 'on';
        },

        /**
         * 转换身份信息
         * 
         */

        transferIdentify (data) {
            return data === 'normal' ? '普通用户' : '核心用户';
        },

        /**
         * 转换所属组
         * 
         */

        transferPath (data, type) {
            if (data.ext) {
                let tempExt = JSON.parse(data.ext);
                return (tempExt[type] || {}).value || '-';
            }
            return '-';
        },

        // 处理角色穿梭框中， 角色的名称， id分割出来
        handleRoleNameAndId (roleList) {
            if (!roleList || !roleList.length) {
                return {};
            }
            let rolesName = [],
                //eslint-disable-next-line
                roleIdList = []; // 跟服务端协商定义的字段
            roleList.forEach(item => {
                rolesName.push(item.name);
                roleIdList.push(item.id);
            });
            return {
                rolesName: rolesName.join(','),
                roleIdList: roleIdList,
                roleList: roleList
            };
        }
    }
};