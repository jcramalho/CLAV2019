import Vue from "vue";
import Vuex from "vuex";

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
  mutations: {},
  actions: {}
});
