import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    criacaoTabSel: {
      tipo: '',
      designacao: '',
      idEntidade: '',
      tipologias: []
    },
    user: {
      name: '',
      token: ''
    },
  },
  plugins: [createPersistedState()],
  mutations: {
    guardaTokenUtilizador (state, token) {
      state.user.token = token;
    },
    guardaNomeUtilizador (state, nome) {
      state.user.name = nome;
    }
  },
  actions: {}
});
