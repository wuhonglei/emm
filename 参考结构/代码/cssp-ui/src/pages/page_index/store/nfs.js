/**
 * @file NFS 外置存储模块
 */

import { getNFSStatus } from 'src/common/api/external_storage';

let state = {
    status: '',
    ip: '',
    path: '',
    errMsg: '',
    type: ''
};

let mutations = {
    SET_NFS_STATUS (state, status) {
        state.status = status;
    },
    SET_NFS_IP (state, IP) {
        state.ip = IP;
    },
    SET_NFS_PATH (state, path) {
        state.path = path;
    },
    SET_NFS_ERR_MSG (state, msg) {
        state.errMsg = msg;
    },
    SET_NFS_TYPE (state, type) {
        state.type = type;
    }
};

let actions = {
    async updateNFSStatus ({ commit }) {
        try {
            let res = await getNFSStatus();
            if (!res.data || !res.data.data) {
                throw new Error();
            }

            let data = res.data.data;
            commit('SET_NFS_STATUS', data.state);
            commit('SET_NFS_IP', data.ip);
            commit('SET_NFS_PATH', data.path);
            commit('SET_NFS_ERR_MSG', data.error_info);
            commit('SET_NFS_TYPE', data.type);
        } catch (err) {
            void(0);
        }
    }
};

let getters = {
    nfsInfo: state => ({ path: state.path, ip: state.ip }),
    nfsIsMounting: state => state.status === 'mounting',
    nfsIsUnloading: state => state.status === 'unmounting',
    nfsMounted: state => state.status === 'done',
    nfsUnloaded: state => !state.type,
    nfsIsError: state => state.status === 'error',
    nfsMountFailed: state => state.status === 'mount_failed',
    nfsUnloadFaild: state => state.status === 'unmount_failed',
    nfsErrMsg: state => state.errMsg
};

export default {
    getters,
    state,
    mutations,
    actions
};
