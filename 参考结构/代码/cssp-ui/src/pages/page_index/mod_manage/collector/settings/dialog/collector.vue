<template>
    <div class="dialog-collector-wrapper">
        <el-dialog
            v-if="dialogVisible"
            v-model="dialogVisible"
            custom-class="cssp-dialog-m">
            <span slot="title">{{ type === 'add' ? '新增' : '编辑' }}</span>
            <div v-loading="loading">
                <el-form
                    v-model="formValid"
                    label-width="120px"
                    :rules="rules"
                    :model="params">
                    <el-form-item
                        label="采集器名称："
                        prop="name">
                        <el-row> 
                            <el-col :span="22">
                                <el-input
                                    v-model="params.name"
                                    size="small"
                                    :disabled="params.type === 'sangfor'"
                                    placeholder="请输入采集器名称" />
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
                        label="类型："
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
                        label="设备IP："
                        prop="ip">
                        <el-row> 
                            <el-col :span="22">
                                <el-input
                                    v-model="params.ip"
                                    size="small"
                                    :disabled="type === 'edit' && params.type !== 'Slog'"
                                    placeholder="请输入设备IP" />
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
                                    :disabled="!params.username || !params.password"
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
 * 采集器编辑弹窗
 */

import dialog from 'src/common/mixins/dialog';
import rules from './collector_rule';
import { COLLECTOR_TYPES } from 'src/utils/consts';
import { 
    getAllPluginNames,
    addCollector,
    updataCollector,
    checkWmiPaasword,
    getDCEthList
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
            params: {
                id: '',
                name: '',
                type: COLLECTOR_TYPES[0].value,
                pluginName: '',
                ip: '',
                dcEth: '',
                dcEthData: {},
                comment: '',
                username: '',
                password: ''
            },
            loadedData: {
                allPluginNames: [],
                pluginName: [],
                dcEthList: []
            },
            collectorTypes: COLLECTOR_TYPES,
            rules,
            formValid: false
        };
    },
    computed: {
        disableConfirm () {
            return this.loading || 
                (this.params.type === 'Slog' && !this.params.dcEthData.ip) || 
                !this.formValid;
        }
    },
    methods: {
        async init (payload = {}) {

            // 对表单进行初始化处理
            this.params.id = payload.id || '';
            this.params.name = payload.name || '';
            this.params.type = payload._type || COLLECTOR_TYPES[0].value;
            this.params.pluginName = payload.plugin_name || '';
            this.params.ip = payload.ip || '';
            this.params.comment = payload.comment || '';
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
                this.params.password = (payload._type === 'WMI' && this.type === 'edit') ? Base64.decode(payload.password) : '';
            }
        },

        handleOpen (payload = {}) {
            if (payload && !payload.id) {
                this.type = 'add';
            } else {
                this.type = 'edit';
            }
            this.formValid = false;
            this.dialogVisible = true;
            this.init(payload);
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
        
        resolvedSubmitData () {

            let isWMI = this.params.type === 'WMI',
                isSlog = this.params.type === 'Slog';

            return {
                id: this.type === 'edit' ? this.params.id : void(0),
                name: this.params.name,
                _type: this.params.type,
                plugin_name: this.params.pluginName,
                ip: this.params.ip,
                dc_eth: isSlog ? this.params.dcEthData.name : void(0),
                dc_ip: isSlog ? this.params.dcEthData.ip : void(0),
                username: isWMI || isSlog ? this.params.username : void(0),
                password: isWMI || isSlog ? Base64.encode(this.params.password) : void(0),
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
                    this.$error(err, '校验账号密码失败');
                    this.loading = false;
                });
        },

        submit () {
            this.loading = true;
            let params = this.resolvedSubmitData();
            let operateType = this.type === 'add' ? '新增' : '编辑';
            if (this.type === 'add') {
                addCollector(params)
                    .then(() => {
                        this.$emit('load-table-data');
                        this.$emit('refresh-auth');
                        this.submitSuccessHandler(`${operateType}采集器成功`);
                    })
                    .catch((err) => {
                        this.$error(err, `${operateType}采集器失败`);
                        this.loading = false;
                    });
            } else {
                updataCollector(params)
                    .then(() => {
                        this.$emit('load-table-data');
                        this.submitSuccessHandler(`${operateType}采集器成功`);
                    })
                    .catch((err) => {
                        this.$error(err, `${operateType}采集器失败`);
                        this.loading = false;
                    });
            }
        },
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
    & .svg-icon {
        margin-right: 5px;
    }
}
</style>

