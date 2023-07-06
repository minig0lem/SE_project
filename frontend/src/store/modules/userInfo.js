// import axios from 'axios'
import createPersistedState from "vuex-persistedstate";
const persistedState = createPersistedState({
  key: "user-Info",
  storage: window.localStorage,
});

const userInfo = {
  namespaced: true,
  plugins: [persistedState],
  // store.state로 접근, 직접 수정 x, mutations를 이용
  state: {
    user: {},
  },
  // store.getters로 접근
  getters: {
    getUser: (state) => state.user,
  },
  // store.commit으로 접근, 두번째 인수로 payload(데이터) 가능.
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
  },
  // store.dispatch로 접근, context개체와 payload 인수로 가능.
  actions: {
    setUser({ commit }, user) {
      commit("SET_USER", user);
    },
  },
};
export default userInfo;
