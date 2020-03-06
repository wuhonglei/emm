<template>
    <div class="dialog-collector-wrapper">
        <el-dialog
            v-if="dialogVisible"
            v-model="dialogVisible"
            custom-class="cssp-dialog-m">
            <span slot="title">{{ type === 'add' ? '新增' : '编辑' }}</span>
            <p 
                v-show="tipsInfo"
                class="tips-info">
                <i class="el-icon-information"></i>
                {{ tipsInfo }}
            </p>
            <div
                v-loading="loading"
                :class="{'form-content-margin': tipsInfo}">
                <el-form
                    v-model="formValid"
                    label-width="120px"
                    :rules="rules"
                    :model="params">
                    <el-form-item
                        label="资产名称："
                        prop="name">
                        <el-row> 
                            <el-col :span="22">
                                <el-input
                                    v-model="params.name"
                                    size="small"
                                    :disabled="params.type === 'sangfor'"
                                    placeholder="请输入资产名称" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item
                        label="资产分组："
                        prop="group">
                        <el-row> 
                            <el-col :span="22">
                                <el-radio-group v-model="params.group">
                                    <el-radio v-for="(item, index) in groupList"
                                              :key="index"
                                              :index="index"
                                              :label="item.id">
                                        {{ item.name }}
                                    </el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item
                        label="接入方式："
                        prop="type">
                        <el-row> 
                            <el-col :span="22">
                                <el-select
                                    v-model="params.type"
                                    class="full-width-select"
                                    size="small"
                                    :disabled="type === 'edit'"
                                    @change="handleSelectChange">
                                    <el-option
                                        v-for="typeScope in collectorTypes"
                                        :key="typeScope.value"
                                        :label="typeScope.name"
                                        :value="typeScope.value" />
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item
                        label="资产类型："
                        prop="pluginName">
                        <el-row> 
                            <el-col :span="22">
                                <el-select
                                    v-model="params.pluginName"
                                    class="full-width-select"
                                    size="small"
                                    :disabled="type === 'edit'"
                                    @visible-change="handleVisibleChange">
                                    <el-option
                                        v-for="pluginName in loadedData.pluginName"
                                        :key="pluginName.name"
                                        :label="pluginName.name"
                                        :value="pluginName.name" />
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item
                        label="资产IP："
                        prop="ip">
                        <el-row> 
                            <el-col :span="22">
                                <el-input
                                    v-model="params.ip"
                                    size="small"
                                    :disabled="type === 'edit' && params.type !== 'Slog'"
                                    placeholder="请输入资产IP" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item
                        v-if="params.type === 'Slog'"
                        label="日志审计IP："
                        prop="dcEth">
                        <el-row> 
                            <el-col :span="22">
                                <el-select
                                    v-model="params.dcEth"
                                    class="full-width-select"
                                    size="small"
                                    @visible-change="handleDCEthVisibleChange"
                                    @change="handleDCSelectChange">
                                    <el-option
                                        v-for="eth in loadedData.dcEthList"
                                        :key="eth.name"
                                        :label="eth._value | dcEthFilter"
                                        :value="eth._value"
                                        :disabled="!eth.ip" />
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item
                        v-if="params.type === 'WMI' || params.type === 'Slog'"
                        prop="username"
                        label="用户名：">
                        <el-row> 
                            <el-col :span="22">
                                <el-input
                                    v-model="params.username"
                                    size="small"
                                    placeholder="请输入用户名" 
                                    :disabled="type === 'edit'" />
                            </el-col>
                            <el-col :span="2">
                                <popover>
                                    <div>1.用于将日志审计的IP地址自动下发给对应设备</div>
                                    <div>2.用户名为1-96个字符</div>
                                    <div>3.用户名只能有数字，字母，正反斜线，下划线</div>
                                </popover>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item
                        v-if="params.type === 'WMI' || params.type === 'Slog'"
                        label="密码："
                        prop="password">
                        <el-row :gutter="params.type === 'WMI' ? 13 : 0">
                            <el-col
                                class="first-col-padding"
                                :span="params.type === 'WMI' ? 16 : 22">
                                <el-input
                                    v-model="params.password"
                                    size="small"
                                    type="password"
                                    placeholder="请输入密码" 
                                    :disabled="type === 'edit'" />
                            </el-col>
                            <el-col v-if="params.type === 'WMI'" 
                                    :span="5">
                                <el-button
                                    size="small"
                                    style="padding: 8px 32px;"
                                    :disabled="!params.username || !params.password || type==='edit'"
                                    @click="checkWmi">
                                    测试
                                </el-button>
                            </el-col>
                            <el-col :span="params.type === 'WMI' ? 1 : 2">  
                                <popover><span>密码长度为1~32位</span></popover>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item
                        label="重要程度："
                        prop="degree">
                        <el-row> 
                            <el-col :span="22">
                                <el-radio-group v-model="params.degree">
                                    <el-radio label="general">
                                        一般
                                    </el-radio>
                                    <el-radio label="major">
                                        重要
                                    </el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item 
                        label="备注："
                        prop="comment">
                        <el-row> 
                            <el-col :span="22">
                                <el-input
                                    v-model="params.comment"
                                    size="small"
                                    placeholder="请输入备注，长度不超过96个字符（选填）"
                                    resize="none"
                                    :rows="3"
                                    type="textarea" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div><span slot="footer">
                <el-button
                    type="primary"
                    :disabled="disableConfirm"
                    @click="submit">确定</el-button>
                <el-button
                    :disabled="loading"
                    @click="dialogVisible = false">取消</el-button></span>
        </el-dialog>
    </div>
