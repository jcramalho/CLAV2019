import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    criacaoTabSel: {},
    user: {
      id: '',
      name: '',
      entidade: '',
      token: ''
    },
  },
  mutations: {},
  actions: {}
});
