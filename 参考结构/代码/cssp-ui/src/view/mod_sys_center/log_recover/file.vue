<template>
    <div class="recover-file-wrapper">
        <input
            ref="file"
            type="file"
            style="display:none;"
            name="params.file"
            @change="preDetectUplaodFile">
        <el-row v-if="status === 'init'">
            <el-col
                :span="10"
                :offset="6">
                <el-input
                    v-model="filename"
                    size="small"
                    icon="document"
                    :readonly="true"
                    :on-icon-click="() => {}"
                    placeholder="请选择要恢复的文件（.tgz）"
                    @click.native="handleIconClick" />
            </el-col>
        </el-row>
        <el-row v-if="status === 'running' || status === 'failed'">
            <el-col
                class="fix-position"
                :span="10"
                :offset="6">
                <el-progress
                    :stroke-width="18"
                    text-inside="text-inside"
                    :percentage="process" />
                <p class="text-recover">
                    正在上传(文件：{{ filename }}) ...
                </p>
            </el-col>
            <el-col
                :span="5"
                :offset="1">
                <el-button
                    type="text"
                    @click="cancelUpload()">
                    取消
                </el-button>
                <el-button
                    v-if="status === 'failed'"
                    type="text"
                    @click="handleIconClick">
                    重新上传
                </el-button>
            </el-col>
        </el-row>
        <el-row v-if="status === 'recover'">
            <el-col
                class="fix-position"
                :span="10"
                :offset="6">
                <el-progress
                    :stroke-width="18"
                    text-inside="text-inside"
                    :percentage="recoverState" />
                <p class="text-recover">
                    正在恢复(文件：{{ recoverFilename }}) ...
                </p>
                <p class="text-recover">
                    预计剩余时间：{{ remainTime }} 分钟
                </p>
            </el-col>
        </el-row>
    </div>
</template>
<script>

/**
 * 日志恢复，文件上传组件
 */

