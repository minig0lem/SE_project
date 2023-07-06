import createPersistedState from "vuex-persistedstate";
const persistedState = createPersistedState({
  key: "assignment-Info",
  storage: window.localStorage,
});

const noticeInfo = {
  namespaced: true,
  plugins: [persistedState],
  // store.state로 접근, 직접 수정 x, mutations를 이용
  state: {
    assignment: {},
  },
  // store.getters로 접근
  getters: {
    getAssignment: (state) => state.assignment,
  },
  // store.commit으로 접근, 두번째 인수로 payload(데이터) 가능.
  mutations: {
    SET_ASSIGNMENT(state, assignment) {
      state.assignment = assignment;
    },
  },
  // store.dispatch로 접근, context개체와 payload 인수로 가능.
  actions: {
    setAssignment({ commit }, assignment) {
      commit("SET_ASSIGNMENT", assignment);
    },
  },
};
export default noticeInfo;
