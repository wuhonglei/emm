<template>
    <div class="dioalog-collector-wrapper">
        <el-dialog
            v-if="dialogVisible"
            v-model="dialogVisible"
            custom-class="cssp-dialog-s">
            <span slot="title">{{ type === 'add' ? '新增' : '编辑' }}</span>
            <div v-loading="loading">
                <input
                    ref="file"
                    type="file"
                    accept=".zip"
                    name="params.file"
                    style="display: none"
                    @change="preDetectUplaodFile">
                <el-form
                    v-model="formValid"
                    label-width="120px"
                    :rules="rules"
                    :model="params">
                    <el-form-item
                        label="采集器类型："
                        prop="name">
                        <el-input
                            v-model="params.name"
                            size="small"
                            placeholder="请输入采集器类型"
                            :disabled="type === 'edit'" />
                    </el-form-item>
                    <el-form-item
                        label="厂商："
                        prop="firm">
                        <el-input
                            v-model="params.firm"
                            size="small"
                            placeholder="请输入厂商（选填）" />
                    </el-form-item>
                    <el-form-item
                        label="产品："
                        prop="product">
                        <el-input
                            v-model="params.product"
                            size="small"
                            placeholder="请输入产品（选填）" />
                    </el-form-item>
                    <el-form-item
                        label="描述："
                        prop="_describe">
                        <el-input
                            v-model="params._describe"
                            size="small"
                            placeholder="请输入描述（选填）" />
                    </el-form-item>
                    <el-form-item label="正则文件：">
                        <el-input
                            v-model="params.regexpPath"
                            size="small"
                            icon="document"
                            placeholder="请从zip格式中导入"
                            :readonly="true"
                            @click.native="preUploadFile" />
                    </el-form-item>
                </el-form>
                <popover :width="180" 
                         class="popover-zip">
                    <div>用于转换该类型采集器的日志格式</div>
                </popover>
            </div><span slot="footer">
                <el-button
                    type="primary"
                    :disabled="isSubmitDisabled"
                    @click="submit">确定</el-button>
                <el-button @click="dialogVisible = !dialogVisible">取消</el-button></span>
        </el-dialog>
    </div>
</template>

<script>

/** 
 * 采集器支持列表弹窗
*/

import CryptoJS from 'crypto-js';
import dialog from 'src/common/mixins/dialog';
import popover from 'src/common/components/form_tips/popover';
import rules from './collector_rule';
import {
    detectFile,
    uploadFile,
    addCollectorType,
    updateCollectorType
} from 'src/common/api/asset_center';
import { REG_FILE_MAX_SIZE } from 'src/utils/consts';

const FAIL_MSG_TITLE = '文件上传失败';
export default {
    components: {
        popover  
    },
    mixins: [dialog],
    data () {
        return {
            params: {
                id: '',
                name: '',
                regexpPath: '',
                fileId: '',
                file: '',
                product: '',
                firm: '',
                _describe: ''
            },
            formValid: false,
            rules,
            type: 'add',
            isDetectingFile: false
        };
    },

    computed : {

        // 提交按钮禁用
        isSubmitDisabled () {
            return this.loading || !this.formValid || !this.params.regexpPath || this.isDetectingFile;
        }
    },

    methods: {

        // 初始化弹框数据
        init (payload = {}) {
            this.params.id = payload.id || '';
            this.params.name = payload.name || '';
            this.params.firm = payload.firm || '';
            this.params.product = payload.product || '';
            this.params._describe = payload._describe || '';
            this.params.regexpPath = 
                this.type === 'edit' ? 'regexp_file' : '';
        },

        // 编辑/新增弹框初始化参数
        handleOpen (payload = {}) {
            if (payload && !payload.id) {
                this.formValid = false;
                this.type = 'add';
            } else {
                this.formValid = true;
                this.type = 'edit';
            }
            this.dialogVisible = true;
            this.init(payload);
        },

        loadMd5 (file) {
            let lastModified;
            if (file.lastModified) {

                // chrome
                lastModified = file.lastModified;
            } else if (file.lastModifiedDate) {

                // IE
                lastModified = file.lastModifiedDate.getTime();
            }
            const ORIGIN = `${lastModified}${file.name}${file.size}${file.type}`;
            
            return CryptoJS.MD5(ORIGIN).toString();
        },

        // 获取提交参数
        resolveSubmitParams () {
            return {
                id: this.type === 'edit' ? this.params.id : void(0),
                name: this.params.name,
                file_id: (this.type === 'add' || this.$refs.file.files[0]) ? this.params.fileId : 'regexp_file',
                product: this.params.product,
                firm: this.params.firm,
                _describe: this.params._describe
            };
        },

        // 触发隐藏的 ref="file" input
        preUploadFile () {
            if (this.$refs.file) {
                this.$refs.file.click();
            }
        },

        // 上传文件触发事件，对文件格式和大小进行限制
        preDetectUplaodFile () {
            if (!this.$refs.file) {
                return;
            }
            let file = this.$refs.file.files[0];
            if (!/.\.zip$/i.test(file.name)) {
                this.$error('请上传zip格式文件', FAIL_MSG_TITLE);
                
                return;
            }
            if (file.size > REG_FILE_MAX_SIZE) {
                this.$error('文件大小不超过10M', FAIL_MSG_TITLE);
                return;
            } 
            this.detectUploadFile();
        },

        // 探测正则文件的参数
        resolveDetectFileParam (file) {
            return {
                file_md5: this.loadMd5(file),
                file_size: file.size,
                file_name: file.name,
                continue: 1
            };
        },

        // 探测正则文件接口
        detectUploadFile () {
            this.params.file = this.$refs.file.files[0];
            this.params.regexpPath = this.params.file.name;
            let params = this.resolveDetectFileParam(this.params.file);
            this.isDetectingFile = true;
            detectFile(params)
                .then((res) => {
                    this.isDetectingFile = false;
                    this.params.fileId = res.data.data.file_id;
                    if (res.data.data.is_last) {
                        return;
                    }
                    this.uploadFile(res.data.data);
                })
                .catch((err) => {
                    this.$error(err, FAIL_MSG_TITLE);
                });
        },

        // 上传文件的参数
        resolveUploadFile (data) {
            let fd = new FormData();
            fd.append('file_chunk', data.has_upd_cnt);
            fd.append('file_id', data.file_id);
            fd.append('system_file', this.params.file);
            fd.append('action', 'upload_file');
            return fd;
        },

        // 上传文件
        uploadFile (data) {
            let params = this.resolveUploadFile(data);
            uploadFile(params)
                .then(() => {})
                .catch((err) => {
                    this.$error(err, FAIL_MSG_TITLE);
                });
        },

        // 提交新增/编辑接口
        submit () {
            this.loading = true;
            let params = this.resolveSubmitParams(); 
            let submitFn = this.type === 'add' ? addCollectorType : updateCollectorType;
            submitFn(params)
                .then(() => {
                    this.$emit('load-table-data');
                    this.loading = false;
                    this.dialogVisible = false;
                })
                .catch((err) => {
                    let operateType = this.type === 'add' ? '新增' : '编辑';
                    this.$error(err.data.mesg, `${operateType}采集器失败`);
                    this.loading = false;
                });
        }
    }
}; 
</script>
<style scoped>
.popover-zip{
    position: absolute;
    right: 20px;
    bottom: 106px;
}
</style>
