import createPersistedState from "vuex-persistedstate";
const persistedState = createPersistedState({
  key: "qna-Info",
  storage: window.localStorage,
});

const qnaInfo = {
  namespaced: true,
  plugins: [persistedState],
  // store.state로 접근, 직접 수정 x, mutations를 이용
  state: {
    qna: {},
  },
  // store.getters로 접근
  getters: {
    getQna: (state) => state.qna,
  },
  // store.commit으로 접근, 두번째 인수로 payload(데이터) 가능.
  mutations: {
    SET_QNA(state, qna) {
      state.qna = qna;
    },
  },
  // store.dispatch로 접근, context개체와 payload 인수로 가능.
  actions: {
    setQna({ commit }, qna) {
      commit("SET_QNA", qna);
    },
  },
};
export default qnaInfo;