const MIN_TIMER = 60;   // 分钟换算成秒
import Bus, { BUS_EVENT } from 'src/utils/bus';
import CryptoJS from 'crypto-js';
import {
    detectFile,
    uploadFile,
    cancelUpload,
    cacelUploadFile
} from 'src/common/api/asset_center';
import { recoverLog, loadRecoverStatus } from 'src/common/api/manage';
import { clearInputFile } from 'src/utils/util';
import { CANCEL_REQUEST_MSG } from 'src/utils/consts';
import { Poll } from 'src/utils/api_help';
export default {
    data () {
        return {
            file: null, // 文件
            filename: '', // 文件名
            fileID: '', // 文件id，回传后端
            filePice: 0, // 文件分片大小，
            process: 0, // 文件上传进度
            status: 'init',
            cancel: false, // 是否手动终止上传，解决手动取消报错的问题
            recoverState: 0,
            recoverFilename: '',
            remainTime: '',   //恢复任务的剩余时间
            isCancelUpload: false
        };
    },
    mounted () {
        sessionStorage.setItem('isUploadingFile', false);

        //  ...开启轮询,检测是否有正在恢复的文件
        this.getRecoverStatus();
    },
    beforeDestroy () {

        //  ...关闭轮询
        if (this.poll && this.poll.isRunning()) {
            this.poll.stop();
            this.poll = null;
        }
    },
    methods: {
        preDetectUplaodFile () {
            if (!this.$refs.file) {
                return;
            }
            this.file = this.$refs.file.files[0];
            let filename = this.file.name;

            const POSITION = -3;
            if (filename.slice(POSITION) !== 'tgz') {
                this.$error('恢复文件只支持.tgz格式');
                return false;
            }

            this.filename = filename;
            this.detectUploadFile();
        },

        detectUploadFile () {
            let params = this.resolveDetectFileParam(this.file);
            detectFile(params)
                .then((res) => {
                    if (!res.data && !res.data.data) {
                        return;
                    }
                    this.filePice =  res.data.data.chunk_file_size;
                    this.fileID = res.data.data.file_id;
                    this.uploadFile(res.data.data);
                })
                .catch((err) => {
                    this.$error(err, '获取文件信息失败');
                });
        },
        
        uploadFile (data) {
            if (this.isCancelUpload) {
                return;
            }
            let params = this.resolveUploadFile(data);
            this.status = 'running';
            sessionStorage.setItem('isUploadingFile', true);  // 正在上传时不允许切页面，用于ROUTER.beforeEach
            uploadFile(params)
                .then((res) => {
                    if (!res.data && !res.data.data) {
                        return;
                    }

                    this.process = parseInt(res.data.data.process, 10);

                    if (res.data.data.is_last) {
                        sessionStorage.setItem('isUploadingFile', false);
                        this.uploadSuccess();
                        return;
                    }
                    this.uploadFile(res.data.data);
                })
                .catch((err) => {
                    sessionStorage.setItem('isUploadingFile', false);

                    //清空原文件
                    this.clearInputFile();
                    
                    // 调用了取消上传接口
                    if (this.cancel) {
                        this.cancel = false;
                        return;
                    }
                    if (err && err.message === CANCEL_REQUEST_MSG) {
                        return;
                    }
                    this.$error(err, '上传文件失败');
                    this.status = 'failed';
                });
        },

        resolveUploadFile (data = {}) {
            let hasUploadCnt = data.has_upd_cnt || 0;

            // 分片开始
            let blobFrom = hasUploadCnt * this.filePice;

            // 分片结束
            let blobTo =
                (hasUploadCnt + 1) * this.filePice > this.file.size ?
                    this.file.size :
                    (hasUploadCnt + 1) * this.filePice;


            let fd = new FormData();
            fd.append('file_chunk', hasUploadCnt);
            fd.append('file_id', this.fileID);
            fd.append('system_file', this.file.slice(blobFrom, blobTo));
            fd.append('action', 'upload_file');
            return fd;
        },

        resolveDetectFileParam (file) {
            return {
                file_md5: this.loadMd5(file),
                file_size: file.size,
                file_name: file.name,
                continue: 1
            };
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

        uploadSuccess () {
            this.$confirm('上传文件成功，是否立即执行恢复任务，恢复后会覆盖当前现有日志。', '确定要恢复吗？', {
                type: 'warning'
            })
                .then(() => {
                    this.recoverLog();
                })
                .catch(() => {
                    this.cancelUpload(true);
                });
        },

        handleIconClick () {
            let fileBtn = this.$el.querySelector('input[type="file"]');
            fileBtn.click();
        },

        cancelUpload (isRecover) {
            let params = {
                file_id: this.fileID
            };
            this.isCancelUpload = true;
            sessionStorage.setItem('isUploadingFile', false);
            cancelUpload(params)
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: isRecover ? '取消恢复成功' : '取消文件上传成功'
                    });
                    cacelUploadFile();
                    this.isCancelUpload = false;
                    this.status = 'init';

                    //正在上传中置为取消状态，上传失败点击取消不修改状态
                    if (this.status === 'running') {
                        this.cancel = true;
                    }
                    this.clearInputFile();
                })
                .catch((err) => {
                    this.isCancelUpload = false;
                    this.$error(err, isRecover ? '取消恢复失败' : '取消文件上传失败');
                });
        },

        recoverLog () {
            let params = {
                filename: this.filename,
                file_id: this.fileID
            };
            recoverLog(params)
                .then(() => {
                    this.status = 'init';

                    //  刷新表格
                    Bus.$emit(BUS_EVENT.LOAD_RECOVER_TABLE_DATA);

                    //  获取恢复状态
                    this.getRecoverStatus();
                })
                .catch((err) => {
                    this.$error(err, '恢复日志失败');
                });
        },

        getRecoverStatus () {
            let self = this;

            //  创建获取正在恢复的文件的轮询
            this.poll = new Poll(loadRecoverStatus, {
                delay: '1000',      //间隔1000ms
                wait: {
                    delay: 0        //如果请求超时，
                },
                onSuccess ({data}, stop) {
                    if (data.data && data.data[0]) {
                        self.status = 'recover';
                        self.recoverFilename = data.data[0].recover_file;
                        self.remainTime = Math.ceil(data.data[0].remain_time / MIN_TIMER);
                        self.recoverState = data.data[0].progress;
                        return;
                    }
                    stop();
                    self.handleRecoverFinished();
                },
                onFailed (_, stop) {
                    
                    //  请求失败时，停止请求
                    stop();
                    self.status = 'init';
                }
            });
            this.poll.start();
        },

        handleRecoverFinished () {
            this.status = 'init';
            Bus.$emit(BUS_EVENT.LOAD_RECOVER_TABLE_DATA);
            this.clearInputFile();
        },

        // 清除选中文件，上传进度
        clearInputFile () {
            this.filename = '';
            this.process = 0;
            clearInputFile(this.$el.querySelector('input[type="file"]'));
        }
    }
};
</script>

<style lang="postcss">
.recover-file-wrapper {
    height: 100%;
    padding-top: 80px;
    & .fix-position {
        padding-top: 6px;
    }
    & .text-recover {
        color: #D3DCE6;
        text-align: left;
    }
}
</style>