</template>

<script>

/**
 * @file 资产管理编辑弹窗
 */

import dialog from 'src/common/mixins/dialog';
import rules from './asset_rule';
import { COLLECTOR_TYPES, ASSETGROUP } from 'src/utils/consts';
import { 
    getAllPluginNames,
    checkWmiPaasword,
    addAssetManage,
    editAssetManage,
    getDCEthList,
    getAuthInfo
} from 'src/common/api/asset_center';
import popover from 'src/common/components/form_tips/popover';
import { Base64 } from 'js-base64';

export default {
    components: {
        popover
    },
    filters: {
        dcEthFilter (item) {
            let eth = JSON.parse(item);
            if (eth.ip && eth.prefix) {
                return `${eth.name}（${eth.ip}/${eth.prefix}）`;
            }

            if (eth.ip) {
                return `${eth.name}（${eth.ip}）`;
            }

            return eth.name;
        }
    },

    mixins: [dialog],
    data () {
        return {
            type: 'add',
            groupList: ASSETGROUP,
            params: {
                id: '',
                name: '',
                group: '',
                type: COLLECTOR_TYPES[0].value,
                pluginName: '',
                ip: '',
                dcEth: '',
                dcEthData: {},
                comment: '',
                username: '',
                password: '',
                degree: ''
            },
            loadedData: {
                allPluginNames: [],
                pluginName: [],
                dcEthList: []
            },
            collectorTypes: COLLECTOR_TYPES,
            rules,
            formValid: false,
            tipsInfo: '',
            canAddCollector: false
        };
    },
    computed: {
        disableConfirm () {
            return this.loading || 
                (this.params.type === 'Slog' && !this.params.dcEthData.ip) || 
                !this.formValid;
        }
    },
    watch: {
        'params.pluginName': {
            deep: true,
            handler (v) {
                if (v) {
                    this.tipsInfo = (v === 'AC') ?  
                        '设备接入后，将自动开启设备的“深信服设备接入”功能' :
                        (this.canAddCollector ? '' : '抱歉，暂没有可用授权，仅可接入深信服设备');
                } else {
                    this.tipsInfo = '';
                }
            }
        },
        collectorTypes () {
            if (this.collectorTypes.length) {
                this.params.type = this.collectorTypes[0].value;
            }
        }
    },
    mounted () {
        this.loadPluginName();
        this.loadDCEthList();
    },
    methods: {
        async init (payload = {}) {

            // 对表单进行初始化处理
            this.params.id = payload.id || '';
            this.params.name = payload.name || '';
            this.params.group = payload.group === 'all' ? 'network' : payload.group;
            this.params.type = payload._type || this.collectorTypes[0].value;
            this.params.pluginName = payload.plugin_name || '';
            this.params.ip = payload.ip || '';
            this.params.comment = payload.comment || '';
            this.params.degree = payload.degree || 'general';
            this.params.username = payload.username || '';
            if (payload._type === 'Slog' && this.type === 'edit') {
                await this.loadDCEthList();
                this.params.password = '******';
                this.params.dcEthData = this.loadedData.dcEthList.find(
                    eth => eth.ip === payload.dc_ip && eth.name === payload.dc_eth
                ) || {
                    name: payload.dc_eth,
                    ip: payload.dc_ip
                };
                this.params.dcEth = this.getDCEthDisplayStr(this.params.dcEthData);
            } else {
                this.params.password = (payload._type === 'WMI' && this.type === 'edit') ? '******' : '';
            }
        },

        handleOpen (payload = {}) {
            if (payload && !payload.id) {
                this.type = 'add';
                this.formValid = false;
            } else {
                this.type = 'edit';
                this.formValid = true;
            }
            this.getAuth();
            this.init(payload);
            this.dialogVisible = true;
        },

        // 获取权限
        getAuth () {
            this.canAddCollector = false;
            this.tipsInfo = '';
            getAuthInfo()
                .then((res) => {
                    this.canAddCollector = res.data.data.auth_available;
                    this.handleCanAddCollector();
                });
        },
        
        handleCanAddCollector () {
            this.collectorTypes = [];
            if (!this.canAddCollector) {
                this.tipsInfo = '抱歉，暂没有可用授权，仅可接入深信服设备';
                this.collectorTypes = [{
                    name: '深信服接入',
                    value: 'Slog'
                }];
            } else {
                this.tipsInfo = '';
                this.collectorTypes = COLLECTOR_TYPES;
            }
        },

        handleVisibleChange (v) {
            if (!v || (Array.isArray(this.loadedData.pluginName) &&
                this.loadedData.pluginName.length > 0)) {
                
                //非第一次加载时，重置类型下拉框数据
                this.loadedData.pluginName = this.prefixPluginName(this.loadedData.allPluginNames);
                return;
            }
            this.loadPluginName();
        },

        handleDCEthVisibleChange (v) {
            if (!v || (Array.isArray(this.loadedData.dcEthList) &&
                this.loadedData.dcEthList.length > 0)) {
                return;
            }
            this.loadDCEthList();
        },

        handleDCSelectChange () {
            try {
                let ethData = JSON.parse(this.params.dcEth);
                this.params.dcEthData = ethData;
            } catch (err) {
                void(0);
            }
        },

        handleSelectChange () {
            if (Array.isArray(this.loadedData.allPluginNames) && 
                this.loadedData.allPluginNames.length <= 0) {
                return;
            }
            this.loadedData.pluginName = this.prefixPluginName(this.loadedData.allPluginNames);
            this.params.pluginName = this.loadedData.pluginName[0] && this.loadedData.pluginName[0].name;
        },

        loadPluginName () {
            getAllPluginNames()
                .then((res) => {
                    this.loadedData.allPluginNames = res.data.data || [];
                    this.loadedData.allPluginNames.push({
                        name: 'NGAF',
                        _type: 'Slog'
                    }, {
                        name: 'AC',
                        _type: 'Slog'
                    });
                    this.loadedData.pluginName = this.prefixPluginName(res.data.data);
                })
                .catch(() => {});
        },

        loadDCEthList () {
            return getDCEthList()
                .then(res => {
                    this.loadedData.dcEthList = res.data.data || [];
                    this.loadedData.dcEthList.forEach(eth => {
                        eth._value = this.encodeDCEthStr(eth);
                    });
                })
                .catch(() => {});
        },

        // 拼接处dcip选项的value
        encodeDCEthStr (eth) {
            return JSON.stringify(eth);
        },
        getDCEthDisplayStr (eth) {
            if (eth.ip && eth.prefix) {
                return `${eth.name}（${eth.ip}/${eth.prefix}）`;
            }

            if (eth.ip) {
                return `${eth.name}（${eth.ip}）`;
            }

            return eth.name;
        },

        //根据type修改pluginName
        prefixPluginName (allPluginNames) {
            if (!allPluginNames && !Array.isArray(allPluginNames)) {
                return;
            }
            return allPluginNames.filter((item) => item._type === this.params.type);
        },
        
        // 获取提交的参数数据
        resolvedSubmitData () {

            let isWMI = this.params.type === 'WMI',
                isSlog = this.params.type === 'Slog';

            return {
                id: this.type === 'edit' ? this.params.id : void(0),
                name: this.params.name,
                _type: this.params.type,
                group: this.params.group,
                plugin_name: this.params.pluginName,
                ip: this.params.ip,
                dc_eth: isSlog ? this.params.dcEthData.name : void(0),
                dc_ip: isSlog ? this.params.dcEthData.ip : void(0),
                username: isWMI || isSlog ? this.params.username : void(0),
                password: isWMI || isSlog ? Base64.encode(this.params.password) : void(0),
                degree: this.params.degree,
                comment: this.params.comment
            };
        },

        resolvedCheckData () {
            return {
                ip: this.params.ip,
                username: this.params.username,
                password: Base64.encode(this.params.password)
            };
        },
        

        checkWmi () {
            this.loading = true;
            let params = this.resolvedCheckData();
            checkWmiPaasword(params)
                .then(() => {
                    this.$message({
                        message: '校验成功',
                        type: 'success'
                    });
                    this.loading = false;
                })
                .catch((err) => {
                    this.$error((err.data && err.data.mesg) || '校验账号密码失败');
                    this.loading = false;
                });
        },

        // 提交编辑或新增
        submit () {
            this.loading = true;
            let params = this.resolvedSubmitData();
            let operateType = this.type === 'add' ? '新增' : '编辑';
            if (this.type === 'add') {
                addAssetManage(params)
                    .then(() => {
                        this.$emit('load-table-data');
                        this.$emit('refresh-auth');
                        this.submitSuccessHandler(`${operateType}资产成功`);
                    })
                    .catch((err) => {
                        this.$error((err.data && err.data.mesg) || `${operateType}资产失败`);
                        this.loading = false;
                    });
            } else {
                editAssetManage(params)
                    .then(() => {
                        this.$emit('load-table-data');
                        this.submitSuccessHandler(`${operateType}资产成功`);
                    })
                    .catch((err) => {
                        this.$error((err.data && err.data.mesg) || `${operateType}资产失败`);
                        this.loading = false;
                    });
            }
        },

        // 成功回调函数
        submitSuccessHandler (msg) {
            this.dialogVisible = false;
            this.loading = false;
            this.$message.success({
                message: msg
            });
        }
    }
};
</script>

<style lang="postcss">
.dialog-collector-wrapper {
    & .tips-info{
        position: absolute;
        left: 0;
        top: 36px;
        width: 100%;
        background: #FFF2E0;
        line-height: 30px;
        margin: 0;
        text-align: center;
        border-bottom: 1px solid #F2DFC3;
        color: #EE8800;
        & .el-icon-information {
            color: #FF9900;
        }
    }

    & .form-content-margin {
        margin-top: 24px;
    }

    & .svg-icon {
        margin-right: 5px;
    }
}
</style>

