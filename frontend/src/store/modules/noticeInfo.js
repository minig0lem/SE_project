import createPersistedState from "vuex-persistedstate";
const persistedState = createPersistedState({
  key: "notice-Info",
  storage: window.localStorage,
});

const noticeInfo = {
  namespaced: true,
  plugins: [persistedState],
  // store.state로 접근, 직접 수정 x, mutations를 이용
  state: {
    notice: {},
  },
  // store.getters로 접근
  getters: {
    getNotice: (state) => state.notice,
  },
  // store.commit으로 접근, 두번째 인수로 payload(데이터) 가능.
  mutations: {
    SET_NOTICE(state, notice) {
      state.notice = notice;
    },
  },
  // store.dispatch로 접근, context개체와 payload 인수로 가능.
  actions: {
    setNotice({ commit }, notice) {
      commit("SET_NOTICE", notice);
    },
  },
};
export default noticeInfo;
