/**
 * @file 权限相关模块
 */

let state = {
    riskSelection: []
};

let mutations = {
    SET_RISK_SELECTIONS (state, riskSelection) {
        state.riskSelection = riskSelection;
    }
};

let getters = {
    riskSelection: state => state.riskSelection
};

let actions = {
    setRiskSelections ({ commit }, riskSelection) {
        commit('SET_RISK_SELECTIONS', riskSelection);
    }
};

export default {
    getters,
    state,
    mutations,
    actions
};
