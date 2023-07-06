import createPersistedState from "vuex-persistedstate";
const persistedState = createPersistedState({
  key: "subject-Info",
  storage: window.localStorage,
});

const subjectInfo = {
  namespaced: true,
  plugins: [persistedState],
  // store.state로 접근, 직접 수정 x, mutations를 이용
  state: {
    subject: null,
  },
  // store.getters로 접근
  getters: {
    getSubject: (state) => state.subject,
  },
  // store.commit으로 접근, 두번째 인수로 payload(데이터) 가능.
  mutations: {
    SET_SUBJECT(state, subject) {
      state.subject = subject;
    },
  },
  // store.dispatch로 접근, context개체와 payload 인수로 가능.
  actions: {
    setSubject({ commit }, subject) {
      commit("SET_SUBJECT", subject);
    },
  },
};
export default subjectInfo;
