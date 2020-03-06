<template>
    <div class="dioalog-collector-type-wrapper">
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
                        label="采集器类型:"
                        prop="name">
                        <el-input
                            v-model="params.name"
                            size="small"
                            placeholder="请输入采集器类型"
                            :disabled="type === 'edit'" />
                    </el-form-item>
                    <el-form-item
                        label="适用系统:"
                        prop="system">
                        <el-input
                            v-model="params.system"
                            size="small"
                            placeholder="请输入适用系统（选填）" />
                    </el-form-item>
                    <el-form-item label="正则文件:">
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
import rules from './collecotr_type_rule';
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
                system: '',
                regexpPath: '',
                fileId: '',
                file: ''
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

        init (payload = {}) {
            this.params.id = payload.id || '';
            this.params.name = payload.name || '';
            this.params.system = payload._systems || '';
            this.params.regexpPath = 
                this.type === 'edit' ? 'regexp_file' : '';
        },

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

        resolveDetectFileParam (file) {
            return {
                file_md5: this.loadMd5(file),
                file_size: file.size,
                file_name: file.name,
                continue: 1
            };
        },

        resolveUploadFile (data) {
            let fd = new FormData();
            fd.append('file_chunk', data.has_upd_cnt);
            fd.append('file_id', data.file_id);
            fd.append('system_file', this.params.file);
            fd.append('action', 'upload_file');
            return fd;
        },

        resolveSubmitParams () {
            return {
                id: this.type === 'edit' ? this.params.id : void(0),
                name: this.params.name,
                file_id: (this.type === 'add' || this.$refs.file.files[0]) ? this.params.fileId : 'regexp_file',
                _systems: this.params.system
            };
        },

        preUploadFile () {
            if (this.$refs.file) {
                this.$refs.file.click();
            }
        },

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

        prefixSubmit (msg) {
            let operateType = this.type === 'add' ? '新增' : '编辑';
            this.$error(msg, `${operateType}采集器失败`);
            this.loading = false;
        },

        prefixUpload (msg) {
            this.$error(msg, FAIL_MSG_TITLE)
                .then(() => {})
                .catch(() => {});
        },

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

        uploadFile (data) {
            let params = this.resolveUploadFile(data);
            uploadFile(params)
                .then(() => {})
                .catch((err) => {
                    this.$error(err, FAIL_MSG_TITLE);
                });
        },

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
                    this.prefixSubmit(err.data.mesg);
                });

            
        }
    }
}; 
</script>
<style scoped>
.popover-zip{
    position: absolute;
    left: 102px;
    bottom: 106px;
}
</style>
